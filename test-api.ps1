# Test API endpoints
$baseUrl = "https://businesswatch.vercel.app"
$cronSecret = "mizd_ouuc_nhij_cnoz"

Write-Host "Testing API endpoints..." -ForegroundColor Cyan
Write-Host "URL: $baseUrl" -ForegroundColor Gray
Write-Host ""

# Test scrape endpoint
try {
    Write-Host "Testing /api/scrape-gazette..." -ForegroundColor Yellow
    $response = Invoke-WebRequest -Uri "$baseUrl/api/scrape-gazette" `
        -Headers @{ "Authorization" = "Bearer $cronSecret" } `
        -MaximumRedirection 0 `
        -ErrorAction Stop
    
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    $content = $response.Content | ConvertFrom-Json
    Write-Host "New tenders: $($content.newTendersFound)" -ForegroundColor Green
    Write-Host "Total: $($content.totalTenders)" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

Write-Host ""

# Test deadline endpoint
try {
    Write-Host "Testing /api/check-deadlines..." -ForegroundColor Yellow
    $response = Invoke-WebRequest -Uri "$baseUrl/api/check-deadlines" `
        -Headers @{ "Authorization" = "Bearer $cronSecret" } `
        -MaximumRedirection 0 `
        -ErrorAction Stop
    
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    $content = $response.Content | ConvertFrom-Json
    Write-Host "Tenders checked: $($content.tendersChecked)" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}
