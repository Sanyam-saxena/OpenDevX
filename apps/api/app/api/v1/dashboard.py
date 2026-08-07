"""
Dashboard & Control Plane API Endpoints.
"""

from typing import Annotated, Dict, Any, List
from fastapi import APIRouter, Depends

from app.api.dependencies import require_role
from app.domain.roles import Role
from app.models.user import User
from app.services.dashboard_service import DashboardService

router = APIRouter()

@router.get("/services-health", response_model=List[Dict[str, Any]])
async def get_services_health(
    _user: Annotated[User, Depends(require_role(Role.VIEWER))],
) -> List[Dict[str, Any]]:
    return DashboardService.get_services_health()

@router.get("/kpis", response_model=Dict[str, Any])
async def get_kpis(
    _user: Annotated[User, Depends(require_role(Role.VIEWER))],
) -> Dict[str, Any]:
    return DashboardService.get_kpi_metrics()

@router.get("/traffic", response_model=List[Dict[str, Any]])
async def get_traffic(
    _user: Annotated[User, Depends(require_role(Role.VIEWER))],
) -> List[Dict[str, Any]]:
    return DashboardService.get_traffic_data()

@router.get("/live-events", response_model=List[Dict[str, Any]])
async def get_live_events(
    _user: Annotated[User, Depends(require_role(Role.VIEWER))],
) -> List[Dict[str, Any]]:
    return DashboardService.get_live_events()

@router.get("/last-deployment", response_model=Dict[str, Any])
async def get_last_deployment(
    _user: Annotated[User, Depends(require_role(Role.VIEWER))],
) -> Dict[str, Any]:
    return DashboardService.get_last_deployment()
