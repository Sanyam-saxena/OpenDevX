"""Projects API endpoints."""

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_db_session, require_role
from app.domain.roles import Role
from app.models.user import User
from app.schemas.pagination import PaginatedResponse
from app.schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate
from app.services.audit_log_service import AuditLogService
from app.services.project_service import ProjectService

router = APIRouter()


@router.get(
    "",
    response_model=PaginatedResponse[ProjectResponse],
    summary="List platform projects",
)
async def list_projects(
    db: Annotated[AsyncSession, Depends(get_db_session)],
    _user: Annotated[User, Depends(require_role(Role.VIEWER))],
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(10, ge=1, le=100, description="Items per page"),
) -> PaginatedResponse[ProjectResponse]:
    """Return a paginated list of all platform projects."""
    service = ProjectService(db)
    skip = (page - 1) * size
    projects = await service.list_projects(skip=skip, limit=size)
    total = await service.count_projects()
    items = [ProjectResponse.model_validate(p) for p in projects]
    return PaginatedResponse.create(items=items, total=total, page=page, size=size)


@router.post(
    "",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new platform project",
)
async def create_project(
    project_in: ProjectCreate,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    user: Annotated[User, Depends(require_role(Role.VIEWER))],
) -> ProjectResponse:
    """Create a new project and initialize default environments."""
    service = ProjectService(db)
    project = await service.create_project(project_in, owner_id=user.id)

    audit_service = AuditLogService(db)
    await audit_service.log_activity(
        action="PROJECT_CREATE",
        resource_type="project",
        resource_id=str(project.id),
        user_id=user.id,
        details={"name": project.name, "slug": project.slug},
    )

    return ProjectResponse.model_validate(project)


@router.get(
    "/{project_id}",
    response_model=ProjectResponse,
    summary="Get project details by ID",
)
async def get_project(
    project_id: uuid.UUID,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    _user: Annotated[User, Depends(require_role(Role.VIEWER))],
) -> ProjectResponse:
    """Return details for a specific project."""
    service = ProjectService(db)
    project = await service.get_project_by_id(project_id)
    return ProjectResponse.model_validate(project)


@router.put(
    "/{project_id}",
    response_model=ProjectResponse,
    summary="Update project details",
)
async def update_project(
    project_id: uuid.UUID,
    update_in: ProjectUpdate,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    user: Annotated[User, Depends(require_role(Role.VIEWER))],
) -> ProjectResponse:
    """Update properties of an existing project."""
    service = ProjectService(db)
    project = await service.update_project(project_id, update_in)

    audit_service = AuditLogService(db)
    await audit_service.log_activity(
        action="PROJECT_UPDATE",
        resource_type="project",
        resource_id=str(project.id),
        user_id=user.id,
    )

    return ProjectResponse.model_validate(project)


@router.delete(
    "/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a project",
)
async def delete_project(
    project_id: uuid.UUID,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    user: Annotated[User, Depends(require_role(Role.VIEWER))],
) -> None:
    """Delete a project and all associated environments (Admin only)."""
    service = ProjectService(db)
    await service.delete_project(project_id)

    audit_service = AuditLogService(db)
    await audit_service.log_activity(
        action="PROJECT_DELETE",
        resource_type="project",
        resource_id=str(project_id),
        user_id=user.id,
    )
