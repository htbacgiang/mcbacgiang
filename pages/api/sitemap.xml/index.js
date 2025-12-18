import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import db from '../../../utils/db';
import Post from '../../../models/Post.ts';
import Course from '../../../models/Course';

// Danh sách các trang tĩnh
const staticPages = [
  // Trang chủ - ưu tiên cao nhất
  { url: '/', changefreq: 'daily', priority: '1.0' },
  
  // Các trang chính của website
  { url: '/gioi-thieu', changefreq: 'monthly', priority: '0.9' },
  { url: '/gioi-thieu-trung-tam-qk-bac-giang', changefreq: 'monthly', priority: '0.9' },
  { url: '/khoa-hoc', changefreq: 'daily', priority: '0.9' },
  { url: '/lich-khai-giang', changefreq: 'weekly', priority: '0.9' },
  { url: '/tin-tuc', changefreq: 'daily', priority: '0.8' },
  { url: '/lien-he', changefreq: 'monthly', priority: '0.8' },
  
  // Trang tư vấn và đăng ký
  { url: '/dang-ky-hoc', changefreq: 'weekly', priority: '0.8' },
  { url: '/tu-van', changefreq: 'weekly', priority: '0.7' },
  
  // Các trang chính sách và pháp lý
  { url: '/chinh-sach-bao-mat', changefreq: 'yearly', priority: '0.3' },
  { url: '/dieu-khoan-su-dung', changefreq: 'yearly', priority: '0.3' },
];

// Hàm encode URL an toàn
const encodeUrl = (url) => {
  return url.replace(/&/g, '&amp;')
           .replace(/</g, '&lt;')
           .replace(/>/g, '&gt;')
           .replace(/"/g, '&quot;')
           .replace(/'/g, '&#39;');
};


// Hàm lấy dữ liệu bài viết
const getPostsForSitemap = async () => {
  try {
    await db.connectDb();
    // Lấy tất cả bài viết (cả draft và published)
    const posts = await Post.find({}, 'slug updatedAt createdAt isDraft').lean();
    console.log(`Found ${posts.length} total posts in database`);
    
    // Hiển thị tất cả bài viết (cả draft và published)
    // Nếu muốn chỉ hiển thị published, thay đổi dòng dưới thành:
    // const allPosts = posts.filter(post => !post.isDraft);
    const allPosts = posts; // Hiển thị tất cả bài viết
    console.log(`Found ${allPosts.length} posts for sitemap (including drafts)`);
    
    return allPosts || []; // Đảm bảo luôn trả về array
  } catch (error) {
    console.error('Lỗi khi lấy bài viết:', error);
    return [];
  }
};


// Hàm lấy dữ liệu khóa học
const getCoursesForSitemap = async () => {
  try {
    await db.connectDb();
    // Thử nhiều điều kiện khác nhau
    const courses = await Course.find({}, 'slug updatedAt createdAt isActive status').lean();
    console.log(`Found ${courses.length} total courses in database`);
    
    // Lọc khóa học active
    const activeCourses = courses.filter(course => 
      course.isActive === true || 
      course.status === 'active' || 
      course.status === 'published' ||
      !course.isActive && !course.status // Nếu không có field active
    );
    console.log(`Found ${activeCourses.length} active courses for sitemap`);
    
    return activeCourses || [];
  } catch (error) {
    console.error('Lỗi khi lấy khóa học:', error);
    return [];
  }
};


// Handler chính cho API sitemap - Auto-generate và save file
const handler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('🔄 Auto-generating MCBacGiang sitemap on request...');
    
    // Lấy tất cả dữ liệu song song để tối ưu hiệu suất
    const [posts, courses] = await Promise.all([
      getPostsForSitemap(),
      getCoursesForSitemap()
    ]);

    // Tạo sitemap content
    const baseUrl = 'https://mcbacgiang.com';
    const currentDate = new Date().toISOString();

    // Tạo XML sitemap
    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`;

    // Thêm static routes
    staticPages.forEach(route => {
      const lastmod = currentDate;
      sitemapXml += `
<url><loc>${baseUrl}${route.url}</loc><lastmod>${lastmod}</lastmod><changefreq>${route.changefreq}</changefreq><priority>${route.priority}</priority></url>`;
    });

    // Thêm course routes
    courses.forEach(course => {
      const lastmod = course.updatedAt ? new Date(course.updatedAt).toISOString() : currentDate;
      sitemapXml += `
<url><loc>${baseUrl}/khoa-hoc/${course.slug}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`;
    });

    // Thêm post routes (tin tức)
    posts.forEach(post => {
      const lastmod = post.updatedAt ? new Date(post.updatedAt).toISOString() : currentDate;
      sitemapXml += `
<url><loc>${baseUrl}/tin-tuc/${post.slug}</loc><lastmod>${lastmod}</lastmod><changefreq>daily</changefreq><priority>0.7</priority></url>`;
    });

    sitemapXml += `
</urlset>`;

    // Ghi file sitemap vào public folder
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemapXml);

    // Cập nhật robots.txt
    const robotsContent = `# *
User-agent: *
Allow: /

# Host
Host: ${baseUrl}/

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml`;

    const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
    fs.writeFileSync(robotsPath, robotsContent);

    // Set headers cho XML response
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache 1 hour
    
    console.log('✅ MCBacGiang sitemap auto-generated successfully!');
    console.log(`📊 Stats: ${staticPages.length} static + ${courses.length} courses + ${posts.length} posts = ${staticPages.length + courses.length + posts.length} total routes`);

    // Trả về sitemap XML
    res.status(200).send(sitemapXml);

  } catch (error) {
    console.error('❌ Error auto-generating MCBacGiang sitemap:', error);
    
    // Fallback: trả về sitemap hiện tại nếu có
    try {
      const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
      if (fs.existsSync(sitemapPath)) {
        const existingSitemap = fs.readFileSync(sitemapPath, 'utf8');
        res.setHeader('Content-Type', 'application/xml');
        res.status(200).send(existingSitemap);
        return;
      }
    } catch (fallbackError) {
      console.error('Fallback failed:', fallbackError);
    }
    
    res.status(500).json({
      success: false,
      message: 'Error generating MCBacGiang sitemap',
      error: error.message
    });
  }
};

export default handler;