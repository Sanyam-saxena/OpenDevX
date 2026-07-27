from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import router as api_router
from app.core.database import engine
from app.core.exceptions import register_exception_handlers
from app.core.logging import configure_logging, get_logger
from app.core.metrics import PrometheusMiddleware
from app.core.middleware import RequestIDMiddleware, SecurityHeadersMiddleware
from app.core.redis import close_redis, init_redis
from app.core.settings import get_settings


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    logger = get_logger(__name__)
    logger.info("Starting OpenDevX API")

    # Initialise infrastructure connections
    logger.info("Connecting to Redis")
    await init_redis()
    logger.info("Redis connected")

    # SQLAlchemy engine is created at module import; verify connectivity
    logger.info("Database engine ready (pool_pre_ping enabled)")

    yield

    # Shutdown: release infrastructure connections
    logger.info("Closing Redis connection pool")
    await close_redis()

    logger.info("Disposing database engine")
    await engine.dispose()

    logger.info("OpenDevX API shut down")


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

    # Middleware execution pipeline (outer to inner)
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    application.add_middleware(SecurityHeadersMiddleware)
    application.add_middleware(RequestIDMiddleware)
    application.add_middleware(PrometheusMiddleware)

    application.include_router(api_router, prefix=settings.api_v1_prefix)
    register_exception_handlers(application)

    return application


app = create_app()
