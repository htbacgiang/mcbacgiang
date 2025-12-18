const mysql = require('mysql2/promise');
const mongoose = require('mongoose');
const DOMPurify = require('isomorphic-dompurify');
const slugify = require('slugify');

// --- 1. CẤU HÌNH KẾT NỐI ---
const MYSQL_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: '',       // Điền pass MySQL của anh
    database: 'nhbenzmz_mcbacgiang' // Tên DB chứa dữ liệu cũ
};

// Kết nối đến DB của dự án Next.js (Anh xem trong file .env.local của anh là gì thì điền vào)
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://baccgiangeco7:Truong2024@cluster0.8cx3qwo.mongodb.net/ecobacgiang_db?retryWrites=true&w=majority';

const OLD_DOMAIN = 'mcbacgiang.com';

// --- 2. MODEL MONGODB (Định nghĩa tạm để script dùng) ---
// Anh có thể import model từ code dự án, nhưng định nghĩa lại ở đây cho đỡ lỗi đường dẫn
const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    content: String,
    excerpt: String,
    thumbnail: String,
    type: { type: String, default: 'post' }, // post hoặc page
    status: { type: String, default: 'published' },
    originalId: Number,
    publishedAt: Date,
    updatedAt: Date
});

// Kiểm tra xem model đã tồn tại chưa để tránh lỗi OverwriteModelError
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

// --- 3. XỬ LÝ DỮ LIỆU ---
const processContent = (html) => {
    if (!html) return "";
    // Thay thế đường dẫn ảnh cũ -> mới
    const regex = new RegExp(`https?:\\/\\/${OLD_DOMAIN}\\/wp-content\\/uploads\\/`, 'g');
    let cleanHtml = html.replace(regex, '/uploads/');

    // Lọc mã độc
    cleanHtml = DOMPurify.sanitize(cleanHtml, {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form'],
        FORBID_ATTR: ['onerror', 'onclick', 'onload']
    });
    return cleanHtml;
};

const extractThumbnail = (html) => {
    if (!html) return null;
    const imgMatch = html.match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : null;
};

// --- 4. CHẠY MIGRATE ---
async function migrate() {
    let mysqlConn;
    try {
        console.log('🚀 Đang kết nối Database...');
        
        // Kết nối Mongo
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB Connected');

        // Kết nối MySQL
        mysqlConn = await mysql.createConnection(MYSQL_CONFIG);
        console.log('✅ MySQL Connected');

        // Lấy dữ liệu
        const [rows] = await mysqlConn.execute(
            `SELECT ID, post_title, post_content, post_excerpt, post_name, post_date, post_modified, post_type 
             FROM wp_posts 
             WHERE post_status = 'publish' AND post_type IN ('post', 'page')`
        );
        
        console.log(`📦 Tìm thấy ${rows.length} mục. Đang xử lý...`);

        let count = 0;
        for (const row of rows) {
            const cleanBody = processContent(row.post_content);
            let finalSlug = row.post_name || slugify(row.post_title, { lower: true, strict: true });

            await Post.findOneAndUpdate(
                { slug: finalSlug },
                {
                    title: row.post_title,
                    slug: finalSlug,
                    content: cleanBody,
                    excerpt: row.post_excerpt,
                    thumbnail: extractThumbnail(cleanBody),
                    type: row.post_type,
                    status: 'published',
                    originalId: row.ID,
                    publishedAt: new Date(row.post_date),
                    updatedAt: new Date(row.post_modified)
                },
                { upsert: true, new: true }
            );
            count++;
            if (count % 20 === 0) process.stdout.write('.');
        }

        console.log(`\n\n🎉 XONG! Đã chuyển ${count} bài vào MongoDB.`);

    } catch (err) {
        console.error('❌ Lỗi:', err);
    } finally {
        if (mysqlConn) await mysqlConn.end();
        await mongoose.disconnect(); // Ngắt kết nối để script tự thoát
    }
}

migrate();