"""Environment service for managing project environments."""

import uuid
from collections.abc import Sequence

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.repositories.environment_repository import EnvironmentRepository
from app.domain.repositories.project_repository import ProjectRepository
from app.models.environment import Environment
from app.schemas.environment import EnvironmentCreate, EnvironmentUpdate
from app.services.project_service import slugify


class EnvironmentService:
    """Service handling Environment business logic."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.env_repo = EnvironmentRepository(db)
        self.project_repo = ProjectRepository(db)

    async def create_environment(
        self, project_id: uuid.UUID, env_in: EnvironmentCreate
    ) -> Environment:
        """Create a new environment for a project."""
        project = await self.project_repo.get_by_id(project_id)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found",
            )

        slug = env_in.slug or slugify(env_in.name)

        existing = await self.env_repo.get_by_project_and_slug(project_id, slug)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Environment '{slug}' already exists in this project",
            )

        environment = Environment(
            project_id=project_id,
            name=env_in.name,
            slug=slug,
            is_active=env_in.is_active,
        )
        return await self.env_repo.create(environment)

    async def list_environments_for_project(
        self, project_id: uuid.UUID
    ) -> Sequence[Environment]:
        """Fetch all environments for a project."""
        project = await self.project_repo.get_by_id(project_id)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found",
            )
        return await self.env_repo.get_by_project_id(project_id)

    async def update_environment(
        self,
        project_id: uuid.UUID,
        env_slug: str,
        update_in: EnvironmentUpdate,
    ) -> Environment:
        """Update environment properties."""
        env = await self.env_repo.get_by_project_and_slug(project_id, env_slug)
        if not env:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Environment '{env_slug}' not found in project",
            )

        if update_in.name is not None:
            env.name = update_in.name
            env.slug = slugify(update_in.name)

        if update_in.is_active is not None:
            env.is_active = update_in.is_active

        return await self.env_repo.update(env)

    async def delete_environment(self, project_id: uuid.UUID, env_slug: str) -> None:
        """Delete an environment from a project."""
        env = await self.env_repo.get_by_project_and_slug(project_id, env_slug)
        if not env:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Environment '{env_slug}' not found in project",
            )
        await self.env_repo.delete(env)
