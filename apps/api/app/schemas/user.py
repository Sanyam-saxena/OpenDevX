"""User schemas for API requests and responses."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.domain.roles import Role


class UserBase(BaseModel):
    """Base fields shared across user schemas."""

    email: EmailStr
    full_name: str = Field(..., min_length=1, max_length=255)
    role: Role = Role.VIEWER


class UserCreate(UserBase):
    """Schema for user registration / creation."""

    password: str = Field(..., min_length=8, max_length=128)


class UserUpdate(BaseModel):
    """Schema for updating user details."""

    full_name: str | None = Field(None, min_length=1, max_length=255)
    role: Role | None = None
    is_active: bool | None = None


class UserResponse(UserBase):
    """Schema returned for user details."""

    id: UUID
    is_active: bool
    is_superuser: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
