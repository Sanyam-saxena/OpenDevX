"""
Kubernetes API Endpoints.
"""

import uuid
from typing import Annotated, Any

from fastapi import APIRouter, Depends

from app.api.dependencies import require_role
from app.domain.roles import Role
from app.models.user import User
from app.services.k8s_service import K8sService

router = APIRouter()


@router.get(
    "/{project_id}/k8s/pods",
    response_model=list[dict[str, Any]],
    summary="List Kubernetes pods for project environment",
)
async def get_pods(
    project_id: uuid.UUID,
    _user: Annotated[User, Depends(require_role(Role.VIEWER))],
) -> list[dict[str, Any]]:
    service = K8sService(project_id)
    return await service.get_pods()


@router.get(
    "/{project_id}/k8s/pods/{pod_id}/logs",
    response_model=dict[str, Any],
    summary="Stream live container logs for a pod",
)
async def get_pod_logs(
    project_id: uuid.UUID,
    pod_id: str,
    _user: Annotated[User, Depends(require_role(Role.VIEWER))],
) -> dict[str, Any]:
    service = K8sService(project_id)
    return await service.get_pod_logs(pod_id)
