# =============================================================================
# OpenDevX — AWS EKS Managed Kubernetes Cluster Module
# =============================================================================

# IAM Role for EKS Cluster Control Plane
resource "aws_iam_role" "eks_cluster" {
  name = "opendevx-eks-cluster-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "eks.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "eks_cluster_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.eks_cluster.name
}

# AWS EKS Kubernetes Control Plane
resource "aws_eks_cluster" "main" {
  name     = "opendevx-cluster-${var.environment}"
  role_arn = aws_iam_role.eks_cluster.arn
  version  = "1.30"

  vpc_config {
    subnet_ids = [
      "subnet-0123456789abcdef0",
      "subnet-0123456789abcdef1"
    ]
    endpoint_private_access = true
    endpoint_public_access  = true
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy
  ]

  tags = {
    Name        = "opendevx-eks-${var.environment}"
    Environment = var.environment
    Service     = "kubernetes"
  }
}

# IAM Role for EKS Worker Node Group
resource "aws_iam_role" "eks_nodes" {
  name = "opendevx-eks-node-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "eks_worker_node" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.eks_nodes.name
}

resource "aws_iam_role_policy_attachment" "eks_cni" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.eks_nodes.name
}

resource "aws_iam_role_policy_attachment" "eks_container_registry" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.eks_nodes.name
}

# Managed Node Group
resource "aws_eks_node_group" "main_nodes" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "opendevx-nodes-${var.environment}"
  node_role_arn   = aws_iam_role.eks_nodes.arn
  subnet_ids      = ["subnet-0123456789abcdef0", "subnet-0123456789abcdef1"]
  instance_types  = ["t3.medium"]

  scaling_config {
    desired_size = 2
    max_size     = 5
    min_size     = 1
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_worker_node,
    aws_iam_role_policy_attachment.eks_cni,
    aws_iam_role_policy_attachment.eks_container_registry
  ]

  tags = {
    Name        = "opendevx-eks-nodegroup-${var.environment}"
    Environment = var.environment
  }
}
