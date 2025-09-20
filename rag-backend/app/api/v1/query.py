from fastapi import APIRouter, HTTPException, Depends
from app.models.query import QueryRequest, QueryResponse
from app.services.query_service import query_ragbot
from app.services.chat_service import chat_service
from app.utils.logger import get_common_logger, log_api_endpoint
from app.core.auth import require_auth
from app.core.config import settings

router = APIRouter()
logger = get_common_logger()

@router.post("/", response_model=QueryResponse)
@log_api_endpoint(log_request=True, log_response=True, log_performance=True)
def query_endpoint(request: QueryRequest, current_user: dict = Depends(require_auth)):
    """
    Query endpoint for RAG chatbot with thread management (requires JWT authentication).
    
    Args:
        request: QueryRequest containing the user's question and optional thread_id
        current_user: Authenticated user information from JWT token
        
    Returns:
        QueryResponse: Response containing the answer and thread_id
        
    Raises:
        HTTPException: For various error conditions
    """
    question = request.question
    thread_id = request.thread_id
    user_email = current_user.get('email', 'unknown')
    
    logger.info(f"Received query request from user {user_email}: {question[:100]}{'...' if len(question) > 100 else ''}")
    
    # Validate input
    if not question or not question.strip():
        logger.warning("Empty question received in query request")
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    
    if len(question) > 1000:  # Reasonable limit
        logger.warning(f"Question too long: {len(question)} characters")
        raise HTTPException(status_code=400, detail="Question too long (max 1000 characters)")

    # Check if user has requests available
    if not chat_service.can_user_send_message(user_email):
        requests_available = chat_service.get_user_requests_available(user_email)
        logger.warning(f"User {user_email} has no requests available: {requests_available}/{settings.MAX_MESSAGES_PER_USER}")
        raise HTTPException(
            status_code=429, 
            detail=f"Request limit exceeded. You have {requests_available} requests remaining out of {settings.MAX_MESSAGES_PER_USER}. Please contact support to increase your limit."
        )

    # Handle thread management
    if not thread_id:
        # Create new thread with question as title
        thread_title = question[:50] + "..." if len(question) > 50 else question
        thread_id = chat_service.create_thread(user_email, thread_title)
        logger.info(f"Created new thread {thread_id} for user {user_email}")
    else:
        # Verify existing thread belongs to user
        thread = chat_service.get_thread(thread_id, user_email)
        if not thread:
            logger.warning(f"Thread {thread_id} not found or not owned by user {user_email}")
            raise HTTPException(status_code=404, detail="Thread not found")
        logger.info(f"Using existing thread {thread_id} for user {user_email}")

    # Add user message to thread
    try:
        chat_service.add_message_to_thread(thread_id, user_email, question, "user")
        logger.debug(f"Added user message to thread {thread_id}")
    except ValueError as e:
        logger.error(f"Failed to add message to thread: {e}")
        raise HTTPException(status_code=500, detail="Failed to save user message")

    # Call your query service which handles RAG + LLaMA generation
    logger.debug("Calling query service")
    answer = query_ragbot(question)
    
    if not answer:
        logger.warning("Query service returned empty answer")
        answer = "I apologize, but I couldn't generate a response for your question."

    # Add assistant response to thread
    try:
        chat_service.add_message_to_thread(thread_id, user_email, answer, "assistant")
        logger.debug(f"Added assistant response to thread {thread_id}")
    except ValueError as e:
        logger.error(f"Failed to add assistant response to thread: {e}")
        # Don't fail the request, just log the error

    # Decrement user's available requests
    remaining_requests = chat_service.decrement_user_requests(user_email)
    logger.info(f"User {user_email} has {remaining_requests} requests remaining")

    logger.info(f"Query processed successfully, response length: {len(answer)}, thread: {thread_id}")
    return QueryResponse(answer=answer, thread_id=thread_id)
