"""
AWS Secrets Manager REST API Endpoints.
"""

import uuid
from typing import Annotated, List, Dict, Any
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_db_session, require_role
from app.domain.roles import Role
from app.models.user import User
from app.services.audit_log_service import AuditLogService
from app.services.secrets_service import SecretsService

router = APIRouter()

class CreateSecretRequest(BaseModel):
    key: str = Field(..., min_length=2, max_length=64, description="Secret Key Name")
    value: str = Field(..., min_length=1, max_length=2048, description="Secret Key Value")

@router.get(
    "/{project_id}/secrets",
    response_model=List[Dict[str, Any]],
    summary="List project environment secrets",
)
async def list_secrets(
    project_id: uuid.UUID,
    _user: Annotated[User, Depends(require_role(Role.VIEWER))],
) -> List[Dict[str, Any]]:
    service = SecretsService(project_id)
    return await service.list_secrets()

@router.post(
    "/{project_id}/secrets",
    status_code=status.HTTP_201_CREATED,
    summary="Create or update an environment secret",
)
async def create_secret(
    project_id: uuid.UUID,
    payload: CreateSecretRequest,
    db: Annotated[AsyncSession, Depends(get_db_session)] = None,
    user: Annotated[User, Depends(require_role(Role.VIEWER))] = None,
) -> Dict[str, Any]:
    service = SecretsService(project_id)
    result = await service.create_secret(payload.key, payload.value)

    if db and user:
        audit_service = AuditLogService(db)
        await audit_service.log_activity(
            action="SECRET_CREATE",
            resource_type="secret",
            resource_id=payload.key.upper(),
            user_id=user.id,
            details={"project_id": str(project_id)},
        )

    return result

@router.delete(
    "/{project_id}/secrets/{secret_key}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete an environment secret",
)
async def delete_secret(
    project_id: uuid.UUID,
    secret_key: str,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    user: Annotated[User, Depends(require_role(Role.VIEWER))],
) -> None:
    service = SecretsService(project_id)
    deleted = await service.delete_secret(secret_key)
    if not deleted:
        raise HTTPException(status_code=404, detail=f"Secret '{secret_key}' not found")

    audit_service = AuditLogService(db)
    await audit_service.log_activity(
        action="SECRET_DELETE",
        resource_type="secret",
        resource_id=secret_key.upper(),
        user_id=user.id,
        details={"project_id": str(project_id)},
    )
