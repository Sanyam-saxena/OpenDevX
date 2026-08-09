"""
AWS SQS Event Queue & Webhook API Endpoints.
"""

import uuid
from typing import Annotated, Any

from fastapi import APIRouter, Depends, status
from pydantic import BaseModel

from app.api.dependencies import require_role
from app.domain.roles import Role
from app.models.user import User
from app.services.event_bus import EventBusService

router = APIRouter()


class DispatchEventRequest(BaseModel):
    event_type: str = "TEST_WEBHOOK_DISPATCH"
    payload: dict[str, Any] = {
        "triggered_by": "OpenDevX Dashboard",
        "channel": "slack_webhook",
    }


@router.get(
    "/{project_id}/events",
    response_model=list[dict[str, Any]],
    summary="List async event message queue stream",
)
async def list_events(
    project_id: uuid.UUID,
    _user: Annotated[User, Depends(require_role(Role.VIEWER))],
) -> list[dict[str, Any]]:
    service = EventBusService(project_id)
    return await service.list_events()


@router.post(
    "/{project_id}/events/dispatch",
    status_code=status.HTTP_201_CREATED,
    summary="Dispatch message event to AWS SQS queue",
)
async def dispatch_event(
    project_id: uuid.UUID,
    payload: DispatchEventRequest,
    _user: Annotated[User, Depends(require_role(Role.VIEWER))],
) -> dict[str, Any]:
    service = EventBusService(project_id)
    return await service.dispatch_webhook_event(payload.event_type, payload.payload)
