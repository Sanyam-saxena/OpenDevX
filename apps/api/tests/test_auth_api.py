"""Tests for Auth API routes and endpoints."""

import uuid
from datetime import UTC, datetime
from unittest.mock import AsyncMock, patch

import pytest
from fastapi import status
from fastapi.testclient import TestClient

from app.api.dependencies import get_current_active_user
from app.core.security import (
    create_access_token,
    create_refresh_token,
    get_password_hash,
)
from app.domain.roles import Role
from app.main import create_app
from app.models.user import User


@pytest.fixture()
def mock_user() -> User:
    """Return a sample User ORM instance."""
    user = User(
        id=uuid.uuid4(),
        email="testuser@example.com",
        hashed_password=get_password_hash("Password123!"),
        full_name="Test User",
        role=Role.VIEWER,
        is_active=True,
        is_superuser=False,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )
    return user


@pytest.fixture()
def mock_admin_user() -> User:
    """Return a sample Admin User ORM instance."""
    user = User(
        id=uuid.uuid4(),
        email="admin@example.com",
        hashed_password=get_password_hash("AdminPassword123!"),
        full_name="Admin User",
        role=Role.ADMIN,
        is_active=True,
        is_superuser=True,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )
    return user


@pytest.fixture()
def client() -> TestClient:
    return TestClient(create_app())


def test_register_user_success(client: TestClient) -> None:
    """Verify user registration returns 201 Created and user response data."""
    mock_user_obj = User(
        id=uuid.UUID("11111111-1111-1111-1111-111111111111"),
        email="newuser@example.com",
        hashed_password="hashed_secret",
        full_name="New User",
        role=Role.VIEWER,
        is_active=True,
        is_superuser=False,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )

    with patch(
        "app.services.auth_service.AuthService.register_user",
        new_callable=AsyncMock,
    ) as mock_register:
        mock_register.return_value = mock_user_obj

        payload = {
            "email": "newuser@example.com",
            "password": "SecurePassword123!",
            "full_name": "New User",
            "role": "viewer",
        }
        response = client.post("/api/v1/auth/register", json=payload)

    assert response.status_code == status.HTTP_201_CREATED
    body = response.json()
    assert body["email"] == "newuser@example.com"
    assert body["full_name"] == "New User"
    assert body["role"] == "viewer"
    assert body["id"] == "11111111-1111-1111-1111-111111111111"


def test_login_success(client: TestClient, mock_user: User) -> None:
    """Verify login with correct credentials returns access and refresh tokens."""
    with patch(
        "app.services.auth_service.AuthService.authenticate_user",
        new_callable=AsyncMock,
    ) as mock_auth:
        mock_auth.return_value = mock_user

        payload = {
            "email": "testuser@example.com",
            "password": "Password123!",
        }
        response = client.post("/api/v1/auth/login", json=payload)

    assert response.status_code == status.HTTP_200_OK
    body = response.json()
    assert "access_token" in body
    assert "refresh_token" in body
    assert body["token_type"] == "bearer"
    assert body["user"]["email"] == mock_user.email


def test_login_invalid_credentials(client: TestClient) -> None:
    """Verify login with invalid credentials returns 401 Unauthorized."""
    from fastapi import HTTPException

    with patch(
        "app.services.auth_service.AuthService.authenticate_user",
        new_callable=AsyncMock,
    ) as mock_auth:
        mock_auth.side_effect = HTTPException(
            status_code=401, detail="Incorrect email or password"
        )

        payload = {
            "email": "wrong@example.com",
            "password": "WrongPassword!",
        }
        response = client.post("/api/v1/auth/login", json=payload)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    body = response.json()
    assert body["error"]["message"] == "Incorrect email or password"


def test_get_me_unauthenticated(client: TestClient) -> None:
    """Verify GET /auth/me without authorization header returns 401."""
    response = client.get("/api/v1/auth/me")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_get_me_authenticated(client: TestClient, mock_user: User) -> None:
    """Verify GET /auth/me with valid Bearer token returns current user profile."""
    app = create_app()

    async def override_get_current_user() -> User:
        return mock_user

    app.dependency_overrides[get_current_active_user] = override_get_current_user
    test_client = TestClient(app)

    token = create_access_token(subject=str(mock_user.id))
    response = test_client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == status.HTTP_200_OK
    body = response.json()
    assert body["email"] == mock_user.email
    assert body["full_name"] == mock_user.full_name


def test_refresh_token_success(client: TestClient, mock_user: User) -> None:
    """Verify refresh endpoint returns new tokens for a valid refresh token."""
    refresh_tok = create_refresh_token(subject=str(mock_user.id))

    with patch(
        "app.services.auth_service.AuthService.get_user_by_id",
        new_callable=AsyncMock,
    ) as mock_get_by_id:
        mock_get_by_id.return_value = mock_user

        response = client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": refresh_tok},
        )

    assert response.status_code == status.HTTP_200_OK
    body = response.json()
    assert "access_token" in body
    assert "refresh_token" in body
    assert body["user"]["email"] == mock_user.email
