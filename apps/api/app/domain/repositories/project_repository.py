"""Project repository."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.repositories.base import BaseRepository
from app.models.project import Project


class ProjectRepository(BaseRepository[Project]):
    """Repository for Project domain persistence operations."""

    def __init__(self, db: AsyncSession) -> None:
        super().__init__(Project, db)

    async def get_by_slug(self, slug: str) -> Project | None:
        """Find project by URL slug."""
        result = await self.db.execute(select(Project).where(Project.slug == slug))
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str) -> Project | None:
        """Find project by name."""
        result = await self.db.execute(select(Project).where(Project.name == name))
        return result.scalar_one_or_none()
