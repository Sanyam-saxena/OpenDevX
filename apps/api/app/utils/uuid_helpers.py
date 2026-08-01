"""UUID parsing and validation utilities."""

import uuid
from typing import Any

from fastapi import HTTPException, status


def parse_uuid(val: Any) -> uuid.UUID | None:
    """Safely convert a string or value into a Python uuid.UUID instance.

    Returns None if parsing fails or if value is None.
    """
    if val is None:
        return None
    if isinstance(val, uuid.UUID):
        return val
    if not isinstance(val, str):
        return None
    try:
        return uuid.UUID(val)
    except (ValueError, TypeError, AttributeError):
        return None


def parse_uuid_or_raise(
    val: Any,
    status_code: int = status.HTTP_401_UNAUTHORIZED,
    detail: str = "Invalid UUID format",
    headers: dict[str, str] | None = None,
) -> uuid.UUID:
    """Parse a UUID value or raise an HTTP exception with specified status code."""
    parsed = parse_uuid(val)
    if parsed is None:
        raise HTTPException(status_code=status_code, detail=detail, headers=headers)
    return parsed
