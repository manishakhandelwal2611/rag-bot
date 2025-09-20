from pydantic import BaseModel
from typing import Optional


class QueryRequest(BaseModel):
    question: str
    thread_id: Optional[str] = None  # If None, create new thread


class QueryResponse(BaseModel):
    answer: str
    thread_id: str  # Always return thread_id (existing or newly created)