from pinecone import Pinecone
from langchain_community.embeddings import OpenAIEmbeddings
from app.core.config import settings
from llama_index.vector_stores.pinecone import PineconeVectorStore
from app.utils.logger import get_common_logger, log_service_operation
from app.models.vectorstore import VectorStoreComponents
import os

logger = get_common_logger()

@log_service_operation("vectorstore_initialization", log_input=True, log_output=False, log_performance=True)
def initialize_vectorstore() -> VectorStoreComponents:
    """
    Initialize Pinecone client, index, and vector store with proper error handling.
    
    Returns:
        VectorStoreComponents: Structured components with type safety
        
    Raises:
        Exception: If initialization fails
    """
    logger.info("Initializing Pinecone vector store")
    
    # Initialize Pinecone client
    logger.debug(f"Connecting to Pinecone with environment: {settings.PINECONE_ENV}")
    pinecone_client = Pinecone(
        api_key=settings.PINECONE_API_KEY,
    )
    
    # Connect to index
    logger.debug(f"Connecting to Pinecone index: {settings.PINECONE_INDEX}")
    index = pinecone_client.Index(settings.PINECONE_INDEX)
    
    # Initialize OpenAI embeddings
    logger.debug("Initializing OpenAI embeddings")
    embedding = OpenAIEmbeddings(api_key=settings.OPENAI_API_KEY)
    
    # Create vector store wrapper for LLaMA Index
    logger.debug("Creating PineconeVectorStore wrapper")
    vector_store = PineconeVectorStore(
        pinecone_index=index,
        embedding=embedding,
    )
    
    logger.info("Vector store initialization completed successfully")
    
    return VectorStoreComponents(
        pinecone_client=pinecone_client,
        index=index,
        embedding=embedding,
        vector_store=vector_store
    )

# Initialize vector store components
try:
    components = initialize_vectorstore()
    pinecone_client = components.pinecone_client
    index = components.index
    embedding = components.embedding
    vector_store = components.vector_store
    logger.info("Vector store components initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize vector store: {e}")
    # Set to None to prevent import errors, but the app will fail at runtime
    pinecone_client = None
    index = None
    embedding = None
    vector_store = None
