# =============================================================================
# OpenDevX — Amazon RDS PostgreSQL Database Module
# =============================================================================

# DB Subnet Group (Private Subnets across multiple AZs)
resource "aws_db_subnet_group" "rds" {
  name        = "opendevx-rds-subnet-group-${var.environment}"
  subnet_ids  = aws_subnet.private[*].id
  description = "DB subnet group for OpenDevX PostgreSQL"

  tags = {
    Name = "opendevx-rds-subnet-group-${var.environment}"
  }
}

# Security Group for RDS Instance
resource "aws_security_group" "rds" {
  name        = "opendevx-rds-sg-${var.environment}"
  description = "Security group for OpenDevX PostgreSQL RDS instance"
  vpc_id      = aws_vpc.opendevx_vpc.id

  ingress {
    description = "Allow PostgreSQL access from inside the VPC"
    from_port   = 5432
    to_port     = 5432
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
    Name = "opendevx-rds-sg-${var.environment}"
  }
}

# Random password generation for DB master password
resource "random_password" "db_password" {
  length  = 24
  special = false
}

# RDS PostgreSQL Instance
resource "aws_db_instance" "postgres" {
  identifier             = "opendevx-postgres-${var.environment}"
  engine                 = "postgres"
  engine_version         = "16.1"
  instance_class         = var.db_instance_class
  allocated_storage      = var.db_allocated_storage
  max_allocated_storage  = 100
  storage_type           = "gp3"
  storage_encrypted      = true

  db_name  = var.db_name
  username = var.db_username
  password = random_password.db_password.result

  db_subnet_group_name   = aws_db_subnet_group.rds.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  multi_az                = var.environment == "production" ? true : false
  skip_final_snapshot     = var.environment != "production"
  backup_retention_period = 7
  deletion_protection     = var.environment == "production"

  tags = {
    Name = "opendevx-postgres-${var.environment}"
  }
}
