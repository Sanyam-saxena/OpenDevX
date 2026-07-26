"""Audit logs API endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_db_session, require_role
from app.domain.roles import Role
from app.models.user import User
from app.schemas.audit_log import AuditLogResponse
from app.services.audit_log_service import AuditLogService

router = APIRouter()


@router.get(
    "",
    response_model=list[AuditLogResponse],
    summary="List recent operational audit logs",
)
async def list_audit_logs(
    db: Annotated[AsyncSession, Depends(get_db_session)],
    _user: Annotated[User, Depends(require_role(Role.OPERATOR))],
    limit: int = Query(50, ge=1, le=200, description="Max entries to return"),
) -> list[AuditLogResponse]:
    """Fetch recent operational audit log entries across the platform (Operator+)."""
    service = AuditLogService(db)
    logs = await service.list_recent_logs(limit=limit)
    return [AuditLogResponse.model_validate(log) for log in logs]
