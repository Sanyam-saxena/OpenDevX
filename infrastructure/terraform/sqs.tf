# =============================================================================
# OpenDevX — AWS SQS Asynchronous Message Queue Module
# =============================================================================

# Dead Letter Queue (DLQ) for Failed Messages
resource "aws_sqs_queue" "events_dlq" {
  name                      = "opendevx-events-dlq-${var.environment}"
  message_retention_seconds = 1209600 # 14 days
  kms_master_key_id         = "alias/aws/sqs"
}

# Main SQS Queue for Asynchronous Event Bus
resource "aws_sqs_queue" "events" {
  name                       = "opendevx-events-${var.environment}"
  delay_seconds              = 0
  max_message_size           = 262144 # 256 KB
  message_retention_seconds  = 345600 # 4 days
  receive_wait_time_seconds  = 10     # Long polling
  kms_master_key_id          = "alias/aws/sqs"

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.events_dlq.arn
    maxReceiveCount     = 5
  })

  tags = {
    Name        = "opendevx-events-sqs-${var.environment}"
    Environment = var.environment
    Service     = "event-bus"
  }
}
