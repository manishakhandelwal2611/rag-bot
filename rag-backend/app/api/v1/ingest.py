from fastapi import APIRouter, Query, HTTPException, Depends
from app.services.query_service import query_ragbot
from app.utils.logger import get_common_logger, log_api_endpoint
from app.core.auth import require_auth

router = APIRouter()
logger = get_common_logger()

@router.get("/")
@log_api_endpoint(log_request=True, log_response=True, log_performance=True)
async def query_rag(q: str = Query(..., description="Question for RAG chatbot"), current_user: dict = Depends(require_auth)):
    """
    GET endpoint for querying the RAG chatbot (requires JWT authentication).
    
    Args:
        q: The question to ask the RAG chatbot
        current_user: Authenticated user information from JWT token
        
    Returns:
        dict: Response containing the query and answer
        
    Raises:
        HTTPException: For various error conditions
    """
    logger.info(f"Received GET query request from user {current_user.get('email', 'unknown')}: {q[:100]}{'...' if len(q) > 100 else ''}")
    
    # Validate input
    if not q or not q.strip():
        logger.warning("Empty query received in GET request")
        raise HTTPException(status_code=400, detail="Query parameter cannot be empty")
    
    if len(q) > 1000:  # Reasonable limit
        logger.warning(f"Query too long: {len(q)} characters")
        raise HTTPException(status_code=400, detail="Query too long (max 1000 characters)")

    logger.debug("Processing GET query request")
    response = query_ragbot(q)
    
    if not response:
        logger.warning("Query service returned empty response for GET request")
        response = "I apologize, but I couldn't generate a response for your question."
    
    logger.info(f"GET query processed successfully, response length: {len(response)}")
    return {"query": q, "response": response}
