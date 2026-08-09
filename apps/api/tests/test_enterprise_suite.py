import uuid
from datetime import UTC, datetime

import pytest
from httpx import ASGITransport, AsyncClient

from app.api.dependencies import get_current_active_user
from app.domain.roles import Role
from app.main import create_app
from app.models.user import User


def get_test_admin_user() -> User:
    return User(
        id=uuid.uuid4(),
        email="admin@example.com",
        hashed_password="hashed_pwd",
        full_name="Admin User",
        role=Role.ADMIN,
        is_active=True,
        is_superuser=True,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )


@pytest.mark.anyio
async def test_dashboard_apis():
    app = create_app()
    app.dependency_overrides[get_current_active_user] = get_test_admin_user
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res1 = await ac.get("/api/v1/dashboard/services-health")
        assert res1.status_code == 200
        assert len(res1.json()) >= 6

        res2 = await ac.get("/api/v1/dashboard/kpis")
        assert res2.status_code == 200
        assert "cpu_avg" in res2.json()

        res3 = await ac.get("/api/v1/dashboard/traffic")
        assert res3.status_code == 200
        assert len(res3.json()) > 0

        res4 = await ac.get("/api/v1/dashboard/live-events")
        assert res4.status_code == 200

        res5 = await ac.get("/api/v1/dashboard/last-deployment")
        assert res5.status_code == 200
        assert res5.json()["status"] == "SUCCESS"


@pytest.mark.anyio
async def test_pipeline_dag_api():
    app = create_app()
    app.dependency_overrides[get_current_active_user] = get_test_admin_user
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        pid = uuid.uuid4()
        res = await ac.get(f"/api/v1/projects/{pid}/pipeline/dag")
        assert res.status_code == 200
        assert len(res.json()["stages"]) == 5


@pytest.mark.anyio
async def test_k8s_pods_api():
    app = create_app()
    app.dependency_overrides[get_current_active_user] = get_test_admin_user
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        pid = uuid.uuid4()
        res = await ac.get(f"/api/v1/projects/{pid}/k8s/pods")
        assert res.status_code == 200
        assert len(res.json()) == 3

        pod_id = res.json()[0]["pod_id"]
        res_logs = await ac.get(f"/api/v1/projects/{pid}/k8s/pods/{pod_id}/logs")
        assert res_logs.status_code == 200
        assert "logs" in res_logs.json()


@pytest.mark.anyio
async def test_finops_cost_api():
    app = create_app()
    app.dependency_overrides[get_current_active_user] = get_test_admin_user
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        pid = uuid.uuid4()
        res = await ac.get(f"/api/v1/projects/{pid}/finops/cost-summary")
        assert res.status_code == 200
        assert res.json()["cost_mtd"] == 262.50


@pytest.mark.anyio
async def test_ai_rca_and_copilot_api():
    app = create_app()
    app.dependency_overrides[get_current_active_user] = get_test_admin_user
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        pid = uuid.uuid4()
        res = await ac.post(
            f"/api/v1/projects/{pid}/ai/rca",
            json={"error_log": "connection pool timeout"},
        )
        assert res.status_code == 200
        assert res.json()["severity"] == "HIGH"

        res_chat = await ac.post(
            "/api/v1/projects/ai/copilot/chat",
            json={"query": "how to save cloud cost?"},
        )
        assert res_chat.status_code == 200
        assert "Graviton3" in res_chat.json()["reply"]
