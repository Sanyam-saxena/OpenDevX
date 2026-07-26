"""Users management API endpoints (Admin)."""

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_db_session, require_role
from app.domain.roles import Role
from app.models.user import User
from app.schemas.pagination import PaginatedResponse
from app.schemas.user import UserResponse, UserUpdate
from app.services.audit_log_service import AuditLogService

router = APIRouter()


@router.get(
    "",
    response_model=PaginatedResponse[UserResponse],
    summary="List all user accounts (Admin only)",
)
async def list_users(
    db: Annotated[AsyncSession, Depends(get_db_session)],
    _admin: Annotated[User, Depends(require_role(Role.ADMIN))],
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(10, ge=1, le=100, description="Items per page"),
) -> PaginatedResponse[UserResponse]:
    """Return a paginated list of user accounts across the platform."""
    skip = (page - 1) * size
    res = await db.execute(select(User).offset(skip).limit(size))
    users = res.scalars().all()

    count_res = await db.execute(select(func.count()).select_from(User))
    total = count_res.scalar_one() or 0

    items = [UserResponse.model_validate(u) for u in users]
    return PaginatedResponse.create(items=items, total=total, page=page, size=size)


@router.get(
    "/{user_id}",
    response_model=UserResponse,
    summary="Get user details by ID (Admin only)",
)
async def get_user(
    user_id: uuid.UUID,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    _admin: Annotated[User, Depends(require_role(Role.ADMIN))],
) -> UserResponse:
    """Fetch details of a specific user account."""
    res = await db.execute(select(User).where(User.id == user_id))
    user = res.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return UserResponse.model_validate(user)


@router.put(
    "/{user_id}",
    response_model=UserResponse,
    summary="Update user role or active status (Admin only)",
)
async def update_user(
    user_id: uuid.UUID,
    update_in: UserUpdate,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    admin: Annotated[User, Depends(require_role(Role.ADMIN))],
) -> UserResponse:
    """Update role or active status for a user."""
    res = await db.execute(select(User).where(User.id == user_id))
    user = res.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    if update_in.full_name is not None:
        user.full_name = update_in.full_name
    if update_in.role is not None:
        user.role = update_in.role
    if update_in.is_active is not None:
        user.is_active = update_in.is_active

    await db.flush()
    await db.refresh(user)

    audit_service = AuditLogService(db)
    await audit_service.log_activity(
        action="USER_UPDATE",
        resource_type="user",
        resource_id=str(user.id),
        user_id=admin.id,
        details={"updated_fields": update_in.model_dump(exclude_unset=True)},
    )

    return UserResponse.model_validate(user)
