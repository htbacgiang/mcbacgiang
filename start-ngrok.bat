@echo off
echo ===========================================
echo       STARTING NGROK TUNNEL
echo ===========================================
echo.

echo Starting ngrok tunnel for port 3000...
echo URL will be displayed below:
echo.

ngrok http 3000

echo.
echo ===========================================
echo       NGROK TUNNEL STOPPED
echo ===========================================
echo If you need to restart, run this batch file again
echo.
pause
