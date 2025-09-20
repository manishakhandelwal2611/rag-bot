"""
Redis connection service for chat history with simplified structure.
"""

import json
import redis
import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from app.core.config import settings
from app.utils.logger import get_common_logger

logger = get_common_logger()


class ChatService:
    """Service for Redis connection and basic chat operations with simplified structure."""
    
    def __init__(self):
        """Initialize Redis connection."""
        self.redis_client = redis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            password=settings.REDIS_PASSWORD if settings.REDIS_PASSWORD else None,
            db=settings.REDIS_DB,
            decode_responses=True
        )
        self.chat_ttl = settings.REDIS_CHAT_TTL
        logger.info(f"Connected to Redis at {settings.REDIS_HOST}:{settings.REDIS_PORT}")
    
    def _get_user_key(self, user_email: str) -> str:
        """Get the main key for user's chat data."""
        return f"chat:user:{user_email}"
    
    def _get_user_data(self, user_email: str) -> Dict[str, Any]:
        """Get user's chat data from Redis."""
        user_key = self._get_user_key(user_email)
        user_data = self.redis_client.get(user_key)
        
        if not user_data:
            return {"threads": []}
        
        try:
            return json.loads(user_data)
        except json.JSONDecodeError as e:
            logger.error(f"Error parsing user data for {user_email}: {e}")
            return {"threads": []}
    
    def _save_user_data(self, user_email: str, user_data: Dict[str, Any]) -> None:
        """Save user's chat data to Redis."""
        user_key = self._get_user_key(user_email)
        logger.debug(f"Redis object {self.redis_client}")
        self.redis_client.setex(user_key, self.chat_ttl, json.dumps(user_data))
    
    def create_thread(self, user_email: str, title: str) -> str:
        """Create a new thread and return thread_id."""
        thread_id = str(uuid.uuid4())
        now = datetime.utcnow()
        
        # Get user's data
        user_data = self._get_user_data(user_email)
        
        # Create new thread
        new_thread = {
            "id": thread_id,
            "title": title,
            "created_at": now.isoformat(),
            "updated_at": now.isoformat(),
            "messages": []
        }
        
        # Add thread to user's data
        user_data["threads"].append(new_thread)
        # Save back to Redis
        self._save_user_data(user_email, user_data)
        
        logger.info(f"Created thread {thread_id} for user {user_email}")
        return thread_id
    
    def get_thread(self, thread_id: str, user_email: str) -> Optional[Dict[str, Any]]:
        """Get thread data if it exists and user owns it."""
        user_data = self._get_user_data(user_email)
        
        for thread in user_data["threads"]:
            if thread["id"] == thread_id:
                return thread
        
        return None
    
    def add_message_to_thread(self, thread_id: str, user_email: str, content: str, role: str = "user") -> str:
        """Add a message to a thread and return message_id."""
        message_id = str(uuid.uuid4())
        now = datetime.utcnow()
        
        # Get user's data
        user_data = self._get_user_data(user_email)
        
        # Find the thread
        thread_found = False
        for thread in user_data["threads"]:
            if thread["id"] == thread_id:
                # Create new message
                new_message = {
                    "id": message_id,
                    "role": role,
                    "content": content,
                    "timestamp": now.isoformat()
                }
                
                # Add message to thread
                thread["messages"].append(new_message)
                thread["updated_at"] = now.isoformat()
                thread_found = True
                break
        
        if not thread_found:
            raise ValueError(f"Thread {thread_id} not found for user {user_email}")
        # Save back to Redis
        self._save_user_data(user_email, user_data)
        
        logger.info(f"Added message {message_id} to thread {thread_id}")
        return message_id
    
    def get_user_threads(self, user_email: str) -> List[Dict[str, Any]]:
        """Get all threads for a user."""
        user_data = self._get_user_data(user_email)
        return user_data["threads"]
    
    def get_user_message_count(self, user_email: str) -> int:
        """Get assistant message count for a user across all threads."""
        user_data = self._get_user_data(user_email)
        assistant_messages = 0
        
        for thread in user_data["threads"]:
            messages = thread.get("messages", [])
            for message in messages:
                if message.get("role") == "assistant":
                    assistant_messages += 1
        
        return assistant_messages
    
    def can_user_send_message(self, user_email: str, max_messages: int) -> bool:
        """Check if user can send another message based on limit."""
        current_count = self.get_user_message_count(user_email)
        return current_count < max_messages
    
    def health_check(self) -> bool:
        """Check if Redis connection is healthy."""
        try:
            self.redis_client.ping()
            return True
        except Exception as e:
            logger.error(f"Redis health check failed: {e}")
            return False
    


# Global instance
chat_service = ChatService()
