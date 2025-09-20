from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, Dict, Any
import jwt
import requests
import time
from typing import Dict, Optional, Any
from app.core.config import settings
from app.utils.logger import get_common_logger

logger = get_common_logger()

# Security scheme
security = HTTPBearer()

# Cache for Google public keys
_google_keys_cache: Optional[Dict[str, Any]] = None
_google_keys_cache_time: float = 0
_google_keys_cache_ttl: int = 3600  # 1 hour cache TTL

class JWTAuth:
    """JWT Authentication for Google auth tokens."""
    
    @staticmethod
    def verify_google_token(token: str) -> Optional[Dict[str, Any]]:
        """
        Verify Google JWT token using Google's public keys.
        This is the correct way to verify Google OAuth tokens.
        """
        try:
            # Get Google's public keys
            google_keys = JWTAuth._get_google_public_keys()
            if not google_keys:
                logger.error("Failed to fetch Google public keys")
                return None
            
            # Decode header to get key ID
            unverified_header = jwt.get_unverified_header(token)
            key_id = unverified_header.get('kid')
            
            if not key_id or key_id not in google_keys:
                logger.warning(f"Token key ID {key_id} not found in Google keys")
                return None
            
            # Get the public key
            public_key = google_keys[key_id]
            
            # Verify the token with Google's public key
            payload = jwt.decode(
                token,
                key=public_key,
                algorithms=['RS256'],  # Google uses RS256
                options={
                    "verify_signature": True,
                    "verify_exp": True,
                    "verify_iat": True,
                    "verify_aud": True,
                    "verify_iss": True,
                },
                audience=settings.GOOGLE_CLIENT_ID,  # Must be our app's client ID
                issuer="https://accounts.google.com"  # Must be from Google
            )
            
            logger.info(f"Successfully verified Google token for user: {payload.get('email')}")
            return payload
            
        except jwt.ExpiredSignatureError:
            logger.warning("Google token has expired")
            return None
        except jwt.InvalidAudienceError:
            logger.warning("Google token audience is invalid - not meant for our app")
            return None
        except jwt.InvalidIssuerError:
            logger.warning("Google token issuer is invalid - not from Google")
            return None
        except jwt.InvalidSignatureError:
            logger.warning("Google token signature is invalid")
            return None
        except jwt.InvalidTokenError as e:
            logger.warning(f"Invalid Google JWT token: {e}")
            return None
        except Exception as e:
            logger.error(f"Error verifying Google token: {e}")
            return None
    
    @staticmethod
    def _get_google_public_keys() -> Optional[Dict[str, str]]:
        """
        Fetch Google's public keys for JWT verification with caching.
        Keys are cached for 1 hour to avoid fetching on every request.
        """
        global _google_keys_cache, _google_keys_cache_time
        
        current_time = time.time()
        
        # Check if cache is valid
        if (_google_keys_cache is not None and 
            current_time - _google_keys_cache_time < _google_keys_cache_ttl):
            logger.debug("Using cached Google public keys")
            return _google_keys_cache
        
        try:
            logger.info("Fetching Google public keys from API")
            # Google's public keys endpoint
            url = "https://www.googleapis.com/oauth2/v3/certs"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            keys_data = response.json()
            keys = {}
            
            for key_info in keys_data.get('keys', []):
                key_id = key_info.get('kid')
                if key_id:
                    # Convert JWK to PEM format
                    public_key = jwt.algorithms.RSAAlgorithm.from_jwk(key_info)
                    keys[key_id] = public_key
            
            # Update cache
            _google_keys_cache = keys
            _google_keys_cache_time = current_time
            
            logger.info(f"Fetched and cached {len(keys)} Google public keys")
            return keys
            
        except requests.RequestException as e:
            logger.error(f"Failed to fetch Google public keys: {e}")
            # Return cached keys if available, even if expired
            if _google_keys_cache is not None:
                logger.warning("Using expired cached keys due to fetch failure")
                return _google_keys_cache
            return None
        except Exception as e:
            logger.error(f"Error processing Google public keys: {e}")
            # Return cached keys if available, even if expired
            if _google_keys_cache is not None:
                logger.warning("Using expired cached keys due to processing error")
                return _google_keys_cache
            return None
    
    @staticmethod
    def clear_google_keys_cache():
        """Clear the Google public keys cache. Useful for testing or forcing refresh."""
        global _google_keys_cache, _google_keys_cache_time
        _google_keys_cache = None
        _google_keys_cache_time = 0
        logger.info("Google public keys cache cleared")
    
    @staticmethod
    def get_cache_info() -> Dict[str, Any]:
        """Get information about the current cache state."""
        global _google_keys_cache, _google_keys_cache_time, _google_keys_cache_ttl
        
        current_time = time.time()
        cache_age = current_time - _google_keys_cache_time if _google_keys_cache_time > 0 else 0
        cache_valid = (_google_keys_cache is not None and 
                      current_time - _google_keys_cache_time < _google_keys_cache_ttl)
        
        return {
            "has_cache": _google_keys_cache is not None,
            "cache_valid": cache_valid,
            "cache_age_seconds": cache_age,
            "cache_ttl_seconds": _google_keys_cache_ttl,
            "keys_count": len(_google_keys_cache) if _google_keys_cache else 0
        }
    
    @staticmethod
    async def get_current_user(
        credentials: HTTPAuthorizationCredentials = Depends(security)
    ) -> Dict[str, Any]:
        """
        Get current user from JWT token in Bearer header.
        This works with Google authentication tokens.
        """
        token = credentials.credentials

        logger.debug(f"Verifying Google token: {token}")
        
        # Verify the token
        payload = JWTAuth.verify_google_token(token)
        if payload is None:
            logger.warning("Invalid or expired JWT token")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Extract user information
        user_info = {
            "user_id": payload.get("sub"),
            "email": payload.get("email"),
            "name": payload.get("name"),
            "picture": payload.get("picture"),
            "email_verified": payload.get("email_verified", False)
        }
        
        logger.info(f"Authenticated user: {user_info['email']}")
        return user_info

# Convenience function for dependency injection
async def require_auth(current_user: Dict[str, Any] = Depends(JWTAuth.get_current_user)):
    """Require JWT authentication for protected endpoints."""
    return current_user
