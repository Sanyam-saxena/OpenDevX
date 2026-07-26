"""Tests for domain models, repositories, and services."""

import uuid
from unittest.mock import AsyncMock, patch

import pytest
from fastapi import HTTPException

from app.models.project import Project
from app.schemas.environment import EnvironmentCreate
from app.schemas.project import ProjectCreate
from app.services.environment_service import EnvironmentService
from app.services.project_service import ProjectService, slugify


def test_slugify_utility() -> None:
    """Verify slugify function handles uppercase, spaces, and special characters."""
    assert slugify("OpenDevX IDP Platform") == "opendevx-idp-platform"
    assert slugify("   My  Test  Project!  ") == "my-test-project"
    assert slugify("Alpha & Beta Services") == "alpha-beta-services"


@pytest.mark.anyio
async def test_project_service_create_duplicate_name_fails() -> None:
    """Verify creating a project with a duplicate name raises HTTP 400."""
    db_mock = AsyncMock()
    service = ProjectService(db_mock)

    existing_proj = Project(id=uuid.uuid4(), name="Existing Proj", slug="existing-proj")

    with patch.object(
        service.project_repo,
        "get_by_name",
        new_callable=AsyncMock,
    ) as mock_get_name:
        mock_get_name.return_value = existing_proj

        project_in = ProjectCreate(name="Existing Proj", description="Test")
        with pytest.raises(HTTPException) as exc_info:
            await service.create_project(project_in)

    assert exc_info.value.status_code == 400
    assert "already exists" in exc_info.value.detail


@pytest.mark.anyio
async def test_project_service_get_not_found_raises_404() -> None:
    """Verify fetching a non-existent project raises HTTP 404."""
    db_mock = AsyncMock()
    service = ProjectService(db_mock)

    with patch.object(
        service.project_repo,
        "get_by_id",
        new_callable=AsyncMock,
    ) as mock_get_id:
        mock_get_id.return_value = None

        with pytest.raises(HTTPException) as exc_info:
            await service.get_project_by_id(uuid.uuid4())

    assert exc_info.value.status_code == 404
    assert "Project not found" in exc_info.value.detail


@pytest.mark.anyio
async def test_environment_service_create_invalid_project_fails() -> None:
    """Verify creating an environment for a missing project raises HTTP 404."""
    db_mock = AsyncMock()
    service = EnvironmentService(db_mock)

    with patch.object(
        service.project_repo,
        "get_by_id",
        new_callable=AsyncMock,
    ) as mock_get_id:
        mock_get_id.return_value = None

        env_in = EnvironmentCreate(name="Staging", is_active=True)
        with pytest.raises(HTTPException) as exc_info:
            await service.create_environment(uuid.uuid4(), env_in)

    assert exc_info.value.status_code == 404
    assert "Project not found" in exc_info.value.detail
