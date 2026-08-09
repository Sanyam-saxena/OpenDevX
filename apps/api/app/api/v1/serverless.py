"""
AWS Lambda Serverless Compute API Endpoints.
"""

import uuid
from typing import Annotated, Any

from fastapi import APIRouter, Depends, status
from pydantic import BaseModel

from app.api.dependencies import require_role
from app.domain.roles import Role
from app.models.user import User
from app.services.serverless_service import ServerlessService

router = APIRouter()


class InvokeFunctionRequest(BaseModel):
    function_name: str = "opendevx-db-migration"


@router.get(
    "/{project_id}/serverless/functions",
    response_model=list[dict[str, Any]],
    summary="List serverless function execution history",
)
async def list_serverless_functions(
    project_id: uuid.UUID,
    _user: Annotated[User, Depends(require_role(Role.VIEWER))],
) -> list[dict[str, Any]]:
    service = ServerlessService(project_id)
    return await service.list_executions()


@router.post(
    "/{project_id}/serverless/invoke",
    status_code=status.HTTP_200_OK,
    summary="Invoke on-demand serverless function",
)
async def invoke_serverless_function(
    project_id: uuid.UUID,
    payload: InvokeFunctionRequest,
    _user: Annotated[User, Depends(require_role(Role.VIEWER))],
) -> dict[str, Any]:
    service = ServerlessService(project_id)
    return await service.invoke_function(payload.function_name)
