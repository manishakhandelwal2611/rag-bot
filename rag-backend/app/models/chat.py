"""
Pydantic models for chat messages and threads with simplified structure.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class MessageRole(str, Enum):
    """Message roles in a conversation."""
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class ChatMessage(BaseModel):
    """Individual chat message model."""
    id: str = Field(description="Unique message ID")
    role: MessageRole = Field(description="Message role (user, assistant, system)")
    content: str = Field(description="Message content")
    timestamp: str = Field(description="Message timestamp (ISO format)")
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class ChatThread(BaseModel):
    """Chat thread model - a conversation between user and assistant."""
    id: str = Field(description="Unique thread ID")
    title: str = Field(description="Thread title")
    created_at: str = Field(description="Thread creation timestamp (ISO format)")
    updated_at: str = Field(description="Last message timestamp (ISO format)")
    messages: List[ChatMessage] = Field(default_factory=list, description="List of messages in thread")
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class ChatThreadSummary(BaseModel):
    """Chat thread summary model for listings (without messages)."""
    id: str = Field(description="Unique thread ID")
    title: str = Field(description="Thread title")
    created_at: str = Field(description="Thread creation timestamp (ISO format)")
    updated_at: str = Field(description="Last message timestamp (ISO format)")
    message_count: int = Field(description="Number of messages in thread")
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class UserChatData(BaseModel):
    """Complete user chat data model."""
    threads: List[ChatThread] = Field(default_factory=list, description="List of user's threads")
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


# Request/Response Models (for future API endpoints)

class BasePaginationRequest(BaseModel):
    """Base pagination request model."""
    page: int = Field(default=1, ge=1, description="Page number (1-based)")
    page_size: int = Field(default=10, ge=1, le=100, description="Number of items per page (max 100)")
    sort_order: str = Field(default="desc", description="Sort order (asc, desc)")


# Note: ThreadListRequest and MessageListRequest can use BasePaginationRequest directly
# with different default values when creating instances

class BasePaginationResponse(BaseModel):
    """Base pagination response model."""
    total_count: int = Field(description="Total number of items")
    page: int = Field(description="Current page number (1-based)")
    page_size: int = Field(description="Number of items per page")
    total_pages: int = Field(description="Total number of pages")
    has_next: bool = Field(description="Whether there are more pages")
    has_previous: bool = Field(description="Whether there are previous pages")


class ThreadListResponse(BasePaginationResponse):
    """Response model for listing user threads with pagination."""
    threads: List[ChatThreadSummary] = Field(description="List of user threads (without messages)")


class ThreadResponse(BaseModel):
    """Response model for a single thread."""
    thread: ChatThread = Field(description="Thread data")
    success: bool = Field(default=True, description="Operation success status")
    message: Optional[str] = Field(default=None, description="Response message")


class MessageListResponse(BasePaginationResponse):
    """Response model for listing messages in a thread with pagination."""
    messages: List[ChatMessage] = Field(description="List of messages")
    thread_id: str = Field(description="Thread ID")


class UserChatDataResponse(BaseModel):
    """Response model for complete user chat data."""
    user_data: UserChatData = Field(description="Complete user chat data")
    success: bool = Field(default=True, description="Operation success status")
    message: Optional[str] = Field(default=None, description="Response message")


class DeleteThreadResponse(BaseModel):
    """Response model for thread deletion."""
    success: bool = Field(description="Operation success status")
    message: str = Field(description="Response message")
    thread_id: str = Field(description="Deleted thread ID")


class UserLimitsResponse(BaseModel):
    """Response model for user request limits."""
    requests_available: int = Field(description="Number of requests remaining")
    max_requests: int = Field(description="Maximum requests allowed")
    requests_used: int = Field(description="Number of requests used")
