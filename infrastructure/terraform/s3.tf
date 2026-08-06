# =============================================================================
# OpenDevX — Amazon S3 Cloud Object Storage Module
# =============================================================================

# S3 Bucket for Project Build Artifacts and Static Assets
resource "aws_s3_bucket" "artifacts" {
  bucket        = "opendevx-artifacts-${var.environment}-${data.aws_caller_identity.current.account_id}"
  force_destroy = var.environment != "production"

  tags = {
    Name        = "opendevx-artifacts-${var.environment}"
    Environment = var.environment
    Service     = "storage"
  }
}

# Bucket Server-Side Encryption (KMS / AES256)
resource "aws_s3_bucket_server_side_encryption_configuration" "artifacts" {
  bucket = aws_s3_bucket.artifacts.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Block Public Access (Zero-Trust Security)
resource "aws_s3_bucket_public_access_block" "artifacts" {
  bucket = aws_s3_bucket.artifacts.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Lifecycle Expiration Policy for Stale Build Artifacts
resource "aws_s3_bucket_lifecycle_configuration" "artifacts" {
  bucket = aws_s3_bucket.artifacts.id

  rule {
    id     = "expire-old-artifacts"
    status = "Enabled"

    expiration {
      days = 90
    }
  }
}
