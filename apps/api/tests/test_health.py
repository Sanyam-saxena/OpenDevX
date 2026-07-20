from fastapi.testclient import TestClient

from app.main import create_app


def test_health_endpoint_returns_service_metadata() -> None:
    with TestClient(create_app()) as client:
        response = client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "healthy",
        "service": "OpenDevX API",
        "version": "0.1.0",
        "environment": "development",
    }
