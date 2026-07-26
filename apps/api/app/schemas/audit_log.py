"""AuditLog schemas for API requests and responses."""

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class AuditLogCreate(BaseModel):
    """Schema for recording an audit log entry."""

    action: str = Field(..., min_length=1, max_length=255)
    resource_type: str = Field(..., min_length=1, max_length=255)
    resource_id: str | None = Field(None, max_length=255)
    details: dict[str, Any] | None = None
    ip_address: str | None = Field(None, max_length=45)


class AuditLogResponse(AuditLogCreate):
    """Schema returned for audit log entries."""

    id: UUID
    user_id: UUID | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
