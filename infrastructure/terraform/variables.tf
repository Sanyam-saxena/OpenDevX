# =============================================================================
# OpenDevX — Terraform Variables Definition
# =============================================================================

variable "aws_region" {
  description = "AWS region to deploy OpenDevX infrastructure"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment name (e.g., dev, staging, prod)"
  type        = string
  default     = "production"
}

variable "vpc_cidr" {
  description = "CIDR block for the OpenDevX VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "eks_cluster_name" {
  description = "Name of the Amazon EKS cluster"
  type        = string
  default     = "opendevx-eks-cluster"
}

variable "eks_node_instance_types" {
  description = "EC2 instance types for EKS managed node group"
  type        = list(string)
  default     = ["t3.medium", "t3a.medium"]
}

variable "eks_node_desired_capacity" {
  description = "Desired number of worker nodes"
  type        = number
  default     = 3
}

variable "eks_node_min_capacity" {
  description = "Minimum number of worker nodes"
  type        = number
  default     = 2
}

variable "eks_node_max_capacity" {
  description = "Maximum number of worker nodes for autoscaling"
  type        = number
  default     = 6
}

variable "db_name" {
  description = "Name of the PostgreSQL database"
  type        = string
  default     = "opendevx_db"
}

variable "db_username" {
  description = "Master username for RDS PostgreSQL instance"
  type        = string
  default     = "opendevx_admin"
}

variable "db_allocated_storage" {
  description = "Allocated storage for RDS instance in GB"
  type        = number
  default     = 20
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t4g.micro"
}

variable "redis_node_type" {
  description = "ElastiCache Redis node type"
  type        = string
  default     = "cache.t4g.micro"
}
