param(
  [ValidateSet("start", "install")]
  [string]$Action = "start",

  [ValidateSet("h5", "mp-weixin")]
  [string]$Mode = "h5"
)

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ProjectRoot = Resolve-Path (Join-Path $ScriptDir "..")
$BackendDir = Join-Path $ProjectRoot "backend"
$FrontendDir = Join-Path $ProjectRoot "frontend\miniprogram"
$BackendJob = $null
$FrontendJob = $null

function Require-Directory {
  param(
    [string]$Path,
    [string]$Label
  )

  if (-not (Test-Path -LiteralPath $Path -PathType Container)) {
    throw "$Label directory not found: $Path"
  }
}

function Require-Command {
  param([string]$Name)

  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Missing required command: $Name"
  }
}

function Install-Dependencies {
  Write-Host "[Backend] Installing dependencies..." -ForegroundColor Green
  Push-Location $BackendDir
  try {
    npm install
  }
  finally {
    Pop-Location
  }

  Write-Host "[Frontend] Installing dependencies..." -ForegroundColor Green
  Push-Location $FrontendDir
  try {
    npm install
  }
  finally {
    Pop-Location
  }
}

function Ensure-NodeModules {
  param(
    [string]$Path,
    [string]$Label
  )

  if (-not (Test-Path -LiteralPath (Join-Path $Path "node_modules") -PathType Container)) {
    Write-Host "[$Label] Dependencies missing, running npm install..." -ForegroundColor Yellow
    Push-Location $Path
    try {
      npm install
    }
    finally {
      Pop-Location
    }
  }
}

function Test-BackendHealth {
  try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing -TimeoutSec 2
    return $response.StatusCode -ge 200 -and $response.StatusCode -lt 300
  }
  catch {
    return $false
  }
}

function Stop-StartedJobs {
  Write-Host ""
  Write-Host "Stopping services started by this script..." -ForegroundColor Yellow

  foreach ($job in @($BackendJob, $FrontendJob)) {
    if ($null -ne $job -and $job.State -eq "Running") {
      Stop-Job -Job $job -ErrorAction SilentlyContinue
    }
  }
}

try {
  Require-Directory $BackendDir "Backend"
  Require-Directory $FrontendDir "Frontend"
  Require-Command "node"
  Require-Command "npm"

  Write-Host "========================================"
  Write-Host "      UniAppPencil Startup Script"
  Write-Host "========================================"
  Write-Host "Project root : $ProjectRoot"
  Write-Host "Action       : $Action"
  Write-Host "Frontend mode: $Mode"
  Write-Host ""

  if ($Action -eq "install") {
    Install-Dependencies
    Write-Host ""
    Write-Host "Dependencies installed." -ForegroundColor Green
    exit 0
  }

  Write-Host "[MySQL] This script does not start MySQL on Windows." -ForegroundColor Yellow
  Write-Host "[MySQL] Make sure your local MySQL service is already running." -ForegroundColor Yellow
  Write-Host ""

  Ensure-NodeModules $BackendDir "Backend"
  Ensure-NodeModules $FrontendDir "Frontend"

  if (Test-BackendHealth) {
    Write-Host "[Backend] Port 3001 is already serving health checks, skipping backend start." -ForegroundColor Yellow
  }
  else {
    Write-Host "[Backend] Starting Express service..." -ForegroundColor Green
    $BackendJob = Start-Job -Name "UniAppPencilBackend" -ScriptBlock {
      param($Path)
      Set-Location $Path
      npm run dev
    } -ArgumentList $BackendDir

    Start-Sleep -Seconds 3
    if (Test-BackendHealth) {
      Write-Host "[Backend] Health check passed: http://localhost:3001/health" -ForegroundColor Green
    }
    else {
      Write-Host "[Backend] Started, but health check is not ready yet." -ForegroundColor Yellow
    }
  }

  $FrontendScript = if ($Mode -eq "mp-weixin") { "dev:mp-weixin" } else { "dev:h5" }
  Write-Host "[Frontend] Starting UniApp with npm run $FrontendScript ..." -ForegroundColor Green
  $FrontendJob = Start-Job -Name "UniAppPencilFrontend" -ScriptBlock {
    param($Path, $Script)
    Set-Location $Path
    npm run $Script
  } -ArgumentList $FrontendDir, $FrontendScript

  Write-Host ""
  Write-Host "Services started." -ForegroundColor Green
  if ($null -ne $BackendJob) {
    Write-Host "Backend Job : $($BackendJob.Id)"
  }
  else {
    Write-Host "Backend Job : already running"
  }
  Write-Host "Frontend Job: $($FrontendJob.Id)"
  Write-Host "Backend URL : http://localhost:3001/health"
  Write-Host "Press Ctrl+C to stop services started by this script." -ForegroundColor Yellow
  Write-Host ""

  while ($true) {
    foreach ($job in @($BackendJob, $FrontendJob)) {
      if ($null -ne $job) {
        Receive-Job -Job $job -Keep
      }
    }
    Start-Sleep -Seconds 2
  }
}
finally {
  Stop-StartedJobs
}
