# Logging System Documentation

This document describes the comprehensive logging system implemented in the RAG Chatbot Backend.

## Overview

The logging system provides:
- **Structured logging** with JSON formatting for production
- **Colored console output** for development
- **Performance monitoring** with timing and metrics
- **Error tracking** with context and stack traces
- **Configurable log levels** and output destinations
- **Request/response logging** for API endpoints

## Configuration

Logging is configured through environment variables in your `.env` file:

```env
# Logging Configuration
LOG_LEVEL=INFO                    # DEBUG, INFO, WARNING, ERROR, CRITICAL
LOG_FILE=logs/app.log            # Path to log file (optional)
ENABLE_CONSOLE_LOGGING=true      # Enable console output
ENABLE_JSON_LOGGING=false        # Use JSON formatting
```

## Usage

### Common Logger

The system now uses a centralized logger with a common name `rag_chatbot` across all modules:

```python
from app.utils.logger import get_common_logger

logger = get_common_logger()

logger.debug("Debug information")
logger.info("General information")
logger.warning("Warning message")
logger.error("Error message")
logger.critical("Critical error")
```

### Decorator-Based Logging

The new system provides powerful decorators for automatic logging:

#### Function Execution Decorator

```python
from app.utils.logger import log_function_execution

@log_function_execution(log_args=True, log_result=True, log_performance=True)
def my_function(param1: str, param2: int = 42):
    """Function with automatic logging."""
    return f"Result: {param1} processed with {param2}"
```

#### Service Operation Decorator

```python
from app.utils.logger import log_service_operation

@log_service_operation("data_processing", log_input=True, log_output=True, log_performance=True)
def process_data(data: str):
    """Service operation with automatic logging."""
    return data.upper()
```

#### API Endpoint Decorator

```python
from app.utils.logger import log_api_endpoint

@log_api_endpoint(log_request=True, log_response=True, log_performance=True)
def my_endpoint(request: Request):
    """API endpoint with automatic logging."""
    return {"status": "success"}
```

### Legacy Logging Functions (Still Available)

```python
from app.utils.logger import (
    log_function_call, 
    log_performance, 
    log_error_with_context
)

# Log function calls with parameters
log_function_call(logger, "my_function", param1="value", param2=42)

# Log performance metrics
log_performance(logger, "database_query", 0.5, rows_returned=100)

# Log errors with context
try:
    # Some operation
    pass
except Exception as e:
    log_error_with_context(logger, e, "operation_name", user_id=123)
```

### API Request/Response Logging

The system automatically logs all API requests and responses through middleware:

```python
# Automatically logged:
# - Request method, path, query parameters
# - Response status code and timing
# - Client IP address
# - Response size
```

## Log Levels

- **DEBUG**: Detailed information for debugging
- **INFO**: General information about application flow
- **WARNING**: Warning messages for potential issues
- **ERROR**: Error messages for handled exceptions
- **CRITICAL**: Critical errors that may cause application failure

## Log Formats

### Console Format (Development)
```
2024-01-15 10:30:45 | INFO     | app.services.query_service | Processing query: What is AI?
```

### JSON Format (Production)
```json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "level": "INFO",
  "logger": "app.services.query_service",
  "message": "Processing query: What is AI?",
  "module": "query_service",
  "function": "query_ragbot",
  "line": 33
}
```

## Log Files

Logs are written to the `logs/` directory:
- `app.log`: Main application logs
- `test.log`: Test logs (when running tests)

## Performance Monitoring

The system tracks:
- **Query processing time**
- **Document ingestion time**
- **API response times**
- **Vector store operations**
- **LLM response times**

## Error Handling

All errors are logged with:
- **Full stack traces**
- **Contextual information**
- **Operation details**
- **User/request identifiers**

## Testing the Logging System

Run the example script to test the logging configuration:

```bash
cd rag-backend
python logging_example.py
```

## Decorator Benefits

The new decorator-based system provides several advantages:

1. **Automatic Logging**: No need to manually add logging code to every function
2. **Consistent Format**: All decorated functions use the same logging format
3. **Performance Tracking**: Automatic timing and performance metrics
4. **Error Handling**: Automatic error logging with context
5. **Clean Code**: Separates logging concerns from business logic
6. **Configurable**: Each decorator can be configured per function

### Decorator Configuration Options

- **log_args**: Log function arguments (default: True)
- **log_result**: Log function return values (default: False)
- **log_performance**: Log execution time (default: True)
- **log_input**: Log input parameters (default: True)
- **log_output**: Log output results (default: False)
- **log_request**: Log API request details (default: True)
- **log_response**: Log API response details (default: True)

## Best Practices

1. **Use decorators for automatic logging**:
   - `@log_function_execution` for general functions
   - `@log_service_operation` for service layer functions
   - `@log_api_endpoint` for API endpoints

2. **Use appropriate log levels**:
   - DEBUG: Development debugging
   - INFO: Normal application flow
   - WARNING: Potential issues
   - ERROR: Handled exceptions
   - CRITICAL: Unhandled exceptions

3. **Include context**:
   - User IDs, request IDs
   - Operation names
   - Performance metrics

4. **Avoid logging sensitive data**:
   - API keys, passwords
   - Personal information
   - Large data payloads

5. **Use structured logging**:
   - Include metadata in `extra_fields`
   - Use consistent field names
   - Log in JSON format for production

6. **Use the common logger**:
   - Import `get_common_logger()` instead of `get_logger(__name__)`
   - Maintains consistency across all modules

## Monitoring and Alerting

For production deployments, consider:
- **Log aggregation** (ELK stack, Splunk)
- **Error alerting** (PagerDuty, Slack)
- **Performance monitoring** (DataDog, New Relic)
- **Log rotation** to manage disk space

## Troubleshooting

### Common Issues

1. **Logs not appearing**: Check LOG_LEVEL configuration
2. **File permission errors**: Ensure logs directory is writable
3. **Performance impact**: Use appropriate log levels in production
4. **Disk space**: Implement log rotation

### Debug Mode

Enable debug logging for troubleshooting:

```env
LOG_LEVEL=DEBUG
ENABLE_CONSOLE_LOGGING=true
ENABLE_JSON_LOGGING=false
```

This will show detailed information about:
- Vector store operations
- LLM API calls
- Document processing
- Query execution
