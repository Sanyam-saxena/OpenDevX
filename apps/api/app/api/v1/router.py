from fastapi import APIRouter

from app.api.v1.audit_logs import router as audit_logs_router
from app.api.v1.auth import router as auth_router
from app.api.v1.environments import router as environments_router
from app.api.v1.events import router as events_router
from app.api.v1.health import router as health_router
from app.api.v1.metrics import router as metrics_router
from app.api.v1.projects import router as projects_router
from app.api.v1.secrets import router as secrets_router
from app.api.v1.serverless import router as serverless_router
from app.api.v1.storage import router as storage_router
from app.api.v1.users import router as users_router

router = APIRouter()
router.include_router(health_router, prefix="/health", tags=["health"])
router.include_router(auth_router, prefix="/auth", tags=["auth"])
router.include_router(projects_router, prefix="/projects", tags=["projects"])
router.include_router(environments_router, prefix="/projects", tags=["environments"])
router.include_router(storage_router, prefix="/projects", tags=["storage"])
router.include_router(secrets_router, prefix="/projects", tags=["secrets"])
router.include_router(events_router, prefix="/projects", tags=["events"])
router.include_router(serverless_router, prefix="/projects", tags=["serverless"])
router.include_router(users_router, prefix="/users", tags=["users"])
router.include_router(audit_logs_router, prefix="/audit-logs", tags=["audit-logs"])
router.include_router(metrics_router, prefix="/metrics", tags=["metrics"])


