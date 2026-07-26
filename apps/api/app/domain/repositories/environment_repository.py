"""Environment repository."""

import uuid
from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.repositories.base import BaseRepository
from app.models.environment import Environment


class EnvironmentRepository(BaseRepository[Environment]):
    """Repository for Environment domain persistence operations."""

    def __init__(self, db: AsyncSession) -> None:
        super().__init__(Environment, db)

    async def get_by_project_and_slug(
        self, project_id: uuid.UUID, slug: str
    ) -> Environment | None:
        """Find environment by project ID and environment slug."""
        result = await self.db.execute(
            select(Environment).where(
                Environment.project_id == project_id, Environment.slug == slug
            )
        )
        return result.scalar_one_or_none()

    async def get_by_project_id(self, project_id: uuid.UUID) -> Sequence[Environment]:
        """Fetch all environments belonging to a project."""
        result = await self.db.execute(
            select(Environment).where(Environment.project_id == project_id)
        )
        return result.scalars().all()
