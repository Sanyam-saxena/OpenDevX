"""Environments API endpoints."""

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_db_session, require_role
from app.domain.roles import Role
from app.models.user import User
from app.schemas.environment import (
    EnvironmentCreate,
    EnvironmentResponse,
    EnvironmentUpdate,
)
from app.services.audit_log_service import AuditLogService
from app.services.environment_service import EnvironmentService

router = APIRouter()


@router.get(
    "/{project_id}/environments",
    response_model=list[EnvironmentResponse],
    summary="List project environments",
)
async def list_environments(
    project_id: uuid.UUID,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    _user: Annotated[User, Depends(require_role(Role.VIEWER))],
) -> list[EnvironmentResponse]:
    """Return all environments defined for a project."""
    service = EnvironmentService(db)
    envs = await service.list_environments_for_project(project_id)
    return [EnvironmentResponse.model_validate(e) for e in envs]


@router.post(
    "/{project_id}/environments",
    response_model=EnvironmentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add an environment to a project",
)
async def create_environment(
    project_id: uuid.UUID,
    env_in: EnvironmentCreate,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    user: Annotated[User, Depends(require_role(Role.VIEWER))],
) -> EnvironmentResponse:
    """Create a new environment in a project."""
    service = EnvironmentService(db)
    env = await service.create_environment(project_id, env_in)

    audit_service = AuditLogService(db)
    await audit_service.log_activity(
        action="ENVIRONMENT_CREATE",
        resource_type="environment",
        resource_id=str(env.id),
        user_id=user.id,
        details={"project_id": str(project_id), "slug": env.slug},
    )

    return EnvironmentResponse.model_validate(env)


@router.put(
    "/{project_id}/environments/{slug}",
    response_model=EnvironmentResponse,
    summary="Update an environment",
)
async def update_environment(
    project_id: uuid.UUID,
    slug: str,
    update_in: EnvironmentUpdate,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    user: Annotated[User, Depends(require_role(Role.VIEWER))],
) -> EnvironmentResponse:
    """Update environment configuration."""
    service = EnvironmentService(db)
    env = await service.update_environment(project_id, slug, update_in)

    audit_service = AuditLogService(db)
    await audit_service.log_activity(
        action="ENVIRONMENT_UPDATE",
        resource_type="environment",
        resource_id=str(env.id),
        user_id=user.id,
    )

    return EnvironmentResponse.model_validate(env)


@router.delete(
    "/{project_id}/environments/{slug}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete an environment from a project",
)
async def delete_environment(
    project_id: uuid.UUID,
    slug: str,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    user: Annotated[User, Depends(require_role(Role.VIEWER))],
) -> None:
    """Delete an environment (Admin only)."""
    service = EnvironmentService(db)
    await service.delete_environment(project_id, slug)

    audit_service = AuditLogService(db)
    await audit_service.log_activity(
        action="ENVIRONMENT_DELETE",
        resource_type="environment",
        resource_id=slug,
        user_id=user.id,
        details={"project_id": str(project_id)},
    )
