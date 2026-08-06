"""
Secrets Management Service for OpenDevX (AWS Secrets Manager / Vault abstraction).
Stores and manages encrypted environment secrets per project.
"""

import uuid
import time
from typing import Dict, List, Any

class SecretsService:
    """Service handling encrypted environment secret key-values for projects."""

    # In-memory mock vault store for dev mode
    _secrets_store: Dict[str, Dict[str, Dict[str, Any]]] = {}

    def __init__(self, project_id: uuid.UUID):
        self.project_id = str(project_id)
        if self.project_id not in SecretsService._secrets_store:
            # Seed default secrets for demo
            SecretsService._secrets_store[self.project_id] = {
                "DATABASE_URL": {
                    "key": "DATABASE_URL",
                    "value": "postgresql://admin:SecretPass2026!@rds.aws.internal:5432/production_db",
                    "provider": "AWS Secrets Manager (kms/aws/secretsmanager)",
                    "updated_at": int(time.time()) - 3600,
                },
                "REDIS_AUTH_TOKEN": {
                    "key": "REDIS_AUTH_TOKEN",
                    "value": "authToken_opendevx_elasticache_984712",
                    "provider": "AWS Secrets Manager (kms/aws/secretsmanager)",
                    "updated_at": int(time.time()) - 7200,
                },
            }

    async def list_secrets(self) -> List[Dict[str, Any]]:
        """List all project secrets with masked values."""
        project_secrets = SecretsService._secrets_store.get(self.project_id, {})
        result = []
        for secret_data in project_secrets.values():
            val = secret_data["value"]
            masked_val = val[:4] + "•" * max(6, len(val) - 4)
            result.append({
                "key": secret_data["key"],
                "masked_value": masked_val,
                "provider": secret_data["provider"],
                "updated_at": secret_data["updated_at"],
            })
        return result

    async def create_secret(self, key: str, value: str) -> Dict[str, Any]:
        """Create or update an environment secret in AWS Secrets Manager."""
        if self.project_id not in SecretsService._secrets_store:
            SecretsService._secrets_store[self.project_id] = {}

        secret_entry = {
            "key": key.upper(),
            "value": value,
            "provider": "AWS Secrets Manager (kms/aws/secretsmanager)",
            "updated_at": int(time.time()),
        }
        SecretsService._secrets_store[self.project_id][key.upper()] = secret_entry

        masked_val = value[:4] + "•" * max(6, len(value) - 4)
        return {
            "key": key.upper(),
            "masked_value": masked_val,
            "provider": secret_entry["provider"],
            "updated_at": secret_entry["updated_at"],
        }

    async def delete_secret(self, key: str) -> bool:
        """Delete an environment secret."""
        key_upper = key.upper()
        if self.project_id in SecretsService._secrets_store and key_upper in SecretsService._secrets_store[self.project_id]:
            del SecretsService._secrets_store[self.project_id][key_upper]
            return True
        return False
