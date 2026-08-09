"""Project schemas for API requests and responses."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.environment import EnvironmentResponse


class ProjectBase(BaseModel):
    """Base fields for project schemas."""

    name: str = Field(..., min_length=1, max_length=255)
    description: str | None = Field(None, max_length=2000)
    repo_url: str | None = Field(None, max_length=500)
    project_type: str | None = Field(None, max_length=100)
    migration_source: str | None = Field(None, max_length=100)
    migration_status: str | None = Field(None, max_length=50)


class ProjectCreate(ProjectBase):
    """Schema for creating a project."""

    slug: str | None = Field(None, min_length=1, max_length=255)
    environments: list[str] | None = Field(
        None, description="Custom initial environments"
    )


class ProjectUpdate(BaseModel):
    """Schema for updating a project."""

    name: str | None = Field(None, min_length=1, max_length=255)
    description: str | None = Field(None, max_length=2000)
    repo_url: str | None = Field(None, max_length=500)
    project_type: str | None = Field(None, max_length=100)
    migration_source: str | None = Field(None, max_length=100)
    migration_status: str | None = Field(None, max_length=50)
    owner_id: UUID | None = None


class ProjectResponse(ProjectBase):
    """Schema returned for project details."""

    id: UUID
    slug: str
    owner_id: UUID | None = None
    environments: list[EnvironmentResponse] = []
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
