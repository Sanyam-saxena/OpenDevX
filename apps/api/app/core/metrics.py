"""Prometheus metrics instrumentation for OpenDevX API."""

import time
from collections.abc import Awaitable, Callable

from fastapi import Request, Response
from prometheus_client import CONTENT_TYPE_LATEST, Counter, Histogram, generate_latest
from starlette.middleware.base import BaseHTTPMiddleware

HTTP_REQUESTS_TOTAL = Counter(
    "opendevx_http_requests_total",
    "Total count of HTTP requests processed",
    ["method", "endpoint", "status_code"],
)

HTTP_REQUEST_DURATION_SECONDS = Histogram(
    "opendevx_http_request_duration_seconds",
    "HTTP request processing latency in seconds",
    ["method", "endpoint"],
)


class PrometheusMiddleware(BaseHTTPMiddleware):
    """Middleware collecting Prometheus metrics for HTTP traffic."""

    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        start_time = time.perf_counter()
        response = await call_next(request)
        process_time = time.perf_counter() - start_time

        method = request.method
        endpoint = request.url.path

        HTTP_REQUESTS_TOTAL.labels(
            method=method,
            endpoint=endpoint,
            status_code=response.status_code,
        ).inc()

        HTTP_REQUEST_DURATION_SECONDS.labels(
            method=method,
            endpoint=endpoint,
        ).observe(process_time)

        return response


def get_metrics_response() -> Response:
    """Generate latest Prometheus metrics text response."""
    return Response(
        content=generate_latest(),
        media_type=CONTENT_TYPE_LATEST,
    )
