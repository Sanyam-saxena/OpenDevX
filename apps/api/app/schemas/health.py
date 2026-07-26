"""Response schemas for the health endpoint."""

from typing import Literal

from pydantic import BaseModel


class ComponentHealth(BaseModel):
    """Health status for an individual infrastructure component."""

    status: Literal["healthy", "unhealthy"]
    message: str | None = None


class HealthResponse(BaseModel):
    """Response returned by the versioned health endpoint."""

    status: Literal["healthy", "degraded", "unhealthy"]
    service: str
    version: str
    environment: str
    components: dict[str, ComponentHealth] = {}
