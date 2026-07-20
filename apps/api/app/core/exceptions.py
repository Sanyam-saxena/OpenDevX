import logging

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


def error_response(status_code: int, error_type: str, message: str) -> JSONResponse:
    """Build the standard API error response."""
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "error": {"type": error_type, "message": message},
        },
    )


async def http_exception_handler(
    _request: Request, exception: HTTPException
) -> JSONResponse:
    """Handle expected HTTP exceptions with a stable response body."""
    message = (
        exception.detail if isinstance(exception.detail, str) else "Request failed"
    )
    return error_response(exception.status_code, "http_error", message)


async def validation_exception_handler(
    _request: Request, _exception: RequestValidationError
) -> JSONResponse:
    """Handle request validation failures with a stable response body."""
    return error_response(422, "validation_error", "Request validation failed")


async def unhandled_exception_handler(
    _request: Request, exception: Exception
) -> JSONResponse:
    """Handle unexpected exceptions without exposing internal details."""
    logging.getLogger(__name__).exception(
        "Unhandled application exception", exc_info=exception
    )
    return error_response(500, "internal_server_error", "An unexpected error occurred")


def register_exception_handlers(application: FastAPI) -> None:
    """Register global API exception handlers."""
    application.add_exception_handler(HTTPException, http_exception_handler)
    application.add_exception_handler(
        RequestValidationError, validation_exception_handler
    )
    application.add_exception_handler(Exception, unhandled_exception_handler)
