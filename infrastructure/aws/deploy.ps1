# OpenDevX Automated AWS Free-Tier Deployment Script

$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Starting OpenDevX AWS Deployment Process" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Ensure AWS CLI is accessible
$env:PATH += ";C:\Program Files\Amazon\AWSCLIV2"

# 2. Check AWS Credentials
Write-Host "Verifying AWS Credentials..." -ForegroundColor Yellow
try {
    $identity = aws sts get-caller-identity --output json | ConvertFrom-Json
    Write-Host "Authenticated as AWS Account: $($identity.Account) ($($identity.Arn))" -ForegroundColor Green
} catch {
    Write-Host "Unable to locate AWS credentials." -ForegroundColor Red
    Write-Host "Please run 'aws configure' and provide your AWS Access Key ID and Secret Access Key." -ForegroundColor Red
    exit 1
}

# 3. Build Web Bundle
Write-Host "Building React Web Production Bundle..." -ForegroundColor Yellow
Push-Location "$PSScriptRoot\..\..\apps\web"
npm run build
Pop-Location

# 4. Deploy CloudFormation Infrastructure Stack
$stackName = "opendevx-stack"
Write-Host "Deploying AWS CloudFormation Stack ($stackName)..." -ForegroundColor Yellow
aws cloudformation deploy `
    --template-file "$PSScriptRoot\template.yaml" `
    --stack-name $stackName `
    --capabilities CAPABILITY_IAM

# 5. Get Outputs
$bucketName = aws cloudformation describe-stacks --stack-name $stackName --query "Stacks[0].Outputs[?OutputKey=='S3BucketName'].OutputValue" --output text
$httpsUrl = aws cloudformation describe-stacks --stack-name $stackName --query "Stacks[0].Outputs[?OutputKey=='FrontendHTTPSWebsiteURL'].OutputValue" --output text
$s3Url = aws cloudformation describe-stacks --stack-name $stackName --query "Stacks[0].Outputs[?OutputKey=='FrontendS3WebsiteURL'].OutputValue" --output text

# 6. Upload Assets to S3
Write-Host "Syncing web production build to S3 Bucket ($bucketName)..." -ForegroundColor Yellow
aws s3 sync "$PSScriptRoot\..\..\apps\web\dist" "s3://$bucketName" --delete

Write-Host "==========================================" -ForegroundColor Green
Write-Host "AWS Deployment Complete!" -ForegroundColor Green
Write-Host "Live Secure AWS HTTPS URL: $httpsUrl" -ForegroundColor Cyan
Write-Host "Live AWS S3 HTTP Website URL: $s3Url" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Green
