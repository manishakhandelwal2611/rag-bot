# RAG Chatbot Backend

A FastAPI-based RAG (Retrieval-Augmented Generation) chatbot backend with intelligent confidence-based query routing and comprehensive logging.

## Overview

### 🧠 Intelligent Query Routing
The system uses confidence-based routing to optimize query processing:
- **High confidence** (≥ threshold): Uses RAG with enriched context from vector store
- **Low confidence** (< threshold): Falls back to direct LLM without context
- **Configurable threshold**: Default 0.7, adjustable via `RAG_CONFIDENCE_THRESHOLD`

### 🔍 Key Features
- **Vector Store Integration**: Pinecone for document storage and retrieval
- **LLM Integration**: OpenAI GPT models for text generation
- **Confidence-Based Routing**: Smart decision making based on similarity scores
- **JWT Authentication**: Secure endpoints with Google OAuth token support
- **Comprehensive Logging**: Structured logging with performance monitoring
- **Document Ingestion**: Automatic processing and indexing of documents
- **API Endpoints**: RESTful API for querying and ingestion

## Quick Start

### Prerequisites
- Python 3.8+ (for local development)
- Docker & Docker Compose (for containerized deployment)
- OpenAI API key
- Pinecone API key

### Option 1: Docker Deployment (Recommended)

1. **Clone the repository:**
```bash
git clone <repository-url>
cd rag-backend
```

2. **Configure environment variables:**
Create a `.env` file in the project root:
```env
OPENAI_API_KEY=your_openai_api_key_here
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENV=us-west4-gcp-free
PINECONE_INDEX=rag-index

# Optional: Customize logging and RAG settings
LOG_LEVEL=INFO
RAG_CONFIDENCE_THRESHOLD=0.7
RAG_SIMILARITY_TOP_K=5
```

3. **Run with Docker Compose:**
```bash
# Development mode
docker-compose up --build

# Production mode (with nginx)
docker-compose --profile production up --build
```

4. **Access the application:**
- API: http://localhost:8000
- Interactive docs: http://localhost:8000/docs
- Health check: http://localhost:8000/health

### Option 2: Local Development

1. **Setup virtual environment:**
```bash
cd rag-backend
python -m venv rag-venv
source rag-venv/bin/activate  # On Windows: rag-venv\Scripts\activate
pip install -r requirements.txt
```

2. **Configure environment variables:**
Create a `.env` file in the project root (same as above)

3. **Run the application:**
```bash
uvicorn app.main:app --reload
```

## Configuration

### RAG Settings
```python
# In app/core/config.py
RAG_CONFIDENCE_THRESHOLD: float = 0.7  # Minimum confidence to use RAG
RAG_SIMILARITY_TOP_K: int = 5          # Number of documents to retrieve
```

### Logging Settings
```env
LOG_LEVEL=INFO
LOG_FILE=logs/app.log
ENABLE_CONSOLE_LOGGING=true
ENABLE_JSON_LOGGING=false
```

## API Endpoints

### Query Endpoint (Requires Authentication)
```http
POST /api/v1/query
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "question": "What is the main topic of the documents?"
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

## Authentication

The API uses Google OAuth token authentication with proper security verification.

### How It Works

1. **Frontend**: Authenticates with Google OAuth and gets a token
2. **Frontend**: Sends the Google token in the `Authorization` header as `Bearer <token>`
3. **Backend**: Fetches Google's public keys and verifies the token signature
4. **Backend**: Validates the token is for our app (audience) and from Google (issuer)
5. **Backend**: Extracts user information and allows access

### Frontend Integration

```javascript
// Frontend JavaScript example
const token = await googleAuth.getAccessToken();

const response = await fetch('/api/v1/query', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        question: "What is the capital of France?"
    })
});
```

### Example Usage

```bash
# With authentication (using real Google OAuth token)
curl -X POST "http://localhost:8000/api/v1/query/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-google-oauth-token>" \
  -d '{"question": "What is the main topic?"}'

# Without authentication (will fail)
curl -X POST "http://localhost:8000/api/v1/query/" \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the main topic?"}'
```

### Security Features

- ✅ **Signature Verification**: Uses Google's public keys to verify token authenticity
- ✅ **Audience Validation**: Only accepts tokens meant for our app (client ID)
- ✅ **Issuer Validation**: Only accepts tokens from Google
- ✅ **Expiration Check**: Automatically rejects expired tokens
- ✅ **Required Fields**: Validates all required token fields
- ✅ **Performance Optimized**: Google public keys are cached for 1 hour (100x+ faster)
- ✅ **Resilient**: Falls back to expired cache if Google is unreachable

### Configuration

Set your Google OAuth client ID in `.env`:
```env
GOOGLE_CLIENT_ID=your-actual-google-oauth-client-id
```

### Performance Optimization

The authentication system includes intelligent caching to avoid performance issues:

- **First Request**: Fetches Google's public keys (~100ms)
- **Subsequent Requests**: Uses cached keys (~0.001ms)
- **Cache Duration**: 1 hour (configurable)
- **Automatic Refresh**: Keys refresh automatically when cache expires
- **Fallback**: Uses expired cache if Google is unreachable
- **Performance Gain**: 100x+ faster for cached requests

This ensures your API remains fast and responsive even with high traffic.

### Token Requirements

- **Valid JWT format**: Must be a properly formatted JWT token
- **Google OAuth compatible**: Should contain standard Google OAuth claims
- **Not expired**: Token must not be expired
- **Required fields**: Must contain `sub` (user ID) and `email` fields

### Protected Endpoints

- `POST /api/v1/query/` - Query the RAG chatbot
- `GET /api/v1/ingest/` - Query via GET method

### Public Endpoints

- `GET /health` - Health check (no authentication required)

## How Confidence-Based Routing Works

1. **Query Processing**: When a query is received, the system first searches the vector store
2. **Confidence Calculation**: Calculates average confidence score from top-k similar documents
3. **Routing Decision**:
   - If confidence ≥ threshold → Use RAG response with enriched context
   - If confidence < threshold → Use direct LLM without context
4. **Fallback**: If RAG fails or has no results, always falls back to direct LLM

### Benefits
- **Better Performance**: Avoids unnecessary context when confidence is low
- **Improved Accuracy**: Uses enriched context only when relevant
- **Cost Optimization**: Reduces token usage for low-confidence queries
- **Flexible**: Configurable threshold based on your use case

## Project Structure

```
rag-backend/
├── app/
│   ├── api/v1/          # API endpoints
│   ├── core/            # Configuration and settings
│   ├── models/          # Pydantic schemas
│   ├── services/        # Business logic
│   └── utils/           # Utilities (logging, etc.)
├── logs/                # Log files
├── requirements.txt     # Dependencies
└── README.md           # This file
```

## Documentation

- **[Logging System](LOGGING.md)**: Detailed logging configuration and usage
- **[API Documentation](http://localhost:8000/docs)**: Interactive API docs (when running)

## Docker Commands

### Building and Running
```bash
# Build the Docker image
docker build -t rag-chatbot-backend .

# Run the container
docker run -p 8000:8000 --env-file .env rag-chatbot-backend

# Run with Docker Compose
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f rag-backend

# Stop services
docker-compose down
```

### Development with Docker
```bash
# Rebuild and restart
docker-compose up --build --force-recreate

# Execute commands in running container
docker-compose exec rag-backend bash

# View container status
docker-compose ps
```

## Development

### Running Tests
```bash
# Local testing
pytest tests/

# Docker testing
docker-compose exec rag-backend pytest tests/
```

### Code Quality
```bash
# Format code
black app/

# Lint code
flake8 app/
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
