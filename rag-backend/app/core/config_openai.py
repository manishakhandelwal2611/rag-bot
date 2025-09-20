from llama_index.core import Settings
from llama_index.llms.openai import OpenAI
from llama_index.embeddings.openai import OpenAIEmbedding
from app.core.config import settings

def configure_openai():
    Settings.llm = OpenAI(model="gpt-4o-mini", api_key=settings.OPENAI_API_KEY)
    Settings.embed_model = OpenAIEmbedding(model="text-embedding-3-small", api_key=settings.OPENAI_API_KEY)
