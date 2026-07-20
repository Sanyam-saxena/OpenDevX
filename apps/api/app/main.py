from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.router import router as api_router
from app.core.exceptions import register_exception_handlers
from app.core.logging import configure_logging, get_logger
from app.core.settings import get_settings


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    logger = get_logger(__name__)
    logger.info("Starting OpenDevX API")
    yield
    logger.info("Shutting down OpenDevX API")


def create_app() -> FastAPI:
    settings = get_settings()
    configure_logging(settings)

    application = FastAPI(
        title=settings.project_name,
        version=settings.version,
        description="OpenDevX Internal Developer Platform API.",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )
    application.include_router(api_router, prefix=settings.api_v1_prefix)
    register_exception_handlers(application)

    return application


app = create_app()
