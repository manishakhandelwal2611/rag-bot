from pathlib import Path
from llama_index.core import GPTVectorStoreIndex, SimpleDirectoryReader
from app.services.vectorstore_service import vector_store
from app.utils.logger import get_common_logger, log_service_operation

logger = get_common_logger()

@log_service_operation("document_ingestion", log_input=True, log_output=False, log_performance=True)
def ingest_documents(folder_path: str = "data/docs"):
    """
    Reads documents from folder_path, builds embeddings, and stores them in Pinecone.
    
    Args:
        folder_path: Path to the directory containing documents to ingest
        
    Returns:
        GPTVectorStoreIndex: The created index
        
    Raises:
        FileNotFoundError: If the folder_path doesn't exist
        Exception: For other ingestion errors
    """
    # Validate folder path
    folder = Path(folder_path)
    if not folder.exists():
        error_msg = f"Document folder not found: {folder_path}"
        logger.error(error_msg)
        raise FileNotFoundError(error_msg)
    
    if not folder.is_dir():
        error_msg = f"Path is not a directory: {folder_path}"
        logger.error(error_msg)
        raise ValueError(error_msg)
    
    logger.info(f"Starting document ingestion from: {folder_path}")
    
    # Load documents
    logger.debug("Loading documents from directory")
    documents = SimpleDirectoryReader(folder_path).load_data()
    
    if not documents:
        logger.warning(f"No documents found in {folder_path}")
        return None
    
    logger.info(f"Loaded {len(documents)} documents for processing")
    
    # Create index with vector store
    logger.debug("Creating vector store index")
    index = GPTVectorStoreIndex(documents, vector_store=vector_store)
    
    logger.info(f"Successfully ingested {len(documents)} documents")
    return index
