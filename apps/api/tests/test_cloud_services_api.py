import uuid
from datetime import UTC, datetime
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import create_app
from app.domain.roles import Role
from app.models.user import User
from app.api.dependencies import get_current_active_user

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
async def test_secrets_manager_api():
    app = create_app()
    app.dependency_overrides[get_current_active_user] = get_test_admin_user
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        project_id = uuid.uuid4()
        
        # List default secrets
        res = await ac.get(f"/api/v1/projects/{project_id}/secrets")
        assert res.status_code == 200
        assert isinstance(res.json(), list)

        # Create secret
        create_res = await ac.post(
            f"/api/v1/projects/{project_id}/secrets",
            json={"key": "STRIPE_API_KEY", "value": "sk_live_9876543210abcdef"},
        )
        assert create_res.status_code == 201
        assert create_res.json()["key"] == "STRIPE_API_KEY"

        # Delete secret
        del_res = await ac.delete(f"/api/v1/projects/{project_id}/secrets/STRIPE_API_KEY")
        assert del_res.status_code == 204

@pytest.mark.anyio
async def test_sqs_event_bus_api():
    app = create_app()
    app.dependency_overrides[get_current_active_user] = get_test_admin_user
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        project_id = uuid.uuid4()
        
        # List events
        res = await ac.get(f"/api/v1/projects/{project_id}/events")
        assert res.status_code == 200
        assert isinstance(res.json(), list)

        # Dispatch event
        dispatch_res = await ac.post(
            f"/api/v1/projects/{project_id}/events/dispatch",
            json={"event_type": "DEPLOYMENT_TRIGGERED", "payload": {"target": "production"}},
        )
        assert dispatch_res.status_code == 201
        assert dispatch_res.json()["event_type"] == "DEPLOYMENT_TRIGGERED"

@pytest.mark.anyio
async def test_serverless_lambda_api():
    app = create_app()
    app.dependency_overrides[get_current_active_user] = get_test_admin_user
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        project_id = uuid.uuid4()

        # List functions
        res = await ac.get(f"/api/v1/projects/{project_id}/serverless/functions")
        assert res.status_code == 200
        assert isinstance(res.json(), list)

        # Invoke function
        invoke_res = await ac.post(
            f"/api/v1/projects/{project_id}/serverless/invoke",
            json={"function_name": "opendevx-db-migration"},
        )
        assert invoke_res.status_code == 200
        assert invoke_res.json()["status"] == "SUCCESS"
