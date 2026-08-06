# =============================================================================
# OpenDevX — Terraform Outputs Definition
# =============================================================================

output "vpc_id" {
  description = "ID of the provisioned VPC"
  value       = aws_vpc.opendevx_vpc.id
}

output "public_subnet_ids" {
  description = "List of IDs of public subnets"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "List of IDs of private subnets"
  value       = aws_subnet.private[*].id
}

output "eks_cluster_id" {
  description = "Name/ID of the EKS Cluster"
  value       = aws_eks_cluster.opendevx.id
}

output "eks_cluster_endpoint" {
  description = "API Endpoint for the EKS Cluster"
  value       = aws_eks_cluster.opendevx.endpoint
}

output "eks_cluster_certificate_authority_data" {
  description = "Nested attribute containing certificate-authority-data for EKS cluster"
  value       = aws_eks_cluster.opendevx.certificate_authority[0].data
  sensitive   = true
}

output "rds_endpoint" {
  description = "Connection endpoint for the RDS PostgreSQL database"
  value       = aws_db_instance.postgres.endpoint
}

output "rds_database_name" {
  description = "Name of the primary database"
  value       = aws_db_instance.postgres.db_name
}

output "redis_endpoint" {
  description = "Primary endpoint of the ElastiCache Redis replication group"
  value       = aws_elasticache_replication_group.redis.primary_endpoint_address
}
