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

// Hàm tạo nội dung sitemap
const generateSitemap = (posts, courses = []) => {
  const baseUrl = 'https://mcbacgiang.com';

  // Tạo XML cho các trang tĩnh
  const staticPagesXml = staticPages
    .map((page) => `
    <url>
      <loc>${encodeUrl(baseUrl + page.url)}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
    </url>
    `)
    .join('');

  // Tạo XML cho các khóa học động
  const courseUrls = courses
    .map((course) => `
    <url>
      <loc>${encodeUrl(baseUrl + '/khoa-hoc/' + encodeURIComponent(course.slug))}</loc>
      <lastmod>${new Date(course.updatedAt || course.createdAt).toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
    </url>
    `)
    .join('');

  // Tạo XML cho các bài viết động (tin tức)
  const postUrls = posts
    .map((post) => `
    <url>
      <loc>${encodeUrl(baseUrl + '/tin-tuc/' + encodeURIComponent(post.slug))}</loc>
      <lastmod>${new Date(post.updatedAt || post.createdAt).toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.7</priority>
    </url>
    `)
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  ${staticPagesXml}
  ${courseUrls}
  ${postUrls}
</urlset>`;
};

// Hàm lấy dữ liệu bài viết
const getPostsForSitemap = async () => {
  try {
    await db.connectDb();
    const posts = await Post.find({}, 'slug updatedAt createdAt isDraft').lean();
    console.log(`Found ${posts.length} total posts in database`);
    
    const publishedPosts = posts.filter(post => !post.isDraft);
    console.log(`Found ${publishedPosts.length} published posts for sitemap`);
    
    return publishedPosts || [];
  } catch (error) {
    console.error('Lỗi khi lấy bài viết:', error);
    return [];
  }
};

// Hàm lấy dữ liệu khóa học
const getCoursesForSitemap = async () => {
  try {
    await db.connectDb();
    const courses = await Course.find({}, 'slug updatedAt createdAt isActive status').lean();
    console.log(`Found ${courses.length} total courses in database`);
    
    const activeCourses = courses.filter(course => 
      course.isActive === true || 
      course.status === 'active' || 
      course.status === 'published' ||
      !course.isActive && !course.status
    );
    console.log(`Found ${activeCourses.length} active courses for sitemap`);
    
    return activeCourses || [];
  } catch (error) {
    console.error('Lỗi khi lấy khóa học:', error);
    return [];
  }
};

// Handler chính cho sitemap chính
const handler = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const [posts, courses] = await Promise.all([
      getPostsForSitemap(),
      getCoursesForSitemap()
    ]);

    console.log(`MCBacGiang Main Sitemap generated: ${staticPages.length} static pages, ${courses.length} courses, ${posts.length} posts`);

    const sitemap = generateSitemap(posts, courses);

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.status(200).send(sitemap);
  } catch (error) {
    console.error('Lỗi khi tạo MCBacGiang sitemap chính:', error);
    res.status(500).end('Lỗi máy chủ khi tạo sitemap chính');
  }
};

export default handler;
