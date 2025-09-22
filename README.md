# RAG Chatbot Project

A complete RAG (Retrieval-Augmented Generation) chatbot application with both frontend and backend components, featuring intelligent confidence-based query routing and comprehensive logging.

## 🧠 What is RAG?

RAG (Retrieval-Augmented Generation) combines the power of large language models with external knowledge retrieval. This system:

- **Retrieves** relevant documents from a vector database
- **Augments** the user's query with context from those documents  
- **Generates** intelligent responses using both the query and retrieved context

## ✨ Key Features

- **Intelligent Query Routing**: Uses confidence-based routing to optimize query processing
- **Vector Store Integration**: Pinecone for document storage and retrieval
- **LLM Integration**: OpenAI GPT models for text generation
- **JWT Authentication**: Secure endpoints with Google OAuth token support
- **Comprehensive Logging**: Structured logging with performance monitoring
- **Document Ingestion**: Automatic processing and indexing of documents
- **RESTful API**: Clean API endpoints for querying and ingestion

## 🚀 How It Works

### Confidence-Based Routing

The system intelligently decides how to process each query:

1. **Query Processing**: Searches the vector store for similar documents
2. **Confidence Calculation**: Calculates average confidence score from top-k similar documents
3. **Smart Routing**:
   - **High confidence** (≥ threshold) → Uses RAG with enriched context
   - **Low confidence** (< threshold) → Uses direct LLM without context
4. **Fallback**: If RAG fails, always falls back to direct LLM

### Benefits
- **Better Performance**: Avoids unnecessary context when confidence is low
- **Improved Accuracy**: Uses enriched context only when relevant
- **Cost Optimization**: Reduces token usage for low-confidence queries
- **Flexible**: Configurable threshold based on your use case

## 📁 Project Structure

```
rag-chatbot/
|   # This directory (contains both frontend & backend)
│   ├── rag-backend/     # FastAPI backend application
│   │   ├── app/
│   │   │   ├── api/v1/  # API endpoints (chat, query, ingest)
│   │   │   ├── core/    # Configuration and settings
│   │   │   ├── models/  # Pydantic schemas
│   │   │   ├── services/# Business logic (chat, query, vectorstore)
│   │   │   ├── handlers/# Request handlers
│   │   │   └── utils/   # Utilities (logging, file handling)
│   │   ├── tests/       # Test files
│   │   ├── logs/        # Application logs
│   │   ├── requirements.txt # Python dependencies
│   │   ├── pyproject.toml   # Poetry configuration
│   │   ├── Dockerfile       # Multi-stage Docker build
│   │   └── docker-compose.yml # Docker Compose configuration
│   ├── rag-frontend/    # React frontend application
│   │   ├── src/         # React source code
│   │   ├── public/      # Static assets
│   │   ├── package.json # Node.js dependencies
│   │   └── vite.config.ts # Vite configuration
│   └── rag-venv/        # Python virtual environment
└── README.md           # This file
```



## 🔧 Configuration

### Required Environment Variables

```env
# API Keys (Required)
OPENAI_API_KEY=your_openai_api_key_here
PINECONE_API_KEY=your_pinecone_api_key_here
GOOGLE_CLIENT_ID=your_google_oauth_client_id_here

# Pinecone Settings
PINECONE_ENV=us-west4-gcp-free
PINECONE_INDEX=rag-index

# RAG Configuration
RAG_CONFIDENCE_THRESHOLD=0.3
RAG_SIMILARITY_TOP_K=5

# Redis Configuration (for chat history)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_CHAT_TTL=2592000

# User Limits
MAX_MESSAGES_PER_USER=30

# Logging
LOG_LEVEL=INFO
ENABLE_CONSOLE_LOGGING=true
```

## 🔌 API Endpoints

### Query Endpoint (Requires Authentication)
```http
POST /api/v1/query
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "question": "What is the main topic of the documents?"
}
```

### Chat Endpoint (Requires Authentication)
```http
POST /api/v1/chat
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "message": "Hello, how can you help me?",
  "thread_id": "optional-thread-id"
}
```

### Ingestion Endpoint (Requires Authentication)
```http
GET /api/v1/ingest?q=your_question
Authorization: Bearer <your-jwt-token>
```

### Health Check
```http
GET /health
```

## 🔐 Authentication

The API uses Google OAuth token authentication with proper security verification.

### How It Works

1. **Frontend**: Authenticates with Google OAuth and gets a token
2. **Frontend**: Sends the Google token in the `Authorization` header as `Bearer <token>`
3. **Backend**: Fetches Google's public keys and verifies the token signature
4. **Backend**: Validates the token is for our app (audience) and from Google (issuer)
5. **Backend**: Extracts user information and allows access

### Security Features

- ✅ **Signature Verification**: Uses Google's public keys to verify token authenticity
- ✅ **Audience Validation**: Only accepts tokens meant for our app (client ID)
- ✅ **Issuer Validation**: Only accepts tokens from Google
- ✅ **Expiration Check**: Automatically rejects expired tokens
- ✅ **Performance Optimized**: Google public keys are cached for 1 hour

## 🛠️ Development Setup

### Prerequisites
- Python 3.8+
- OpenAI API key
- Pinecone API key
- Google OAuth client ID

### Local Development

1. **Clone the repository:**
```bash
git clone <repository-url>
cd rag-chatbot/backend
```

2. **Backend Setup:**
```bash
cd rag-backend
```

3. **Create virtual environment:**
```bash
python -m venv ../rag-venv
source ../rag-venv/bin/activate  # On Windows: ..\rag-venv\Scripts\activate
```

4. **Install dependencies:**
```bash
pip install -r requirements.txt
```

5. **Configure environment variables:**
Create a `.env` file in the `rag-backend` directory with the required variables (see Configuration section above)

6. **Run the application:**
```bash
uvicorn app.main:app --reload
```

7. **Access the backend:**
- API: http://localhost:8000
- Interactive docs: http://localhost:8000/docs
- Health check: http://localhost:8000/health

### Frontend Setup

1. **Navigate to frontend:**
```bash
cd ../rag-frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment:**
Create a `.env.local` file with:
```env
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
VITE_API_BASE_URL=http://localhost:8000
```

4. **Run the frontend:**
```bash
npm run dev
```

5. **Access the frontend:**
- Frontend: http://localhost:5173

## 🧪 Testing

```bash
# Navigate to rag-backend directory
cd rag-backend

# Run all tests
pytest tests/

# Run specific test file
pytest tests/test_query.py

# Run with coverage
pytest --cov=app tests/
```

## 📊 Monitoring & Logging

The application includes comprehensive logging:

- **Structured Logging**: JSON format for easy parsing
- **Performance Monitoring**: Request timing and response metrics
- **Error Tracking**: Detailed error logging with stack traces
- **Health Checks**: Built-in health monitoring endpoints

Log files are stored in the `rag-backend/logs/` directory.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com/)
- Vector storage powered by [Pinecone](https://www.pinecone.io/)
- LLM integration via [OpenAI](https://openai.com/)
- Authentication with [Google OAuth](https://developers.google.com/identity/protocols/oauth2)
