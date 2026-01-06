# Hướng Dẫn Nhanh Cấu Hình Nginx

## Vấn Đề
Upload ảnh lớn hơn 1MB bị lỗi trên VPS.

## Giải Pháp Nhanh (3 Bước)

### Cách 1: Sử dụng Script Tự Động (Khuyến nghị)

1. **Upload script lên VPS:**
   ```bash
   scp setup-nginx-upload.sh user@your-vps:/home/user/
   ```

2. **Chạy script trên VPS:**
   ```bash
   ssh user@your-vps
   sudo bash setup-nginx-upload.sh your-domain.com
   ```

3. **Xong!** Script sẽ tự động:
   - Tìm file cấu hình
   - Backup file cũ
   - Cập nhật cấu hình
   - Kiểm tra và reload Nginx

---

### Cách 2: Cấu Hình Thủ Công

#### Bước 1: Tìm file cấu hình
```bash
# Ubuntu/Debian
ls /etc/nginx/sites-available/

# CentOS/RHEL
ls /etc/nginx/conf.d/
```

#### Bước 2: Chỉnh sửa file cấu hình
```bash
sudo nano /etc/nginx/sites-available/your-domain
```

#### Bước 3: Thêm các dòng sau vào trong block `server {`:

```nginx
# Ngay sau dòng "server {"
client_max_body_size 10M;
client_body_timeout 120s;
client_body_buffer_size 512k;
```

#### Bước 4: Thêm cấu hình riêng cho API (nếu chưa có):

```nginx
location /api/ {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # Cấu hình upload
    client_max_body_size 10M;
    client_body_timeout 120s;
    proxy_read_timeout 120s;
    proxy_send_timeout 120s;
    client_body_buffer_size 512k;
}
```

#### Bước 5: Kiểm tra và reload
```bash
# Kiểm tra cấu hình
sudo nginx -t

# Nếu OK, reload Nginx
sudo systemctl reload nginx
```

---

## Kiểm Tra Sau Khi Cấu Hình

### Test upload:
1. Thử upload ảnh nhỏ (< 1MB) - phải hoạt động bình thường
2. Thử upload ảnh lớn (2-5MB) - phải upload được
3. Kiểm tra logs nếu có lỗi:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

---

## Các File Đã Tạo

1. **NGINX_CONFIG_GUIDE.md** - Hướng dẫn chi tiết đầy đủ
2. **nginx-site-config-example.conf** - File cấu hình mẫu cho site
3. **nginx-global-config-example.conf** - File cấu hình toàn cục
4. **setup-nginx-upload.sh** - Script tự động cấu hình

---

## Troubleshooting

### Lỗi: "413 Request Entity Too Large"
→ Tăng `client_max_body_size` lên 20M hoặc 50M

### Lỗi: "504 Gateway Timeout"  
→ Tăng các timeout: `client_body_timeout`, `proxy_read_timeout`

### Vẫn không được sau khi cấu hình
→ Kiểm tra:
- Next.js app có đang chạy không: `pm2 list` hoặc `ps aux | grep node`
- Port 3000 có mở không: `netstat -tulpn | grep 3000`
- Firewall có chặn không: `sudo ufw status`

---

## Liên Hệ

Nếu vẫn gặp vấn đề, kiểm tra file **NGINX_CONFIG_GUIDE.md** để xem hướng dẫn chi tiết hơn.











