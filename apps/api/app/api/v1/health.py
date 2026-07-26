"""Health endpoint with database and Redis connectivity checks."""

import logging
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import text

from app.api.dependencies import get_app_settings
from app.core.database import async_session_factory
from app.core.redis import redis_pool
from app.core.settings import Settings
from app.schemas.health import ComponentHealth, HealthResponse

router = APIRouter()
logger = logging.getLogger(__name__)


async def _check_database() -> ComponentHealth:
    """Verify PostgreSQL connectivity by executing a lightweight query."""
    try:
        async with async_session_factory() as session:
            await session.execute(text("SELECT 1"))
        return ComponentHealth(status="healthy")
    except Exception as exc:
        logger.warning("Database health check failed: %s", exc)
        return ComponentHealth(status="unhealthy", message="Database unreachable")


async def _check_redis() -> ComponentHealth:
    """Verify Redis connectivity by issuing a PING command."""
    try:
        if redis_pool is None:
            return ComponentHealth(
                status="unhealthy", message="Redis pool not initialised"
            )
        pong = await redis_pool.ping()
        if pong:
            return ComponentHealth(status="healthy")
        return ComponentHealth(status="unhealthy", message="Redis PING failed")
    except Exception as exc:
        logger.warning("Redis health check failed: %s", exc)
        return ComponentHealth(status="unhealthy", message="Redis unreachable")


@router.get("", response_model=HealthResponse)
async def get_health(
    settings: Annotated[Settings, Depends(get_app_settings)],
) -> HealthResponse:
    db_health = await _check_database()
    redis_health = await _check_redis()

    components = {
        "database": db_health,
        "redis": redis_health,
    }

    # Overall status: healthy if all components are healthy, degraded if any
    # are unhealthy, unhealthy if all are unhealthy.
    unhealthy_count = sum(1 for c in components.values() if c.status == "unhealthy")
    if unhealthy_count == 0:
        overall_status = "healthy"
    elif unhealthy_count < len(components):
        overall_status = "degraded"
    else:
        overall_status = "unhealthy"

    return HealthResponse(
        status=overall_status,
        service=settings.project_name,
        version=settings.version,
        environment=settings.environment,
        components=components,
    )
