"""
Chat handler for processing chat-related business logic.
"""

from typing import List, Dict, Any
from app.models.chat import (
    ThreadListResponse, 
    ThreadResponse, 
    MessageListResponse,
    ChatThreadSummary,
    ChatThread,
    ChatMessage,
    MessageRole
)
from app.services.chat_service import chat_service
from app.utils.logger import get_common_logger

logger = get_common_logger()


class ChatHandler:
    """Handler for chat-related business logic operations."""
    
    @staticmethod
    def get_user_threads_paginated(
        user_email: str,
        page: int,
        page_size: int,
        sort_by: str,
        sort_order: str
    ) -> ThreadListResponse:
        """
        Get paginated list of user's chat threads.
        
        Args:
            user_email: User email
            page: Page number (1-based)
            page_size: Number of threads per page
            sort_by: Sort field (created_at, updated_at, title)
            sort_order: Sort direction (asc, desc)
        
        Returns:
            ThreadListResponse: Paginated list of threads
        """
        # Get all threads for user
        all_threads = chat_service.get_user_threads(user_email)
        
        # Sort threads
        reverse = sort_order.lower() == "desc"
        if sort_by == "created_at":
            all_threads.sort(key=lambda x: x["created_at"], reverse=reverse)
        elif sort_by == "updated_at":
            all_threads.sort(key=lambda x: x["updated_at"], reverse=reverse)
        elif sort_by == "title":
            all_threads.sort(key=lambda x: x["title"].lower(), reverse=reverse)
        else:
            # Default to updated_at
            all_threads.sort(key=lambda x: x["updated_at"], reverse=reverse)
        
        # Calculate pagination
        total_count = len(all_threads)
        total_pages = (total_count + page_size - 1) // page_size
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        
        # Get page of threads
        page_threads = all_threads[start_idx:end_idx]
        
        # Convert to ChatThreadSummary objects
        thread_summaries = []
        for thread in page_threads:
            thread_summary = ChatThreadSummary(
                id=thread["id"],
                title=thread["title"],
                created_at=thread["created_at"],
                updated_at=thread["updated_at"],
                message_count=len(thread["messages"])
            )
            thread_summaries.append(thread_summary)
        
        # Create response
        response = ThreadListResponse(
            threads=thread_summaries,
            total_count=total_count,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
            has_next=page < total_pages,
            has_previous=page > 1
        )
        
        logger.info(f"Retrieved {len(thread_summaries)} threads for user {user_email}")
        return response
    
    @staticmethod
    def get_thread_by_id(thread_id: str, user_email: str) -> ThreadResponse:
        """
        Get a specific thread by ID.
        
        Args:
            thread_id: Thread ID
            user_email: User email
        
        Returns:
            ThreadResponse: Thread data with messages
        
        Raises:
            ValueError: If thread not found
        """
        # Get thread
        thread = chat_service.get_thread(thread_id, user_email)
        
        if not thread:
            raise ValueError("Thread not found")
        
        # Convert messages to ChatMessage objects
        messages = []
        for msg in thread["messages"]:
            message = ChatMessage(
                id=msg["id"],
                role=MessageRole(msg["role"]),
                content=msg["content"],
                timestamp=msg["timestamp"]
            )
            messages.append(message)
        
        # Create ChatThread object
        chat_thread = ChatThread(
            id=thread["id"],
            title=thread["title"],
            created_at=thread["created_at"],
            updated_at=thread["updated_at"],
            messages=messages
        )
        
        response = ThreadResponse(
            thread=chat_thread,
            success=True,
            message="Thread retrieved successfully"
        )
        
        logger.info(f"Retrieved thread {thread_id} for user {user_email}")
        return response
    
    @staticmethod
    def get_thread_messages_paginated(
        thread_id: str,
        user_email: str,
        page: int,
        page_size: int,
        sort_order: str
    ) -> MessageListResponse:
        """
        Get paginated messages from a specific thread.
        
        Args:
            thread_id: Thread ID
            user_email: User email
            page: Page number (1-based)
            page_size: Number of messages per page
            sort_order: Sort direction (asc, desc)
        
        Returns:
            MessageListResponse: Paginated list of messages
        
        Raises:
            ValueError: If thread not found
        """
        # Get thread
        thread = chat_service.get_thread(thread_id, user_email)
        
        if not thread:
            raise ValueError("Thread not found")
        
        # Get messages
        messages = thread["messages"]
        
        # Sort messages
        reverse = sort_order.lower() == "desc"
        messages.sort(key=lambda x: x["timestamp"], reverse=reverse)
        
        # Calculate pagination
        total_count = len(messages)
        total_pages = (total_count + page_size - 1) // page_size
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        
        # Get page of messages
        page_messages = messages[start_idx:end_idx]
        
        # Convert to ChatMessage objects
        chat_messages = []
        for msg in page_messages:
            message = ChatMessage(
                id=msg["id"],
                role=MessageRole(msg["role"]),
                content=msg["content"],
                timestamp=msg["timestamp"]
            )
            chat_messages.append(message)
        
        # Create response
        response = MessageListResponse(
            messages=chat_messages,
            thread_id=thread_id,
            total_count=total_count,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
            has_next=page < total_pages,
            has_previous=page > 1
        )
        
        logger.info(f"Retrieved {len(chat_messages)} messages from thread {thread_id} for user {user_email}")
        return response


# Global instance
chat_handler = ChatHandler()
