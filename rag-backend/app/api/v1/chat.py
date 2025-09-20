"""
Chat API endpoints for thread and message management.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from app.core.auth import require_auth
from app.models.chat import (
    ThreadListResponse, 
    ThreadResponse,
    MessageListResponse,
    DeleteThreadResponse,
    UserLimitsResponse
)
from app.handlers.chat_handler import chat_handler
from app.utils.logger import get_common_logger, log_api_endpoint

logger = get_common_logger()
router = APIRouter()


@router.get("/threads", response_model=ThreadListResponse)
@log_api_endpoint(log_request=True, log_response=True, log_performance=True)
async def get_user_threads(
    page: int = Query(1, ge=1, description="Page number (1-based)"),
    page_size: int = Query(10, ge=1, le=100, description="Number of threads per page (max 100)"),
    sort_by: str = Query("updated_at", description="Sort field (created_at, updated_at, title)"),
    sort_order: str = Query("desc", description="Sort order (asc, desc)"),
    current_user: dict = Depends(require_auth)
):
    """
    Get paginated list of user's chat threads.
    
    Args:
        page: Page number (1-based)
        page_size: Number of threads per page (max 100)
        sort_by: Sort field (created_at, updated_at, title)
        sort_order: Sort order (asc, desc)
        current_user: Authenticated user information from JWT token
    
    Returns:
        ThreadListResponse: Paginated list of threads
    """
    try:
        user_email = current_user.get('email', 'unknown')
        return chat_handler.get_user_threads_paginated(
            user_email=user_email,
            page=page,
            page_size=page_size,
            sort_by=sort_by,
            sort_order=sort_order
        )
    except Exception as e:
        logger.error(f"Error retrieving threads for user {current_user.get('email', 'unknown')}: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve threads")


@router.get("/threads/{thread_id}", response_model=ThreadResponse)
@log_api_endpoint(log_request=True, log_response=True, log_performance=True)
async def get_thread(
    thread_id: str,
    current_user: dict = Depends(require_auth)
):
    """
    Get a specific thread by ID.
    
    Args:
        thread_id: Thread ID
        current_user: Authenticated user information from JWT token
    
    Returns:
        ThreadResponse: Thread data with messages
    """
    try:
        user_email = current_user.get('email', 'unknown')
        return chat_handler.get_thread_by_id(thread_id, user_email)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error retrieving thread {thread_id} for user {current_user.get('email', 'unknown')}: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve thread")


@router.get("/threads/{thread_id}/messages", response_model=MessageListResponse)
@log_api_endpoint(log_request=True, log_response=True, log_performance=True)
async def get_thread_messages(
    thread_id: str,
    page: int = Query(1, ge=1, description="Page number (1-based)"),
    page_size: int = Query(20, ge=1, le=100, description="Number of messages per page (max 100)"),
    sort_order: str = Query("asc", description="Sort order (asc, desc) - asc for chronological order"),
    current_user: dict = Depends(require_auth)
):
    """
    Get paginated messages from a specific thread.
    
    Args:
        thread_id: Thread ID
        page: Page number (1-based)
        page_size: Number of messages per page (max 100)
        sort_order: Sort order (asc, desc) - asc for chronological order
        current_user: Authenticated user information from JWT token
    
    Returns:
        MessageListResponse: Paginated list of messages
    """
    try:
        user_email = current_user.get('email', 'unknown')
        return chat_handler.get_thread_messages_paginated(
            thread_id=thread_id,
            user_email=user_email,
            page=page,
            page_size=page_size,
            sort_order=sort_order
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error retrieving messages from thread {thread_id} for user {current_user.get('email', 'unknown')}: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve messages")


@router.delete("/threads/{thread_id}", response_model=DeleteThreadResponse)
@log_api_endpoint(log_request=True, log_response=True, log_performance=True)
async def delete_thread(
    thread_id: str,
    current_user: dict = Depends(require_auth)
):
    """
    Delete a specific thread.
    
    Args:
        thread_id: Thread ID to delete
        current_user: Authenticated user information from JWT token
    
    Returns:
        DeleteThreadResponse: Deletion confirmation
    """
    try:
        user_email = current_user.get('email', 'unknown')
        result = chat_handler.delete_thread(thread_id, user_email)
        return DeleteThreadResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error deleting thread {thread_id} for user {current_user.get('email', 'unknown')}: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete thread")


@router.get("/limits", response_model=UserLimitsResponse)
@log_api_endpoint(log_request=True, log_response=True, log_performance=True)
async def get_user_limits(
    current_user: dict = Depends(require_auth)
):
    """
    Get user's request limits and usage.
    
    Args:
        current_user: Authenticated user information from JWT token
    
    Returns:
        UserLimitsResponse: User's request limits and usage
    """
    try:
        user_email = current_user.get('email', 'unknown')
        from app.services.chat_service import chat_service
        from app.core.config import settings
        
        requests_available = chat_service.get_user_requests_available(user_email)
        max_requests = settings.MAX_MESSAGES_PER_USER
        requests_used = max_requests - requests_available
        
        return UserLimitsResponse(
            requests_available=requests_available,
            max_requests=max_requests,
            requests_used=requests_used
        )
    except Exception as e:
        logger.error(f"Error retrieving limits for user {current_user.get('email', 'unknown')}: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve user limits")


