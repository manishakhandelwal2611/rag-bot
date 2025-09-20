from app.services.vectorstore_service import vector_store
from llama_index.core import GPTVectorStoreIndex, Document
from llama_index.core.llms import ChatMessage
from llama_index.core import Settings
from app.utils.logger import get_common_logger, log_service_operation
from app.core.config import settings

logger = get_common_logger()

@log_service_operation("query_processing", log_input=True, log_output=False, log_performance=True)
def query_ragbot(query: str) -> str:
    """
    Query Pinecone vector store via LlamaIndex with confidence-based routing.
    Uses RAG with enriched context if confidence is high, otherwise falls back to direct LLM.
    
    Args:
        query: The user's question/query
        
    Returns:
        str: The response from RAG (high confidence) or LLM fallback (low confidence)
        
    Raises:
        Exception: For query processing errors
    """
    if not query or not query.strip():
        logger.warning("Empty query received")
        return "Please provide a valid question."
    
    logger.info(f"Processing query: {query[:100]}{'...' if len(query) > 100 else ''}")
    
    # Step 1: Wrap Pinecone store in LlamaIndex index
    logger.debug("Creating index from vector store")
    index = GPTVectorStoreIndex.from_vector_store(vector_store=vector_store)

    # Step 2: Query the index to get similarity scores
    logger.debug(f"Querying vector store with similarity_top_k={settings.RAG_SIMILARITY_TOP_K}")
    query_engine = index.as_query_engine(similarity_top_k=settings.RAG_SIMILARITY_TOP_K)
    response = query_engine.query(query)
    text_response = getattr(response, "response", None)
    
    # Step 3: Check confidence scores and decide routing
    confidence_score = 0.0
    if hasattr(response, 'source_nodes') and response.source_nodes:
        # Calculate average confidence from top source nodes
        scores = [node.score for node in response.source_nodes if hasattr(node, 'score') and node.score is not None]
        if scores:
            confidence_score = sum(scores) / len(scores)
        
        logger.info(f"RAG found {len(response.source_nodes)} relevant documents with avg confidence: {confidence_score:.3f}")
        logger.info(f"Confidence threshold: {settings.RAG_CONFIDENCE_THRESHOLD}")
        logger.info(f"Routing decision: {'RAG' if confidence_score >= settings.RAG_CONFIDENCE_THRESHOLD else 'Direct LLM'}")
        
        for i, node in enumerate(response.source_nodes[:3]):  # Log top 3 sources
            score = getattr(node, 'score', 'N/A')
            logger.info(f"Source {i+1}: {node.metadata.get('source', 'Unknown')} (score: {score})")
            logger.debug(f"Source {i+1} text preview: {node.text[:100]}...")
    else:
        logger.warning("No source nodes found in RAG response")
    
    # Step 4: Route based on confidence threshold
    if confidence_score >= settings.RAG_CONFIDENCE_THRESHOLD:
        # High confidence: Use RAG response with enriched context
        if text_response and text_response.strip() and text_response != "Empty Response":
            logger.info(f"High confidence ({confidence_score:.3f} >= {settings.RAG_CONFIDENCE_THRESHOLD}), using RAG response")
            response_length = len(text_response)
            logger.info(f"RAG response generated successfully, length: {response_length}")
            return text_response.strip()
        else:
            logger.warning("High confidence but no RAG response, falling back to LLM")
    else:
        # Low confidence: Skip RAG and use direct LLM
        logger.info(f"Low confidence ({confidence_score:.3f} < {settings.RAG_CONFIDENCE_THRESHOLD}), using direct LLM")
    
    # Step 5: Fallback to direct LLM (low confidence or no RAG response)
    logger.debug("Calling OpenAI LLM for direct response")
    messages = [ChatMessage(role="user", content=query)]
    llm_response = Settings.llm.chat(messages)  # uses gpt-4o-mini

    text_response = llm_response.message.content

    if not text_response or not text_response.strip():
        logger.error("LLM fallback also failed to generate response")
        text_response = "I apologize, but I'm unable to generate a response at this time."
    else:
        logger.info("LLM direct response generated successfully")
        # Store the Q&A pair in vector store for future reference
        doc_text = f"Q: {query}\nA: {text_response}"
        doc = Document(text=doc_text, metadata={"source": "LLM Response", "query": query})
        try:
            index.insert(doc)
            logger.debug("Stored LLM response in vector store")
        except Exception as e:
            logger.warning(f"Failed to store LLM response in vector store: {e}")

    response_length = len(text_response) if text_response else 0
    logger.info(f"Query processed successfully, response length: {response_length}")
    return text_response.strip()
