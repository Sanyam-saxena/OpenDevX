"""Project service for business workflows and domain orchestration."""

import re
import uuid
from collections.abc import Sequence

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.repositories.environment_repository import EnvironmentRepository
from app.domain.repositories.project_repository import ProjectRepository
from app.models.environment import Environment
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate


def slugify(text: str) -> str:
    """Convert text to URL-safe slug."""
    s = text.lower().strip()
    s = re.sub(r"[^\w\s-]", "", s)
    s = re.sub(r"[\s_-]+", "-", s)
    return s.strip("-")


class ProjectService:
    """Service orchestrating Project business logic."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.project_repo = ProjectRepository(db)
        self.env_repo = EnvironmentRepository(db)

    async def create_project(
        self, project_in: ProjectCreate, owner_id: uuid.UUID | None = None
    ) -> Project:
        """Create a new Project and initialize default environments."""
        slug = project_in.slug or slugify(project_in.name)

        existing_name = await self.project_repo.get_by_name(project_in.name)
        if existing_name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Project with name '{project_in.name}' already exists",
            )

        existing_slug = await self.project_repo.get_by_slug(slug)
        if existing_slug:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Project with slug '{slug}' already exists",
            )

        project = Project(
            name=project_in.name,
            slug=slug,
            description=project_in.description,
            owner_id=owner_id,
        )

        project = await self.project_repo.create(project)

        # Automatically create default environments: development and production
        dev_env = Environment(
            project_id=project.id,
            name="Development",
            slug="development",
            is_active=True,
        )
        prod_env = Environment(
            project_id=project.id,
            name="Production",
            slug="production",
            is_active=True,
        )
        await self.env_repo.create(dev_env)
        await self.env_repo.create(prod_env)

        # Refresh project to populate environments relationship
        return await self.get_project_by_id(project.id)

    async def get_project_by_id(self, project_id: uuid.UUID) -> Project:
        """Fetch project by ID or raise 404."""
        project = await self.project_repo.get_by_id(project_id)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found",
            )
        return project

    async def get_project_by_slug(self, slug: str) -> Project:
        """Fetch project by slug or raise 404."""
        project = await self.project_repo.get_by_slug(slug)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Project '{slug}' not found",
            )
        return project

    async def list_projects(self, skip: int = 0, limit: int = 100) -> Sequence[Project]:
        """List projects with pagination."""
        return await self.project_repo.get_all(skip=skip, limit=limit)

    async def count_projects(self) -> int:
        """Get total count of projects."""
        return await self.project_repo.count()

    async def update_project(
        self, project_id: uuid.UUID, update_in: ProjectUpdate
    ) -> Project:
        """Update existing project details."""
        project = await self.get_project_by_id(project_id)

        if update_in.name is not None and update_in.name != project.name:
            existing = await self.project_repo.get_by_name(update_in.name)
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Project with name '{update_in.name}' already exists",
                )
            project.name = update_in.name
            project.slug = slugify(update_in.name)

        if update_in.description is not None:
            project.description = update_in.description

        if update_in.owner_id is not None:
            project.owner_id = update_in.owner_id

        return await self.project_repo.update(project)

    async def delete_project(self, project_id: uuid.UUID) -> None:
        """Delete project by ID."""
        project = await self.get_project_by_id(project_id)
        await self.project_repo.delete(project)
