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
    "/{project_id}/ai/rca/apply-fix",
    response_model=Dict[str, Any],
    summary="Apply automated one-click fix for project RCA",
)
async def apply_fix(
    project_id: uuid.UUID,
    _user: Annotated[User, Depends(require_role(Role.VIEWER))],
) -> Dict[str, Any]:
    AiRcaService.apply_fix(str(project_id))
    return {"status": "success", "message": "One-click fix applied successfully."}

@router.post(
    "/{project_id}/ai/rca/reset",
    response_model=Dict[str, Any],
    summary="Reset project RCA state for incident re-testing",
)
async def reset_fix(
    project_id: uuid.UUID,
    _user: Annotated[User, Depends(require_role(Role.VIEWER))],
) -> Dict[str, Any]:
    AiRcaService.reset_fix(str(project_id))
    return {"status": "success", "message": "RCA state reset."}

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
