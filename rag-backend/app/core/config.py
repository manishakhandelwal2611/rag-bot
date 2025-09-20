from pydantic import Field, field_validator
from pydantic_settings import BaseSettings
import os
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "RAG Backend"
    PINECONE_API_KEY: str = Field(default="")
    PINECONE_ENV: str = Field(default="us-west4-gcp-free")
    PINECONE_INDEX: str = Field(default="rag-index")
    OPENAI_API_KEY: str = Field(default="")
    
    # Logging configuration
    LOG_LEVEL: str = Field(default="INFO")
    LOG_FILE: Optional[str] = Field(default="logs/app.log")
    ENABLE_CONSOLE_LOGGING: bool = Field(default=True)
    ENABLE_JSON_LOGGING: bool = Field(default=False)
    
    # RAG configuration
    RAG_CONFIDENCE_THRESHOLD: float = Field(default=0.3, description="Minimum confidence score to use RAG context")
    RAG_SIMILARITY_TOP_K: int = Field(default=5, description="Number of top similar documents to retrieve")
    
    # JWT Authentication configuration
    ALGORITHM: str = Field(default="HS256", description="JWT algorithm")
    GOOGLE_CLIENT_ID: str = Field(default="", description="Google OAuth client ID for token verification")
    
    # Redis configuration
    REDIS_HOST: str = Field(default="localhost", description="Redis server host")
    REDIS_PORT: int = Field(default=6379, description="Redis server port")
    REDIS_PASSWORD: str = Field(default="", description="Redis password (empty for no auth)")
    REDIS_DB: int = Field(default=0, description="Redis database number")
    REDIS_CHAT_TTL: int = Field(default=2592000, description="Chat history TTL in seconds (30 days)")
    
    # Message limit configuration
    MAX_MESSAGES_PER_USER: int = Field(default=30, description="Maximum assistant responses per user across all threads")
    
     # Configuration for loading from .env file
    model_config = {
        "env_file": ".env",
        "extra": "ignore"
    }
    
     # Validator to check Pinecone API key
    @field_validator("PINECONE_API_KEY")
    def validate_pinecone_key(cls, v, values):
        if not v:
            raise ValueError("PINECONE_API_KEY is missing in your .env file")
        return v

    @field_validator("OPENAI_API_KEY")
    def validate_openai_key(cls, v, values):
        if not v:
            raise ValueError("OPENAI_API_KEY is missing in your .env file")
        return v

settings = Settings()
