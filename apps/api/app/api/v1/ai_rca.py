"""
AI Root Cause Analysis & Copilot API Endpoints.
"""

import uuid
from typing import Annotated, Dict, Any
from pydantic import BaseModel
from fastapi import APIRouter, Depends

from app.api.dependencies import require_role
from app.domain.roles import Role
from app.models.user import User
from app.services.ai_rca_service import AiRcaService

router = APIRouter()

class RcaRequest(BaseModel):
    error_log: str = "ERROR: asyncpg.exceptions.TooManyConnectionsError: max connections exceeded"

class CopilotQueryRequest(BaseModel):
    query: str

@router.post(
    "/{project_id}/ai/rca",
    response_model=Dict[str, Any],
    summary="Perform AI Root Cause Analysis on error logs",
)
async def analyze_failure(
    project_id: uuid.UUID,
    payload: RcaRequest,
    _user: Annotated[User, Depends(require_role(Role.VIEWER))],
) -> Dict[str, Any]:
    service = AiRcaService(project_id)
    return await service.analyze_failure(payload.error_log)

@router.post(
    "/ai/copilot/chat",
    response_model=Dict[str, Any],
    summary="Chat with OpenDevX AI DevOps Copilot assistant",
)
async def copilot_chat(
    payload: CopilotQueryRequest,
    _user: Annotated[User, Depends(require_role(Role.VIEWER))],
) -> Dict[str, Any]:
    service = AiRcaService()
    return await service.copilot_chat(payload.query)
