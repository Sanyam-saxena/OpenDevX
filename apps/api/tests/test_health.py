"""Tests for the health endpoint.

The health endpoint now checks database and Redis connectivity. In test mode
without live infrastructure, these components report as unhealthy, so the
overall status is 'unhealthy' or 'degraded'. These tests verify the response
structure and behaviour without requiring Docker services.
"""

from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient

from app.main import create_app


@pytest.fixture()
def client() -> TestClient:
    return TestClient(create_app())


def test_health_endpoint_returns_expected_structure(client: TestClient) -> None:
    """Health endpoint always returns the expected JSON structure."""
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    body = response.json()
    assert "status" in body
    assert body["status"] in ("healthy", "degraded", "unhealthy")
    assert body["service"] == "OpenDevX API"
    assert body["version"] == "0.1.0"
    assert body["environment"] == "development"
    assert "components" in body
    assert "database" in body["components"]
    assert "redis" in body["components"]


def test_health_endpoint_reports_component_statuses(client: TestClient) -> None:
    """Each component has a status field."""
    response = client.get("/api/v1/health")
    body = response.json()

    for component_name in ("database", "redis"):
        component = body["components"][component_name]
        assert "status" in component
        assert component["status"] in ("healthy", "unhealthy")


def test_health_endpoint_healthy_when_all_components_ok() -> None:
    """When all infrastructure checks pass, overall status is 'healthy'."""
    with (
        patch(
            "app.api.v1.health._check_database",
            new_callable=AsyncMock,
        ) as mock_db,
        patch(
            "app.api.v1.health._check_redis",
            new_callable=AsyncMock,
        ) as mock_redis,
    ):
        from app.schemas.health import ComponentHealth

        mock_db.return_value = ComponentHealth(status="healthy")
        mock_redis.return_value = ComponentHealth(status="healthy")

        client = TestClient(create_app())
        response = client.get("/api/v1/health")

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "healthy"
    assert body["components"]["database"]["status"] == "healthy"
    assert body["components"]["redis"]["status"] == "healthy"


def test_health_endpoint_degraded_when_one_component_fails() -> None:
    """When one component fails, overall status is 'degraded'."""
    with (
        patch(
            "app.api.v1.health._check_database",
            new_callable=AsyncMock,
        ) as mock_db,
        patch(
            "app.api.v1.health._check_redis",
            new_callable=AsyncMock,
        ) as mock_redis,
    ):
        from app.schemas.health import ComponentHealth

        mock_db.return_value = ComponentHealth(status="healthy")
        mock_redis.return_value = ComponentHealth(
            status="unhealthy", message="Redis unreachable"
        )

        client = TestClient(create_app())
        response = client.get("/api/v1/health")

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "degraded"
