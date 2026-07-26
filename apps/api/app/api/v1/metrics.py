"""Prometheus metrics endpoint."""

from fastapi import APIRouter, Response

from app.core.metrics import get_metrics_response

router = APIRouter()


@router.get(
    "",
    summary="Scrape Prometheus operational metrics",
    include_in_schema=False,
)
def metrics() -> Response:
    """Expose application metrics formatted for Prometheus scraping."""
    return get_metrics_response()
