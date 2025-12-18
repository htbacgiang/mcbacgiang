# PowerShell script để khởi động ngrok tunnel
Write-Host "===========================================" -ForegroundColor Green
Write-Host "       STARTING NGROK TUNNEL" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Starting ngrok tunnel for port 3000..." -ForegroundColor Yellow
Write-Host "URL will be displayed below:" -ForegroundColor Yellow
Write-Host ""

try {
    # Kiểm tra xem ngrok có được cài đặt không
    $ngrokExists = Get-Command ngrok -ErrorAction SilentlyContinue
    if (-not $ngrokExists) {
        Write-Host "❌ Ngrok is not installed!" -ForegroundColor Red
        Write-Host "📥 Please install ngrok from: https://ngrok.com/download" -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }

    # Kiểm tra xem port 3000 có đang được sử dụng không
    $portInUse = Test-NetConnection -ComputerName localhost -Port 3000 -WarningAction SilentlyContinue
    if (-not $portInUse.TcpTestSucceeded) {
        Write-Host "⚠️  Warning: Port 3000 is not in use!" -ForegroundColor Yellow
        Write-Host "💡 Make sure your Next.js server is running with: npm run dev" -ForegroundColor Cyan
        Write-Host ""
    } else {
        Write-Host "✅ Port 3000 is accessible" -ForegroundColor Green
    }

    Write-Host "🚀 Starting ngrok tunnel..." -ForegroundColor Green
    Write-Host ""

    # Chạy ngrok
    ngrok http 3000

} catch {
    Write-Host "❌ Error starting ngrok: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    Write-Host ""
    Write-Host "===========================================" -ForegroundColor Green
    Write-Host "       NGROK TUNNEL STOPPED" -ForegroundColor Green
    Write-Host "===========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "💡 Tips:" -ForegroundColor Cyan
    Write-Host "   - Copy the HTTPS URL for callback testing" -ForegroundColor White
    Write-Host "   - Keep this window open while testing" -ForegroundColor White
    Write-Host "   - If tunnel disconnects, restart this script" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
}
