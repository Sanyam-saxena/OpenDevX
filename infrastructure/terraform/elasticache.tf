# =============================================================================
# OpenDevX — Amazon ElastiCache Redis Module
# =============================================================================

# ElastiCache Subnet Group
resource "aws_elasticache_subnet_group" "redis" {
  name       = "opendevx-redis-subnet-group-${var.environment}"
  subnet_ids = aws_subnet.private[*].id
}

# Security Group for Redis
resource "aws_security_group" "redis" {
  name        = "opendevx-redis-sg-${var.environment}"
  description = "Security group for OpenDevX Redis ElastiCache cluster"
  vpc_id      = aws_vpc.opendevx_vpc.id

  ingress {
    description = "Allow Redis traffic from inside the VPC"
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "opendevx-redis-sg-${var.environment}"
  }
}

# ElastiCache Replication Group
resource "aws_elasticache_replication_group" "redis" {
  replication_group_id = "opendevx-redis-${var.environment}"
  description          = "OpenDevX Redis replication group for caching"
  node_type            = var.redis_node_type
  num_cache_clusters   = 1
  port                 = 6379
  parameter_group_name = "default.redis7"

  subnet_group_name  = aws_elasticache_subnet_group.redis.name
  security_group_ids = [aws_security_group.redis.id]

  at_rest_encryption_enabled = true
  transit_encryption_enabled = false

  tags = {
    Name = "opendevx-redis-${var.environment}"
  }
}
