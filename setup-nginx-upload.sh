#!/bin/bash

# Script tự động cấu hình Nginx cho upload file lớn
# Sử dụng: sudo bash setup-nginx-upload.sh your-domain.com

set -e

# Màu sắc cho output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Kiểm tra quyền root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Vui lòng chạy script với quyền sudo${NC}"
    exit 1
fi

# Lấy domain từ tham số
DOMAIN=${1:-""}
if [ -z "$DOMAIN" ]; then
    echo -e "${YELLOW}Usage: sudo bash setup-nginx-upload.sh your-domain.com${NC}"
    exit 1
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Cấu hình Nginx cho upload file lớn${NC}"
echo -e "${GREEN}Domain: $DOMAIN${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Tìm file cấu hình
CONFIG_FILE=""
if [ -f "/etc/nginx/sites-available/$DOMAIN" ]; then
    CONFIG_FILE="/etc/nginx/sites-available/$DOMAIN"
elif [ -f "/etc/nginx/sites-available/${DOMAIN}.conf" ]; then
    CONFIG_FILE="/etc/nginx/sites-available/${DOMAIN}.conf"
elif [ -f "/etc/nginx/conf.d/${DOMAIN}.conf" ]; then
    CONFIG_FILE="/etc/nginx/conf.d/${DOMAIN}.conf"
else
    echo -e "${YELLOW}Không tìm thấy file cấu hình cho domain $DOMAIN${NC}"
    echo -e "${YELLOW}Các file có sẵn:${NC}"
    ls -la /etc/nginx/sites-available/ 2>/dev/null || ls -la /etc/nginx/conf.d/ 2>/dev/null
    read -p "Nhập đường dẫn file cấu hình: " CONFIG_FILE
fi

if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${RED}File không tồn tại: $CONFIG_FILE${NC}"
    exit 1
fi

echo -e "${GREEN}Đã tìm thấy file cấu hình: $CONFIG_FILE${NC}"

# Backup file cấu hình
BACKUP_FILE="${CONFIG_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
cp "$CONFIG_FILE" "$BACKUP_FILE"
echo -e "${GREEN}Đã backup file cấu hình: $BACKUP_FILE${NC}"

# Kiểm tra xem đã có client_max_body_size chưa
if grep -q "client_max_body_size" "$CONFIG_FILE"; then
    echo -e "${YELLOW}Đã tìm thấy client_max_body_size trong file${NC}"
    read -p "Bạn có muốn cập nhật không? (y/n): " UPDATE
    if [ "$UPDATE" != "y" ]; then
        echo -e "${YELLOW}Bỏ qua cập nhật${NC}"
        exit 0
    fi
    
    # Cập nhật giá trị hiện có
    sed -i 's/client_max_body_size.*/client_max_body_size 10M;/g' "$CONFIG_FILE"
    echo -e "${GREEN}Đã cập nhật client_max_body_size${NC}"
else
    # Thêm vào đầu server block
    sed -i '/server {/a\    # File upload configuration\n    client_max_body_size 10M;\n    client_body_timeout 120s;\n    client_header_timeout 60s;\n    client_body_buffer_size 512k;' "$CONFIG_FILE"
    echo -e "${GREEN}Đã thêm cấu hình upload file${NC}"
fi

# Kiểm tra xem có location /api/ chưa
if grep -q "location /api/" "$CONFIG_FILE"; then
    echo -e "${YELLOW}Đã tìm thấy location /api/${NC}"
    # Cập nhật cấu hình cho location /api/
    if ! grep -q "client_max_body_size" "$CONFIG_FILE" | grep -A 5 "location /api/"; then
        sed -i '/location \/api\/ {/,/}/ {
            /proxy_pass/a\        client_max_body_size 10M;\n        client_body_timeout 120s;\n        proxy_read_timeout 120s;\n        proxy_send_timeout 120s;
        }' "$CONFIG_FILE"
        echo -e "${GREEN}Đã cập nhật cấu hình cho location /api/${NC}"
    fi
else
    echo -e "${YELLOW}Không tìm thấy location /api/, sẽ thêm vào${NC}"
    # Thêm location /api/ vào trước location /
    sed -i '/location \/ {/i\    location /api/ {\n        proxy_pass http://localhost:3000;\n        proxy_http_version 1.1;\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n        proxy_set_header X-Forwarded-Proto $scheme;\n        client_max_body_size 10M;\n        client_body_timeout 120s;\n        proxy_read_timeout 120s;\n        proxy_send_timeout 120s;\n        client_body_buffer_size 512k;\n    }\n' "$CONFIG_FILE"
    echo -e "${GREEN}Đã thêm location /api/${NC}"
fi

# Kiểm tra cấu hình
echo ""
echo -e "${GREEN}Đang kiểm tra cấu hình Nginx...${NC}"
if nginx -t; then
    echo -e "${GREEN}✓ Cấu hình hợp lệ!${NC}"
    
    # Reload Nginx
    echo ""
    read -p "Bạn có muốn reload Nginx ngay bây giờ? (y/n): " RELOAD
    if [ "$RELOAD" = "y" ]; then
        systemctl reload nginx
        echo -e "${GREEN}✓ Đã reload Nginx thành công!${NC}"
    else
        echo -e "${YELLOW}Vui lòng reload Nginx thủ công: sudo systemctl reload nginx${NC}"
    fi
else
    echo -e "${RED}✗ Cấu hình có lỗi!${NC}"
    echo -e "${YELLOW}Đang khôi phục file backup...${NC}"
    cp "$BACKUP_FILE" "$CONFIG_FILE"
    echo -e "${GREEN}Đã khôi phục file cấu hình${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Hoàn thành!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Các thay đổi đã được áp dụng:"
echo -e "  - client_max_body_size: 10M"
echo -e "  - client_body_timeout: 120s"
echo -e "  - client_body_buffer_size: 512k"
echo ""
echo -e "File backup: $BACKUP_FILE"
echo ""
echo -e "${YELLOW}Lưu ý: Nếu vẫn gặp lỗi, kiểm tra:${NC}"
echo -e "  1. Next.js app đang chạy trên port 3000"
echo -e "  2. Firewall cho phép kết nối"
echo -e "  3. Logs: sudo tail -f /var/log/nginx/error.log"











