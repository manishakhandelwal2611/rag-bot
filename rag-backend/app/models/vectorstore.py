from pydantic import BaseModel, Field
from typing import Optional, Any


class VectorStoreComponents(BaseModel):
    """Schema for vector store components returned by initialization."""
    pinecone_client: Optional[Any] = Field(None, description="Pinecone client instance")
    index: Optional[Any] = Field(None, description="Pinecone index instance")
    embedding: Optional[Any] = Field(None, description="OpenAI embeddings instance")
    vector_store: Optional[Any] = Field(None, description="PineconeVectorStore wrapper")
    
    class Config:
        arbitrary_types_allowed = True
        json_schema_extra = {
            "example": {
                "pinecone_client": "Pinecone client object",
                "index": "Pinecone index object",
                "embedding": "OpenAI embeddings object",
                "vector_store": "PineconeVectorStore object"
            }
        }
