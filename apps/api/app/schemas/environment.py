"""Environment schemas for API requests and responses."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class EnvironmentBase(BaseModel):
    """Base fields for environment schemas."""

    name: str = Field(..., min_length=1, max_length=255)
    slug: str | None = Field(None, min_length=1, max_length=255)
    is_active: bool = True


class EnvironmentCreate(EnvironmentBase):
    """Schema for creating a project environment."""

    pass


class EnvironmentUpdate(BaseModel):
    """Schema for updating an environment."""

    name: str | None = Field(None, min_length=1, max_length=255)
    is_active: bool | None = None


class EnvironmentResponse(EnvironmentBase):
    """Schema returned for environment details."""

    id: UUID
    project_id: UUID
    slug: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
