# =============================================================================
# OpenDevX — AWS Secrets Manager & KMS Secret Store Module
# =============================================================================

# KMS Customer Managed Key (CMK) for Secrets Encryption
resource "aws_kms_key" "secrets" {
  description             = "KMS Key for OpenDevX Secrets Manager encryption"
  deletion_window_in_days = 30
  enable_key_rotation     = true

  tags = {
    Name        = "opendevx-secrets-kms-${var.environment}"
    Environment = var.environment
  }
}

# AWS Secrets Manager Secret Container
resource "aws_secretsmanager_secret" "project_secrets" {
  name                    = "opendevx/secrets/${var.environment}"
  kms_key_id              = aws_kms_key.secrets.id
  recovery_window_in_days = 7

  tags = {
    Name        = "opendevx-secrets-${var.environment}"
    Environment = var.environment
    Service     = "secrets-manager"
  }
}
