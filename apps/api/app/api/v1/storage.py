"""
Cloud Object Storage API endpoints for managing project artifacts.
"""

import uuid
from typing import Annotated, List, Dict, Any

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_db_session, require_role
from app.domain.roles import Role
from app.models.user import User
from app.services.audit_log_service import AuditLogService
from app.services.storage_service import StorageService

router = APIRouter()


@router.get(
    "/{project_id}/storage/files",
    response_model=List[Dict[str, Any]],
    summary="List project storage files and build artifacts",
)
async def list_storage_files(
    project_id: uuid.UUID,
    _user: Annotated[User, Depends(require_role(Role.VIEWER))],
) -> List[Dict[str, Any]]:
    """Fetch all stored artifacts in Cloud Object Storage for a project."""
    service = StorageService(project_id)
    return await service.list_files()


@router.post(
    "/{project_id}/storage/upload",
    status_code=status.HTTP_201_CREATED,
    summary="Upload a build artifact to Cloud Object Storage",
)
async def upload_storage_file(
    project_id: uuid.UUID,
    file: UploadFile = File(...),
    db: Annotated[AsyncSession, Depends(get_db_session)] = None,
    user: Annotated[User, Depends(require_role(Role.VIEWER))] = None,
) -> Dict[str, Any]:
    """Upload a file to Cloud Storage (Amazon S3 / GCS bucket)."""
    service = StorageService(project_id)
    result = await service.upload_file(file)

    if db and user:
        audit_service = AuditLogService(db)
        await audit_service.log_activity(
            action="STORAGE_UPLOAD",
            resource_type="artifact",
            resource_id=result["filename"],
            user_id=user.id,
            details={"project_id": str(project_id), "size": result["size"]},
        )

    return result


@router.delete(
    "/{project_id}/storage/files/{filename}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a build artifact from Cloud Object Storage",
)
async def delete_storage_file(
    project_id: uuid.UUID,
    filename: str,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    user: Annotated[User, Depends(require_role(Role.VIEWER))],
) -> None:
    """Delete a stored file from Cloud Object Storage."""
    service = StorageService(project_id)
    deleted = await service.delete_file(filename)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"File '{filename}' not found in storage",
        )

    audit_service = AuditLogService(db)
    await audit_service.log_activity(
        action="STORAGE_DELETE",
        resource_type="artifact",
        resource_id=filename,
        user_id=user.id,
        details={"project_id": str(project_id)},
    )
