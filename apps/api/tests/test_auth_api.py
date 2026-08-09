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


def test_get_me_malformed_uuid_token(client: TestClient) -> None:
    """Verify access token with malformed sub UUID returns HTTP 401 Unauthorized."""
    token = create_access_token(subject="not-a-valid-uuid-string")
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.headers.get("WWW-Authenticate") == "Bearer"
    body = response.json()
    assert body["error"]["message"] == "Could not validate credentials"


def test_get_me_nonexistent_user(client: TestClient) -> None:
    """Verify access token with valid UUID for non-existent user returns HTTP 401 User not found."""
    non_existent_id = uuid.uuid4()
    token = create_access_token(subject=str(non_existent_id))

    with patch(
        "app.services.auth_service.AuthService.get_user_by_id",
        new_callable=AsyncMock,
    ) as mock_get_by_id:
        mock_get_by_id.return_value = None
        response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {token}"},
        )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.headers.get("WWW-Authenticate") == "Bearer"
    body = response.json()
    assert body["error"]["message"] == "User not found"


def test_refresh_token_malformed_uuid(client: TestClient) -> None:
    """Verify refresh token with malformed sub UUID returns HTTP 401 Unauthorized."""
    refresh_tok = create_refresh_token(subject="invalid-uuid")
    response = client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": refresh_tok},
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    body = response.json()
    assert body["error"]["message"] == "Malformed token claims"


def test_get_me_inactive_user(client: TestClient, mock_user: User) -> None:
    """Verify token for inactive user returns HTTP 403 Forbidden."""
    mock_user.is_active = False
    token = create_access_token(subject=str(mock_user.id))

    with patch(
        "app.services.auth_service.AuthService.get_user_by_id",
        new_callable=AsyncMock,
    ) as mock_get_by_id:
        mock_get_by_id.return_value = mock_user

        response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {token}"},
        )

    assert response.status_code == status.HTTP_403_FORBIDDEN
    body = response.json()
    assert body["error"]["message"] == "Inactive user account"


def test_cors_headers_on_error_responses(client: TestClient) -> None:
    """Verify CORS security response headers exist on 401, 404, 422 error responses."""
    origin_header = {"Origin": "http://localhost:3000"}

    # 401 Unauthorized
    resp_401 = client.get("/api/v1/auth/me", headers=origin_header)
    assert resp_401.status_code == status.HTTP_401_UNAUTHORIZED
    assert "access-control-allow-origin" in resp_401.headers

    # 404 Not Found
    resp_404 = client.get("/api/v1/nonexistent_route", headers=origin_header)
    assert resp_404.status_code == status.HTTP_404_NOT_FOUND
    assert "access-control-allow-origin" in resp_404.headers

    # 422 Unprocessable Entity
    resp_422 = client.post("/api/v1/auth/login", json={}, headers=origin_header)
    assert resp_422.status_code == 422
    assert "access-control-allow-origin" in resp_422.headers
