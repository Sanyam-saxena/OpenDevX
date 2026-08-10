# OpenDevX Automated AWS Amplify HTTPS Deployment Script

$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Starting OpenDevX AWS Amplify HTTPS Deployment" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Ensure AWS CLI is accessible
$env:PATH += ";C:\Program Files\Amazon\AWSCLIV2"

# 2. Check AWS Credentials
Write-Host "Verifying AWS Credentials..." -ForegroundColor Yellow
try {
    $identity = aws sts get-caller-identity --output json | ConvertFrom-Json
    Write-Host "Authenticated as AWS Account: $($identity.Account)" -ForegroundColor Green
} catch {
    Write-Host "Unable to locate AWS credentials." -ForegroundColor Red
    exit 1
}

# 3. Build Web Production Bundle
Write-Host "Building React Web Production Bundle..." -ForegroundColor Yellow
Push-Location "$PSScriptRoot\..\..\apps\web"
npm run build
Pop-Location

# 4. Zip build directory
$distPath = "$PSScriptRoot\..\..\apps\web\dist"
$zipPath = "$PSScriptRoot\..\..\apps\web\dist.zip"
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

Write-Host "Packaging production assets into zip archive..." -ForegroundColor Yellow
Compress-Archive -Path "$distPath\*" -DestinationPath $zipPath -Force

# 5. App details
$appName = "OpenDevX-Web"
$appId = "d1lih8hn9euwa9"

# Configure SPA Rewrite Rule for React Router
aws amplify update-app --app-id $appId --custom-rules '[{"source":"</^[^\\.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json)$)([^.]+$)/>","target":"/index.html","status":"200"}]' | Out-Null

# 6. Create Deployment
Write-Host "Creating AWS Amplify HTTPS Deployment..." -ForegroundColor Yellow
$deployJson = aws amplify create-deployment --app-id $appId --branch-name main --output json | ConvertFrom-Json

$jobId = $deployJson.jobId
$uploadUrl = $deployJson.zipUploadUrl

# 7. Upload Zip Archive to AWS Amplify S3 Endpoint
Write-Host "Uploading application bundle to AWS Amplify..." -ForegroundColor Yellow
Invoke-RestMethod -Uri $uploadUrl -Method Put -InFile $zipPath -Headers @{ "Content-Type" = "application/zip" }

# 8. Start Deployment Job
Write-Host "Executing AWS Amplify HTTPS Deployment Job..." -ForegroundColor Yellow
aws amplify start-deployment --app-id $appId --branch-name main --job-id $jobId | Out-Null

$httpsUrl = "https://main.$appId.amplifyapp.com"

Write-Host "==========================================" -ForegroundColor Green
Write-Host "AWS Amplify HTTPS Deployment Complete!" -ForegroundColor Green
Write-Host "Live AWS HTTPS Website URL: $httpsUrl" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Green
