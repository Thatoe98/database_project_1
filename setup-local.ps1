# Blood Inventory Management System - Local Setup Script
# Run this in PowerShell to set up your local environment

Write-Host "🩸 Blood Inventory Management System - Local Setup" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Check if env-local.js already exists
if (Test-Path "env-local.js") {
    Write-Host "⚠️  env-local.js already exists!" -ForegroundColor Yellow
    $response = Read-Host "Do you want to overwrite it? (y/n)"
    if ($response -ne "y") {
        Write-Host "Setup cancelled." -ForegroundColor Red
        exit
    }
}

# Copy the example file
Write-Host "📋 Creating env-local.js from template..." -ForegroundColor Green
Copy-Item "env-local.example.js" "env-local.js"

Write-Host ""
Write-Host "✅ env-local.js created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Open env-local.js in a text editor" -ForegroundColor White
Write-Host "2. Replace 'your-project-id' with your actual Supabase project ID" -ForegroundColor White
Write-Host "3. Replace 'your-supabase-anon-key-here' with your actual anon key" -ForegroundColor White
Write-Host ""
Write-Host "🔑 Get your Supabase credentials from:" -ForegroundColor Yellow
Write-Host "   https://app.supabase.com → Your Project → Settings → API" -ForegroundColor White
Write-Host ""
Write-Host "📂 Then uncomment this line in each HTML file:" -ForegroundColor Yellow
Write-Host '   <!-- <script src="env-local.js"></script> -->' -ForegroundColor White
Write-Host "   Remove the <!-- and --> to uncomment" -ForegroundColor White
Write-Host ""
Write-Host "🚀 After that, open index.html in Live Server or your browser!" -ForegroundColor Green
Write-Host ""

# Ask if they want to open env-local.js now
$openNow = Read-Host "Do you want to open env-local.js now for editing? (y/n)"
if ($openNow -eq "y") {
    Start-Process "env-local.js"
}
