import logging
import logging.config
import sys
from pathlib import Path
from typing import Optional, Callable, Any
import json
from datetime import datetime
import functools
import time


class JSONFormatter(logging.Formatter):
    """Custom JSON formatter for structured logging."""
    
    def format(self, record):
        log_entry = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        
        # Add exception info if present
        if record.exc_info:
            log_entry["exception"] = self.formatException(record.exc_info)
            
        # Add extra fields if present
        if hasattr(record, 'extra_fields'):
            log_entry.update(record.extra_fields)
            
        return json.dumps(log_entry, ensure_ascii=False)


class ColoredFormatter(logging.Formatter):
    """Colored formatter for console output."""
    
    COLORS = {
        'DEBUG': '\033[36m',    # Cyan
        'INFO': '\033[32m',     # Green
        'WARNING': '\033[33m',  # Yellow
        'ERROR': '\033[31m',    # Red
        'CRITICAL': '\033[35m', # Magenta
    }
    RESET = '\033[0m'
    
    def format(self, record):
        log_color = self.COLORS.get(record.levelname, self.RESET)
        record.levelname = f"{log_color}{record.levelname}{self.RESET}"
        return super().format(record)


def setup_logging(
    log_level: str = "INFO",
    log_file: Optional[str] = None,
    enable_console: bool = True,
    enable_json: bool = False
) -> logging.Logger:
    """
    Set up comprehensive logging configuration.
    
    Args:
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        log_file: Path to log file (optional)
        enable_console: Enable console logging
        enable_json: Use JSON formatting for structured logs
    
    Returns:
        Configured logger instance
    """
    
    # Create logs directory if it doesn't exist
    if log_file:
        log_path = Path(log_file)
        log_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, log_level.upper()))
    
    # Clear existing handlers
    root_logger.handlers.clear()
    
    # Console handler
    if enable_console:
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(getattr(logging, log_level.upper()))
        
        if enable_json:
            console_formatter = JSONFormatter()
        else:
            console_formatter = ColoredFormatter(
                fmt='%(asctime)s | %(levelname)-8s | %(name)-20s | %(message)s',
                datefmt='%Y-%m-%d %H:%M:%S'
            )
        
        console_handler.setFormatter(console_formatter)
        root_logger.addHandler(console_handler)
    
    # File handler
    if log_file:
        file_handler = logging.FileHandler(log_file)
        file_handler.setLevel(logging.DEBUG)  # Always log everything to file
        
        file_formatter = JSONFormatter()
        file_handler.setFormatter(file_formatter)
        root_logger.addHandler(file_handler)
    
    # Configure specific loggers
    loggers_config = {
        'app': 'INFO',
        'fastapi': 'INFO',
        'uvicorn': 'INFO',
        'uvicorn.access': 'WARNING',  # Reduce access log noise
        'llama_index': 'INFO',
        'pinecone': 'WARNING',
        'openai': 'WARNING',
        'httpx': 'WARNING',
    }
    
    for logger_name, level in loggers_config.items():
        logger = logging.getLogger(logger_name)
        logger.setLevel(getattr(logging, level))
        logger.propagate = True
    
    return root_logger


def get_logger(name: str) -> logging.Logger:
    """Get a logger instance with the given name."""
    return logging.getLogger(name)


def log_function_call(logger: logging.Logger, func_name: str, **kwargs):
    """Log function call with parameters."""
    logger.debug(f"Calling {func_name}", extra={
        'extra_fields': {
            'function_call': func_name,
            'parameters': kwargs
        }
    })


def log_performance(logger: logging.Logger, operation: str, duration: float, **metadata):
    """Log performance metrics."""
    logger.info(f"Performance: {operation} completed in {duration:.3f}s", extra={
        'extra_fields': {
            'operation': operation,
            'duration_seconds': duration,
            **metadata
        }
    })


def log_api_request(logger: logging.Logger, method: str, path: str, **metadata):
    """Log API request details."""
    logger.info(f"API Request: {method} {path}", extra={
        'extra_fields': {
            'api_method': method,
            'api_path': path,
            **metadata
        }
    })


def log_api_response(logger: logging.Logger, status_code: int, response_time: float, **metadata):
    """Log API response details."""
    logger.info(f"API Response: {status_code} in {response_time:.3f}s", extra={
        'extra_fields': {
            'status_code': status_code,
            'response_time_seconds': response_time,
            **metadata
        }
    })


def log_error_with_context(logger: logging.Logger, error: Exception, context: str = "", **metadata):
    """Log error with additional context."""
    logger.error(f"Error in {context}: {str(error)}", exc_info=True, extra={
        'extra_fields': {
            'error_type': type(error).__name__,
            'context': context,
            **metadata
        }
    })


# Initialize default logger
logger = get_logger(__name__)


# Common logger instance for the entire application
COMMON_LOGGER_NAME = "rag_chatbot"
common_logger = None


def get_common_logger() -> logging.Logger:
    """
    Get the common logger instance for the entire application.
    This logger is shared across all modules to maintain consistency.
    
    Returns:
        logging.Logger: The common logger instance
    """
    global common_logger
    if common_logger is None:
        common_logger = get_logger(COMMON_LOGGER_NAME)
    return common_logger


# ============================================================================
# HELPER FUNCTIONS - Reusable components to reduce code duplication
# ============================================================================

def _get_logger_or_default(logger: Optional[logging.Logger]) -> logging.Logger:
    """Get logger or default to common logger."""
    return logger if logger is not None else get_common_logger()


def _get_function_name(func: Callable) -> str:
    """Get formatted function name."""
    return f"{func.__module__}.{func.__name__}"


def _log_function_entry(logger: logging.Logger, func_name: str, log_args: bool, args: tuple, kwargs: dict):
    """Log function entry with optional arguments."""
    if log_args:
        logger.debug(f"Executing {func_name}", extra={
            'extra_fields': {
                'function': func_name,
                'args': str(args)[:200] if args else None,
                'kwargs': kwargs if kwargs else None
            }
        })
    else:
        logger.debug(f"Executing {func_name}")


def _log_function_success(logger: logging.Logger, func_name: str, duration: float, log_performance: bool, 
                         log_result: bool, result: Any):
    """Log successful function completion."""
    if log_performance:
        logger.debug(f"Completed {func_name} in {duration:.3f}s", extra={
            'extra_fields': {
                'function': func_name,
                'duration_seconds': duration,
                'success': True
            }
        })
    
    if log_result and result is not None:
        result_str = str(result)[:200] if result else "None"
        logger.debug(f"Result from {func_name}: {result_str}")


def _log_function_error(logger: logging.Logger, func_name: str, duration: float, error: Exception):
    """Log function error with context."""
    logger.error(f"Error in {func_name}: {str(error)}", exc_info=True, extra={
        'extra_fields': {
            'function': func_name,
            'duration_seconds': duration,
            'success': False,
            'error_type': type(error).__name__
        }
    })


def _extract_request_info(args: tuple) -> dict:
    """Extract request information from FastAPI Request object."""
    request_info = {}
    for arg in args:
        if hasattr(arg, 'method') and hasattr(arg, 'url'):  # FastAPI Request object
            request_info = {
                'method': arg.method,
                'path': str(arg.url.path),
                'query_params': dict(arg.query_params),
                'client_ip': arg.client.host if arg.client else None
            }
            break
    return request_info


def _log_api_request(logger: logging.Logger, func_name: str, request_info: dict):
    """Log API request details."""
    logger.info(f"API Request: {request_info['method']} {request_info['path']}", extra={
        'extra_fields': {
            'api_endpoint': func_name,
            'request_info': request_info
        }
    })


def _log_api_response(logger: logging.Logger, func_name: str, duration: float, status_code: int = 200):
    """Log API response details."""
    logger.info(f"API Response: {status_code} in {duration:.3f}s", extra={
        'extra_fields': {
            'api_endpoint': func_name,
            'response_info': {
                'status_code': status_code,
                'response_time': duration
            }
        }
    })


def _log_api_error(logger: logging.Logger, func_name: str, duration: float, error: Exception):
    """Log API error with context."""
    logger.error(f"API Error in {func_name}: {str(error)}", exc_info=True, extra={
        'extra_fields': {
            'api_endpoint': func_name,
            'error_type': type(error).__name__,
            'duration_seconds': duration
        }
    })


def _log_operation_start(logger: logging.Logger, operation_name: str, func_name: str):
    """Log operation start."""
    logger.info(f"Starting {operation_name}", extra={
        'extra_fields': {
            'operation': operation_name,
            'function': func_name
        }
    })


def _log_operation_input(logger: logging.Logger, operation_name: str, args: tuple, kwargs: dict):
    """Log operation input."""
    logger.debug(f"Input for {operation_name}", extra={
        'extra_fields': {
            'operation': operation_name,
            'input_args': str(args)[:200] if args else None,
            'input_kwargs': kwargs if kwargs else None
        }
    })


def _log_operation_success(logger: logging.Logger, operation_name: str, duration: float, log_output: bool, result: Any):
    """Log operation success."""
    logger.info(f"Completed {operation_name} in {duration:.3f}s", extra={
        'extra_fields': {
            'operation': operation_name,
            'duration_seconds': duration,
            'success': True
        }
    })
    
    if log_output and result is not None:
        result_str = str(result)[:200] if result else "None"
        logger.debug(f"Output from {operation_name}: {result_str}")


def _log_operation_error(logger: logging.Logger, operation_name: str, duration: float, error: Exception):
    """Log operation error."""
    logger.error(f"Failed {operation_name}: {str(error)}", exc_info=True, extra={
        'extra_fields': {
            'operation': operation_name,
            'duration_seconds': duration,
            'success': False,
            'error_type': type(error).__name__
        }
    })


# ============================================================================
# DECORATORS - Clean, reusable decorators using helper functions
# ============================================================================

def log_function_execution(
    logger: Optional[logging.Logger] = None,
    log_args: bool = True,
    log_result: bool = False,
    log_performance: bool = True
) -> Callable:
    """
    Decorator to automatically log function execution with parameters, results, and performance.
    
    Args:
        logger: Logger instance to use (defaults to common logger)
        log_args: Whether to log function arguments
        log_result: Whether to log function result
        log_performance: Whether to log execution time
        
    Returns:
        Decorator function
    """
    logger = _get_logger_or_default(logger)
    
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            start_time = time.time()
            func_name = _get_function_name(func)
            
            # Log function entry
            _log_function_entry(logger, func_name, log_args, args, kwargs)
            
            try:
                # Execute the function
                result = func(*args, **kwargs)
                
                # Log function success
                duration = time.time() - start_time
                _log_function_success(logger, func_name, duration, log_performance, log_result, result)
                
                return result
                
            except Exception as e:
                duration = time.time() - start_time
                _log_function_error(logger, func_name, duration, e)
                raise
        
        return wrapper
    return decorator


def log_api_endpoint(
    logger: Optional[logging.Logger] = None,
    log_request: bool = True,
    log_response: bool = True,
    log_performance: bool = True
) -> Callable:
    """
    Decorator specifically for API endpoints to log requests, responses, and performance.
    
    Args:
        logger: Logger instance to use (defaults to common logger)
        log_request: Whether to log request details
        log_response: Whether to log response details
        log_performance: Whether to log execution time
        
    Returns:
        Decorator function
    """
    logger = _get_logger_or_default(logger)
    
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        async def async_wrapper(*args, **kwargs):
            start_time = time.time()
            func_name = _get_function_name(func)
            
            # Extract and log request information
            request_info = _extract_request_info(args)
            if log_request and request_info:
                _log_api_request(logger, func_name, request_info)
            
            try:
                # Execute the endpoint
                result = await func(*args, **kwargs)
                
                duration = time.time() - start_time
                if log_response:
                    _log_api_response(logger, func_name, duration)
                
                return result
                
            except Exception as e:
                duration = time.time() - start_time
                _log_api_error(logger, func_name, duration, e)
                raise
        
        @functools.wraps(func)
        def sync_wrapper(*args, **kwargs):
            start_time = time.time()
            func_name = _get_function_name(func)
            
            # Extract and log request information
            request_info = _extract_request_info(args)
            if log_request and request_info:
                _log_api_request(logger, func_name, request_info)
            
            try:
                # Execute the endpoint
                result = func(*args, **kwargs)
                
                duration = time.time() - start_time
                if log_response:
                    _log_api_response(logger, func_name, duration)
                
                return result
                
            except Exception as e:
                duration = time.time() - start_time
                _log_api_error(logger, func_name, duration, e)
                raise
        
        # Return appropriate wrapper based on whether function is async
        import asyncio
        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        else:
            return sync_wrapper
    
    return decorator


def log_service_operation(
    operation_name: str,
    logger: Optional[logging.Logger] = None,
    log_input: bool = True,
    log_output: bool = False,
    log_performance: bool = True
) -> Callable:
    """
    Decorator for service operations with specific operation context.
    
    Args:
        operation_name: Name of the operation being performed
        logger: Logger instance to use (defaults to common logger)
        log_input: Whether to log input parameters
        log_output: Whether to log output results
        log_performance: Whether to log execution time
        
    Returns:
        Decorator function
    """
    logger = _get_logger_or_default(logger)
    
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            start_time = time.time()
            func_name = _get_function_name(func)
            
            # Log operation start
            _log_operation_start(logger, operation_name, func_name)
            
            # Log input if requested
            if log_input:
                _log_operation_input(logger, operation_name, args, kwargs)
            
            try:
                # Execute the function
                result = func(*args, **kwargs)
                
                # Log operation success
                duration = time.time() - start_time
                _log_operation_success(logger, operation_name, duration, log_output, result)
                
                return result
                
            except Exception as e:
                duration = time.time() - start_time
                _log_operation_error(logger, operation_name, duration, e)
                raise
        
        return wrapper
    return decorator
