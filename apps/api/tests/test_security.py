"""Tests for security module (password hashing and JWT tokens)."""

from datetime import timedelta

import jwt
import pytest

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_password_hash,
    verify_password,
)


def test_password_hashing_and_verification() -> None:
    """Verify password hashing produces a valid hash and verifies correctly."""
    plain = "SuperSecret123!"
    hashed = get_password_hash(plain)

    assert hashed != plain
    assert verify_password(plain, hashed) is True
    assert verify_password("WrongPassword", hashed) is False


def test_create_and_decode_access_token() -> None:
    """Verify access token creation and claim extraction."""
    user_id = "12345678-1234-5678-1234-567812345678"
    claims = {"role": "admin", "email": "admin@example.com"}

    token = create_access_token(subject=user_id, extra_claims=claims)
    decoded = decode_token(token)

    assert decoded["sub"] == user_id
    assert decoded["type"] == "access"
    assert decoded["role"] == "admin"
    assert decoded["email"] == "admin@example.com"


def test_create_and_decode_refresh_token() -> None:
    """Verify refresh token creation and validation."""
    user_id = "87654321-4321-8765-4321-876543218765"

    token = create_refresh_token(subject=user_id)
    decoded = decode_token(token)

    assert decoded["sub"] == user_id
    assert decoded["type"] == "refresh"


def test_expired_token_raises_jwt_error() -> None:
    """Verify expired tokens raise PyJWTError when decoded."""
    token = create_access_token(
        subject="user-1",
        expires_delta=timedelta(seconds=-1),
    )

    with pytest.raises(jwt.PyJWTError):
        decode_token(token)
