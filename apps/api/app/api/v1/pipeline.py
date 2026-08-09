"""
CI/CD Pipeline API Endpoints.
"""

import uuid
from typing import Annotated, Any

from fastapi import APIRouter, Depends, status

from app.api.dependencies import require_role
from app.domain.roles import Role
from app.models.user import User
from app.services.pipeline_service import PipelineService

router = APIRouter()


@router.get(
    "/{project_id}/pipeline/dag",
    response_model=dict[str, Any],
    summary="Get project CI/CD pipeline DAG graph",
)
async def get_pipeline_dag(
    project_id: uuid.UUID,
    _user: Annotated[User, Depends(require_role(Role.VIEWER))],
) -> dict[str, Any]:
    service = PipelineService(project_id)
    return await service.get_pipeline_dag()


@router.post(
    "/{project_id}/pipeline/trigger",
    status_code=status.HTTP_202_ACCEPTED,
    summary="Trigger new CI/CD pipeline run",
)
async def trigger_pipeline(
    project_id: uuid.UUID,
    _user: Annotated[User, Depends(require_role(Role.VIEWER))],
) -> dict[str, Any]:
    service = PipelineService(project_id)
    return await service.trigger_pipeline()
