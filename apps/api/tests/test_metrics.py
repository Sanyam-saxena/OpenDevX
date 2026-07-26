"""Tests for Prometheus metrics endpoint and middleware."""

from fastapi.testclient import TestClient

from app.main import create_app


def test_metrics_endpoint_returns_prometheus_format() -> None:
    """Verify /api/v1/metrics returns Prometheus metrics exposition format."""
    client = TestClient(create_app())
    # Send a request to trigger metrics collection
    client.get("/api/v1/health")

    response = client.get("/api/v1/metrics")
    assert response.status_code == 200
    assert "text/plain" in response.headers["content-type"]
    assert "opendevx_http_requests_total" in response.text
    assert "opendevx_http_request_duration_seconds" in response.text
