"""AuditLog repository."""

import uuid
from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.repositories.base import BaseRepository
from app.models.audit_log import AuditLog


class AuditLogRepository(BaseRepository[AuditLog]):
    """Repository for AuditLog domain persistence operations."""

    def __init__(self, db: AsyncSession) -> None:
        super().__init__(AuditLog, db)

    async def get_by_user_id(
        self, user_id: uuid.UUID, limit: int = 50
    ) -> Sequence[AuditLog]:
        """Fetch audit log entries created by a specific user."""
        result = await self.db.execute(
            select(AuditLog)
            .where(AuditLog.user_id == user_id)
            .order_by(AuditLog.created_at.desc())
            .limit(limit)
        )
        return result.scalars().all()

    async def get_recent(self, limit: int = 100) -> Sequence[AuditLog]:
        """Fetch recent audit log entries."""
        result = await self.db.execute(
            select(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit)
        )
        return result.scalars().all()
