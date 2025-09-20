from fastapi import APIRouter
from app.api.v1 import ingest, query, chat

# Create a router for all v1 endpoints
router = APIRouter()

# Include individual routers
router.include_router(ingest.router, prefix="/ingest", tags=["Ingestion"])
router.include_router(query.router, prefix="/query", tags=["Query"])
router.include_router(chat.router, prefix="/chat", tags=["Chat"])
