"""Integration tests for Projects, Environments, and REST middleware."""

import uuid
from datetime import UTC, datetime
from unittest.mock import AsyncMock, patch

import pytest
from fastapi import status
from fastapi.testclient import TestClient

from app.api.dependencies import get_current_active_user
from app.domain.roles import Role
from app.main import create_app
from app.models.project import Project
from app.models.user import User


@pytest.fixture()
def mock_operator() -> User:
    """Return a mock Operator User."""
    return User(
        id=uuid.uuid4(),
        email="op@example.com",
        hashed_password="hash",
        full_name="Operator User",
        role=Role.OPERATOR,
        is_active=True,
        is_superuser=False,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )


@pytest.fixture()
def mock_viewer() -> User:
    """Return a mock Viewer User."""
    return User(
        id=uuid.uuid4(),
        email="viewer@example.com",
        hashed_password="hash",
        full_name="Viewer User",
        role=Role.VIEWER,
        is_active=True,
        is_superuser=False,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )


def test_request_id_middleware_injects_header() -> None:
    """Verify X-Request-ID is attached to HTTP responses."""
    client = TestClient(create_app())
    response = client.get("/api/v1/health")

    assert response.status_code == status.HTTP_200_OK
    assert "X-Request-ID" in response.headers
    assert len(response.headers["X-Request-ID"]) > 0


def test_list_projects_paginated(mock_viewer: User) -> None:
    """Verify GET /projects returns paginated projects."""
    app = create_app()

    async def override_get_current_user() -> User:
        return mock_viewer

    app.dependency_overrides[get_current_active_user] = override_get_current_user
    client = TestClient(app)

    with (
        patch(
            "app.services.project_service.ProjectService.list_projects",
            new_callable=AsyncMock,
        ) as mock_list,
        patch(
            "app.services.project_service.ProjectService.count_projects",
            new_callable=AsyncMock,
        ) as mock_count,
    ):
        mock_list.return_value = [
            Project(
                id=uuid.UUID("22222222-2222-2222-2222-222222222222"),
                name="Project Alpha",
                slug="project-alpha",
                description="Alpha Desc",
                owner_id=mock_viewer.id,
                created_at=datetime.now(UTC),
                updated_at=datetime.now(UTC),
            )
        ]
        mock_count.return_value = 1

        response = client.get("/api/v1/projects?page=1&size=10")

    assert response.status_code == status.HTTP_200_OK
    body = response.json()
    assert body["total"] == 1
    assert body["page"] == 1
    assert body["size"] == 10
    assert body["pages"] == 1
    assert len(body["items"]) == 1
    assert body["items"][0]["name"] == "Project Alpha"


def test_create_project_success(mock_viewer: User) -> None:
    """Verify authenticated user can create a project successfully."""
    app = create_app()

    async def override_get_current_user() -> User:
        return mock_viewer

    app.dependency_overrides[get_current_active_user] = override_get_current_user
    client = TestClient(app)

    with (
        patch(
            "app.services.project_service.ProjectService.create_project",
            new_callable=AsyncMock,
        ) as mock_create,
        patch(
            "app.services.audit_log_service.AuditLogService.log_activity",
            new_callable=AsyncMock,
        ),
    ):
        mock_create.return_value = Project(
            id=uuid.UUID("33333333-3333-3333-3333-333333333333"),
            name="New Proj",
            slug="new-proj",
            description="Test Proj",
            owner_id=mock_viewer.id,
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
        )

        payload = {"name": "New Proj", "description": "Test Proj"}
        response = client.post("/api/v1/projects", json=payload)

    assert response.status_code == status.HTTP_201_CREATED
    body = response.json()
    assert body["name"] == "New Proj"
    assert body["slug"] == "new-proj"
