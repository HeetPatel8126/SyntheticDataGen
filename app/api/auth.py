"""
API Authentication
Simple API key-based authentication for MVP
"""

from fastapi import HTTPException, Security, Depends
from fastapi.security import APIKeyHeader, APIKeyQuery
from starlette.status import HTTP_401_UNAUTHORIZED, HTTP_403_FORBIDDEN

from app.config import settings

# API Key can be provided in header or query parameter
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)
api_key_query = APIKeyQuery(name="api_key", auto_error=False)


async def get_api_key(
    api_key_header_value: str = Security(api_key_header),
    api_key_query_value: str = Security(api_key_query)
) -> str:
    """
    Get API key from request header or query parameter.
    
    Args:
        api_key_header_value: API key from X-API-Key header
        api_key_query_value: API key from api_key query parameter
        
    Returns:
        The API key value
        
    Raises:
        HTTPException: If no API key provided
    """
    api_key = api_key_header_value or api_key_query_value
    
    if not api_key:
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED,
            detail="API key required. Provide via X-API-Key header or api_key query parameter."
        )
    
    return api_key


async def verify_api_key(api_key: str = Depends(get_api_key)) -> str:
    """
    Verify the API key is valid.
    
    Args:
        api_key: API key from request
        
    Returns:
        The verified API key
        
    Raises:
        HTTPException: If API key is invalid
    """
    if api_key != settings.api_key:
        raise HTTPException(
            status_code=HTTP_403_FORBIDDEN,
            detail="Invalid API key"
        )
    
    return api_key


# Optional: User ID extractor (for future user management)
async def get_current_user_id(api_key: str = Depends(verify_api_key)) -> str:
    """
    Get current user ID from API key.
    For MVP, returns a default user ID. Can be extended for multi-user support.
    
    Args:
        api_key: Verified API key
        
    Returns:
        User ID string
    """
    # For MVP, return a default user ID
    # In production, this would look up the user from the API key
    return "default-user"
