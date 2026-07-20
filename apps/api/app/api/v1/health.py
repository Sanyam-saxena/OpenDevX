from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.dependencies import get_app_settings
from app.core.settings import Settings
from app.schemas.health import HealthResponse

router = APIRouter()


@router.get("", response_model=HealthResponse)
def get_health(
    settings: Annotated[Settings, Depends(get_app_settings)],
) -> HealthResponse:
    return HealthResponse(
        status="healthy",
        service=settings.project_name,
        version=settings.version,
        environment=settings.environment,
    )
