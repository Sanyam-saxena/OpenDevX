"""
FinOps Cost Estimator API Endpoints.
"""

import uuid
from typing import Annotated, Any

from fastapi import APIRouter, Depends

from app.api.dependencies import require_role
from app.domain.roles import Role
from app.models.user import User
from app.services.finops_service import FinOpsService

router = APIRouter()


@router.get(
    "/{project_id}/finops/cost-summary",
    response_model=dict[str, Any],
    summary="Get monthly cloud infrastructure cost breakdown and savings advisor",
)
async def get_cost_summary(
    project_id: uuid.UUID,
    _user: Annotated[User, Depends(require_role(Role.VIEWER))],
) -> dict[str, Any]:
    service = FinOpsService(project_id)
    return await service.get_cost_summary()
