"""AuditLog service for capturing operational activities."""

import uuid
from collections.abc import Sequence
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.repositories.audit_log_repository import AuditLogRepository
from app.models.audit_log import AuditLog


class AuditLogService:
    """Service handling audit logging operations."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.audit_repo = AuditLogRepository(db)

    async def log_activity(
        self,
        action: str,
        resource_type: str,
        user_id: uuid.UUID | None = None,
        resource_id: str | None = None,
        details: dict[str, Any] | None = None,
        ip_address: str | None = None,
    ) -> AuditLog:
        """Create and store an audit log entry."""
        log_entry = AuditLog(
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            details=details,
            ip_address=ip_address,
        )
        return await self.audit_repo.create(log_entry)

    async def list_recent_logs(self, limit: int = 100) -> Sequence[AuditLog]:
        """Fetch recent audit log entries."""
        return await self.audit_repo.get_recent(limit=limit)

    async def list_logs_for_user(
        self, user_id: uuid.UUID, limit: int = 50
    ) -> Sequence[AuditLog]:
        """Fetch audit log entries for a specific user."""
        return await self.audit_repo.get_by_user_id(user_id, limit=limit)
