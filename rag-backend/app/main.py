from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import time
from app.api.v1 import router as v1_router
from app.core.config_openai import configure_openai # Ensure OpenAI config is loaded
from app.core.config import settings
from app.utils.logger import setup_logging, get_common_logger, log_api_request, log_api_response

# Initialize logging
setup_logging(
    log_level=settings.LOG_LEVEL,
    log_file=settings.LOG_FILE,
    enable_console=settings.ENABLE_CONSOLE_LOGGING,
    enable_json=settings.ENABLE_JSON_LOGGING
)

logger = get_common_logger()

app = FastAPI(
    title="RAG Chatbot Backend",
    description="A RAG (Retrieval-Augmented Generation) chatbot backend with comprehensive logging",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    # Log incoming request
    log_api_request(
        logger,
        method=request.method,
        path=str(request.url.path),
        query_params=dict(request.query_params),
        client_ip=request.client.host if request.client else None
    )
    
    # Process request
    response = await call_next(request)
    
    # Log response
    process_time = time.time() - start_time
    log_api_response(
        logger,
        status_code=response.status_code,
        response_time=process_time,
        response_size=response.headers.get("content-length", 0)
    )
    
    return response

@app.on_event("startup")
async def startup_event():
    """Application startup event."""
    logger.info("Starting RAG Chatbot Backend", extra={
        'extra_fields': {
            'project_name': settings.PROJECT_NAME,
            'log_level': settings.LOG_LEVEL,
            'log_file': settings.LOG_FILE
        }
    })
    configure_openai()
    logger.info("OpenAI configuration loaded successfully")

@app.on_event("shutdown")
async def shutdown_event():
    """Application shutdown event."""
    logger.info("Shutting down RAG Chatbot Backend")

# Health check
@app.get("/health")
async def health_check():
    logger.debug("Health check endpoint called")
    return {"status": "ok", "service": "RAG Chatbot Backend"}

# Include all v1 endpoints
app.include_router(v1_router, prefix="/api/v1")
