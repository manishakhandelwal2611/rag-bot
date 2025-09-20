# API Documentation

This document describes the API endpoints and data structures used by the RAG Chat Bot application.

## Base URL

```
http://localhost:8000
```

## Authentication

The application uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Health Check

**GET** `/health`

Check if the API server is running.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-20T10:30:00Z"
}
```

### Send Message

**POST** `/query`

Send a chat message to the RAG system.

**Request Body:**
```json
{
  "question": "What is machine learning?",
  "thread_id": "optional_thread_id"
}
```

**Response:**
```json
{
  "answer": "Machine learning is a subset of artificial intelligence...",
  "thread_id": "thread_12345",
  "sources": [
    {
      "title": "Introduction to Machine Learning",
      "url": "https://example.com/ml-intro",
      "snippet": "Machine learning is...",
      "confidence": 0.95
    }
  ]
}
```

**Error Response:**
```json
{
  "error": "Invalid question format",
  "message": "The question field is required"
}
```

### Get Threads

**GET** `/chat/threads`

Retrieve user's chat threads with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `page_size` (optional): Number of threads per page (default: 10)

**Response:**
```json
{
  "threads": [
    {
      "id": "thread_12345",
      "title": "Machine Learning Discussion",
      "created_at": "2025-01-20T10:30:00Z",
      "updated_at": "2025-01-20T11:45:00Z",
      "message_count": 5
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 10,
    "total_count": 25,
    "total_pages": 3,
    "has_next": true,
    "has_previous": false
  }
}
```

### Get Thread Messages

**GET** `/chat/threads/{thread_id}`

Retrieve messages for a specific thread.

**Path Parameters:**
- `thread_id`: The ID of the thread

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `page_size` (optional): Number of messages per page (default: 20)

**Response:**
```json
{
  "thread": {
    "id": "thread_12345",
    "title": "Machine Learning Discussion",
    "created_at": "2025-01-20T10:30:00Z",
    "updated_at": "2025-01-20T11:45:00Z",
    "message_count": 5,
    "messages": [
      {
        "id": "msg_1",
        "content": "What is machine learning?",
        "role": "user",
        "timestamp": "2025-01-20T10:30:00Z"
      },
      {
        "id": "msg_2",
        "content": "Machine learning is a subset of artificial intelligence...",
        "role": "assistant",
        "timestamp": "2025-01-20T10:30:15Z"
      }
    ]
  },
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total_count": 5,
    "total_pages": 1,
    "has_next": false,
    "has_previous": false
  }
}
```

### Delete Thread

**DELETE** `/chat/threads/{thread_id}`

Delete a specific thread and all its messages.

**Path Parameters:**
- `thread_id`: The ID of the thread to delete

**Response:**
```json
{
  "message": "Thread deleted successfully",
  "thread_id": "thread_12345"
}
```

**Error Response:**
```json
{
  "error": "Thread not found",
  "message": "The specified thread does not exist"
}
```

## Data Models

### Thread

```typescript
interface Thread {
  id: string;
  title: string;
  created_at: string; // ISO 8601 format
  updated_at: string; // ISO 8601 format
  message_count: number;
}
```

### Message

```typescript
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string; // ISO 8601 format
}
```

### Source

```typescript
interface Source {
  title: string;
  url: string;
  snippet: string;
  confidence: number; // 0.0 to 1.0
}
```

### Pagination

```typescript
interface Pagination {
  page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}
```

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "details": "Additional error details (optional)"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **Chat messages**: 60 requests per minute per user
- **Thread operations**: 30 requests per minute per user
- **Health check**: 120 requests per minute

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1642680000
```

## CORS Configuration

The API supports CORS for the following origins:

- `http://localhost:5173` (development)
- `https://yourdomain.com` (production)

## WebSocket Support (Future)

Real-time messaging via WebSocket will be supported in future versions:

```
ws://localhost:8000/ws/chat/{thread_id}
```

## SDK Examples

### JavaScript/TypeScript

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// Send a message
const sendMessage = async (question: string, threadId?: string) => {
  const response = await api.post('/query', {
    question,
    thread_id: threadId
  });
  return response.data;
};

// Get threads
const getThreads = async (page = 1, pageSize = 10) => {
  const response = await api.get('/chat/threads', {
    params: { page, page_size: pageSize }
  });
  return response.data;
};
```

### Python

```python
import requests

class RAGChatAPI:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
    
    def send_message(self, question, thread_id=None):
        response = requests.post(
            f'{self.base_url}/query',
            json={'question': question, 'thread_id': thread_id},
            headers=self.headers
        )
        return response.json()
    
    def get_threads(self, page=1, page_size=10):
        response = requests.get(
            f'{self.base_url}/chat/threads',
            params={'page': page, 'page_size': page_size},
            headers=self.headers
        )
        return response.json()
```

## Testing

### Postman Collection

A Postman collection is available for testing the API endpoints. Import the collection from `docs/postman/RAG_Chat_API.postman_collection.json`.

### cURL Examples

```bash
# Health check
curl -X GET http://localhost:8000/health

# Send message
curl -X POST http://localhost:8000/query \
  -H "Authorization: Bearer your_token" \
  -H "Content-Type: application/json" \
  -d '{"question": "What is AI?"}'

# Get threads
curl -X GET "http://localhost:8000/chat/threads?page=1&page_size=10" \
  -H "Authorization: Bearer your_token"
```

## Changelog

### v1.0.0
- Initial API release
- Basic chat functionality
- Thread management
- Authentication support

### v1.1.0
- Added pagination support
- Enhanced error handling
- Rate limiting implementation

### v1.2.0 (Planned)
- WebSocket support for real-time messaging
- File upload capabilities
- Advanced search functionality
