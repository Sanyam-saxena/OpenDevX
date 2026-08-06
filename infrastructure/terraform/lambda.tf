# =============================================================================
# OpenDevX — AWS Lambda Serverless Compute Execution Module
# =============================================================================

# IAM Execution Role for Lambda Function
resource "aws_iam_role" "lambda_exec" {
  name = "opendevx-lambda-exec-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

# Attach Basic Lambda Execution Policy
resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# AWS Lambda Serverless Worker Function
resource "aws_lambda_function" "serverless_worker" {
  filename      = "dummy_lambda.zip"
  function_name = "opendevx-serverless-worker-${var.environment}"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "index.handler"
  runtime       = "python3.12"
  timeout       = 30
  memory_size   = 256

  environment {
    variables = {
      ENVIRONMENT = var.environment
    }
  }

  tags = {
    Name        = "opendevx-serverless-worker-${var.environment}"
    Environment = var.environment
    Service     = "serverless"
  }
}
