# Hướng Dẫn Cấu Hình Nginx Cho Upload File Lớn

## Vấn Đề
Khi upload ảnh lớn hơn 1MB trên VPS bị lỗi, thường do giới hạn `client_max_body_size` trong Nginx mặc định là 1MB.

## Giải Pháp

### Bước 1: Tìm File Cấu Hình Nginx

File cấu hình Nginx thường nằm ở một trong các vị trí sau:
- `/etc/nginx/sites-available/your-domain` (Ubuntu/Debian)
- `/etc/nginx/conf.d/your-domain.conf` (CentOS/RHEL)
- `/etc/nginx/nginx.conf` (cấu hình chính)

### Bước 2: Kiểm Tra File Cấu Hình Hiện Tại

```bash
# Liệt kê các file cấu hình
ls -la /etc/nginx/sites-available/

# Hoặc
ls -la /etc/nginx/conf.d/

# Xem nội dung file cấu hình (thay your-domain bằng tên domain của bạn)
sudo nano /etc/nginx/sites-available/your-domain
# Hoặc
sudo nano /etc/nginx/conf.d/your-domain.conf
```

### Bước 3: Cập Nhật Cấu Hình Nginx

Thêm hoặc cập nhật các dòng sau trong file cấu hình:

#### Cấu Hình Mẫu Cho Next.js App

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;

    # Tăng giới hạn upload lên 10MB (hoặc cao hơn nếu cần)
    client_max_body_size 10M;
    
    # Tăng timeout cho upload file lớn
    client_body_timeout 60s;
    client_header_timeout 60s;
    
    # Tăng buffer size
    client_body_buffer_size 128k;

    # Proxy đến Next.js app (chạy trên port 3000)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Tăng timeout cho proxy
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Cấu hình riêng cho API routes (nơi xử lý upload)
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Tăng giới hạn upload cho API routes
        client_max_body_size 10M;
        client_body_timeout 120s;
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
        
        # Tăng buffer cho upload
        client_body_buffer_size 512k;
    }
}
```

#### Cấu Hình Cho HTTPS (SSL)

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Certificate (sử dụng Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Tăng giới hạn upload lên 10MB
    client_max_body_size 10M;
    client_body_timeout 60s;
    client_header_timeout 60s;
    client_body_buffer_size 128k;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        client_max_body_size 10M;
        client_body_timeout 120s;
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
        client_body_buffer_size 512k;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

### Bước 4: Kiểm Tra Cấu Hình

Trước khi reload, luôn kiểm tra cú pháp cấu hình:

```bash
sudo nginx -t
```

Nếu thấy thông báo:
```
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

Thì cấu hình đúng. Nếu có lỗi, sẽ hiển thị dòng lỗi cụ thể.

### Bước 5: Reload Nginx

Sau khi kiểm tra thành công:

```bash
# Reload Nginx (không downtime)
sudo systemctl reload nginx

# Hoặc restart Nginx (có thể có downtime ngắn)
sudo systemctl restart nginx

# Kiểm tra trạng thái
sudo systemctl status nginx
```

### Bước 6: Kiểm Tra Logs (Nếu Có Vấn Đề)

```bash
# Xem error logs
sudo tail -f /var/log/nginx/error.log

# Xem access logs
sudo tail -f /var/log/nginx/access.log
```

## Các Tham Số Quan Trọng

### `client_max_body_size`
- **Mặc định**: 1M
- **Giải thích**: Giới hạn kích thước tối đa của request body (file upload)
- **Khuyến nghị**: 10M - 50M tùy nhu cầu

### `client_body_timeout`
- **Mặc định**: 60s
- **Giải thích**: Thời gian chờ tối đa để nhận request body
- **Khuyến nghị**: 60s - 120s cho file lớn

### `client_body_buffer_size`
- **Mặc định**: 8k hoặc 16k
- **Giải thích**: Buffer size để đọc request body
- **Khuyến nghị**: 128k - 512k cho file lớn

### `proxy_read_timeout` / `proxy_send_timeout`
- **Mặc định**: 60s
- **Giải thích**: Timeout cho việc đọc/gửi dữ liệu giữa Nginx và backend
- **Khuyến nghị**: 120s cho upload file lớn

## Cấu Hình Toàn Cục (Optional)

Nếu muốn áp dụng cho tất cả sites, có thể thêm vào `/etc/nginx/nginx.conf` trong block `http {}`:

```nginx
http {
    # ... các cấu hình khác ...
    
    # Cấu hình upload file lớn cho tất cả sites
    client_max_body_size 10M;
    client_body_timeout 60s;
    client_body_buffer_size 128k;
    
    # ... các cấu hình khác ...
}
```

## Troubleshooting

### Lỗi: "413 Request Entity Too Large"
- **Nguyên nhân**: `client_max_body_size` quá nhỏ
- **Giải pháp**: Tăng giá trị `client_max_body_size` và reload Nginx

### Lỗi: "504 Gateway Timeout"
- **Nguyên nhân**: Timeout quá ngắn
- **Giải pháp**: Tăng `proxy_read_timeout`, `proxy_send_timeout`, `client_body_timeout`

### Upload bị gián đoạn
- **Nguyên nhân**: Buffer size quá nhỏ
- **Giải pháp**: Tăng `client_body_buffer_size`

## Kiểm Tra Sau Khi Cấu Hình

1. **Test upload file nhỏ (< 1MB)**: Đảm bảo vẫn hoạt động bình thường
2. **Test upload file lớn (1-10MB)**: Kiểm tra có upload được không
3. **Kiểm tra logs**: Xem có lỗi nào không

```bash
# Test với curl (thay your-domain.com bằng domain của bạn)
curl -X POST https://your-domain.com/api/image \
  -H "Content-Type: multipart/form-data" \
  -F "image=@/path/to/test-image.jpg"
```

## Lưu Ý Bảo Mật

1. **Giới hạn hợp lý**: Không đặt `client_max_body_size` quá lớn (ví dụ: 1GB) để tránh DDoS
2. **Rate Limiting**: Cân nhắc thêm rate limiting cho API upload:
   ```nginx
   limit_req_zone $binary_remote_addr zone=upload_limit:10m rate=5r/m;
   
   location /api/image {
       limit_req zone=upload_limit burst=2;
       # ... các cấu hình khác ...
   }
   ```
3. **File Type Validation**: Đảm bảo backend validate loại file (đã có trong code)

## Tài Liệu Tham Khảo

- [Nginx Documentation - client_max_body_size](http://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
- [Nginx Documentation - client_body_timeout](http://nginx.org/en/docs/http/ngx_http_core_module.html#client_body_timeout)

