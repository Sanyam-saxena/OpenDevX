# =============================================================================
# OpenDevX — Main Terraform Configuration
# =============================================================================
# Provisions cloud infrastructure on AWS for OpenDevX Platform:
# - VPC with Public/Private Subnets across multi-AZ
# - Amazon EKS Cluster with Managed Node Groups
# - Amazon RDS PostgreSQL Database Instance (Multi-AZ)
# - Amazon ElastiCache Redis Cluster
# =============================================================================

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.30"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }

  # Remote backend configuration (uncomment for production deployment)
  # backend "s3" {
  #   bucket         = "opendevx-terraform-state-prod"
  #   key            = "platform/terraform.tfstate"
  #   region         = "us-east-1"
  #   dynamodb_table = "opendevx-terraform-locks"
  #   encrypt        = true
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "OpenDevX"
      Environment = var.environment
      ManagedBy   = "Terraform"
      Repository  = "https://github.com/Sanyam-saxena/OpenDevX"
    }
  }
}

# Data source for available AWS availability zones in the chosen region
data "aws_availability_zones" "available" {
  state = "available"
}

# Data source for current AWS caller identity
data "aws_caller_identity" "current" {}
