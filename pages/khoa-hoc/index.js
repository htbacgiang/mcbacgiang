import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CourseCard from '../../components/common/CourseCard';
import DefaultLayout from '../../components/layout/DefaultLayout';
import { toCloudinaryUrl } from '../../utils/cloudinary';

const AllCoursesPage = ({ meta }) => {
  const [viewType, setViewType] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');

  // State for API data
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/courses');
        const data = await response.json();

        if (data.status === 'success') {
          // Transform API data to match existing CourseCard format
          const transformedCourses = data.courses.map(course => ({
            id: course._id,
            title: course.title || 'Khóa học',
            description: course.description || course.subtitle || '',
            instructor: 'Q&K Bắc Giang',
            instructorRole: 'Giảng viên',
            category: course.level || 'Tất cả cấp độ',
            lessons: course.sessions || 0,
            videos: 0,
            students: course.students || 0,
            rating: course.rating || 4.8,
            reviews: course.reviews || Math.floor(Math.random() * 50) + 10,
            price: 0,
            discount: 0,
            image: toCloudinaryUrl(course.image),
            badge: course.isNew ? 'Mới' : (course.isFeatured ? 'Nổi bật' : ''),
            enrolledStudents: course.students || 0,
            courseType: 'offline',
            schedule: course.schedule || 'Linh hoạt',
            locations: course.locations || [],
            slug: course.slug || course._id,
            maKhoaHoc: course.maKhoaHoc,
            level: course.level,
            curriculum: course.curriculum || [],
            features: course.features || [],
            requirements: course.requirements || [],
            faq: course.faq || []
          }));
          setCourses(transformedCourses);
        } else {
          setError('Không thể tải dữ liệu khóa học');
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Lỗi kết nối đến server');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    return course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <DefaultLayout>
      <div className="h-[80px] bg-white"></div>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-rose-100">
          {/* Breadcrumb */}
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 border-b-2 border-rose-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-5">
              <div className="flex items-center gap-3 text-base">
                <Link href="/" className="font-semibold text-gray-700 hover:text-pink-600 hover:underline whitespace-nowrap transition-colors duration-200">
                  Trang chủ
                </Link>
                <span className="text-pink-400 font-bold text-lg">›</span>
                <span className="font-bold text-gray-800 bg-pink-100 px-3 py-1 rounded-full text-sm">
                  Khóa học
                </span>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 py-6">

            {/* Title Section */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <h1 className="text-4xl font-bold text-gray-900">Tất cả khóa học</h1>
                  <div className="bg-pink-100 text-pink-700 px-4 py-2 rounded-full flex items-center space-x-2">
                    <span className="text-2xl">🎓</span>
                    <span className="font-semibold">{filteredCourses.length} Khóa học</span>
                  </div>
                </div>
                <p className="text-lg text-gray-600">
                  Các khóa học MC và kỹ năng giao tiếp chuyên nghiệp tại <span className="text-pink-600 font-semibold">Q&K Bắc Giang</span>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-8 border border-rose-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Left Side - View Toggle and Results */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewType('grid')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${viewType === 'grid'
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                        : 'text-gray-600 hover:text-pink-600'
                      }`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <span>Grid</span>
                  </button>
                  <button
                    onClick={() => setViewType('list')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${viewType === 'list'
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                        : 'text-gray-600 hover:text-pink-600'
                      }`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>List</span>
                  </button>
                </div>
                <p className="text-gray-600">
                  Hiển thị 1-{filteredCourses.length} trong tổng số {filteredCourses.length} khóa học
                </p>
              </div>

              {/* Right Side - Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm khóa học..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80 pl-12 pr-4 py-3 border border-rose-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-300 transition-all"
                />
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                <div className="flex flex-col items-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="text-gray-600 font-medium">Đang tải khóa học...</p>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex justify-center items-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 shadow-lg max-w-md">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Có lỗi xảy ra</h3>
                    <p className="text-red-600">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-4 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-colors"
                    >
                      Thử lại
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredCourses.length === 0 && (
            <div className="flex justify-center items-center py-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg max-w-md">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Không tìm thấy khóa học</h3>
                    <p className="text-gray-600">
                      {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Hiện tại chưa có khóa học nào'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Courses Grid */}
          {!loading && !error && filteredCourses.length > 0 && (
            <div className={`grid ${viewType === 'grid'
                ? 'lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6'
                : 'grid-cols-1 gap-4'
              }`}>
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  variant={viewType === 'grid' ? 'default' : 'compact'}
                  showFullFeatures={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export const getServerSideProps = async () => {
  try {
    const meta = {
      title: "Khóa học MC và Kỹ năng Giao tiếp - Q&K Bắc Giang",
      description: "Khám phá các khóa học MC chuyên nghiệp, kỹ năng giao tiếp và thuyết trình tại Q&K Bắc Giang. Nâng cao kỹ năng MC, dẫn chương trình và giao tiếp hiệu quả.",
      keywords: "khóa học MC, kỹ năng giao tiếp, thuyết trình, dẫn chương trình, Q&K Bắc Giang, MC chuyên nghiệp, kỹ năng mềm, Bắc Giang, Bắc Ninh",
      author: "Q&K Bắc Giang",
      robots: "index, follow",
      canonical: "https://mcbacgiang.com/khoa-hoc",
      og: {
        title: "Q&K Bắc Giang - Khóa học MC và Kỹ năng Giao tiếp",
        description: "Khám phá các khóa học MC chuyên nghiệp, kỹ năng giao tiếp và thuyết trình tại Q&K Bắc Giang.",
        type: "website",
          image: "https://mcbacgiang.com/images/banner-qk-bac-giang.jpg",
          imageWidth: "1200",
        imageHeight: "630",
        url: "https://mcbacgiang.com/khoa-hoc",
        siteName: "Q&K Bắc Giang",
      },
      twitter: {
        card: "summary_large_image",
        title: "Q&K Bắc Giang - Khóa học MC và Kỹ năng Giao tiếp",
        description: "Khám phá các khóa học MC chuyên nghiệp, kỹ năng giao tiếp và thuyết trình tại Q&K Bắc Giang.",
        image: "https://mcbacgiang.com/images/banner-qk-bac-giang.jpg",
      },
    };

    return {
      props: {
        meta,
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
};

export default AllCoursesPage;
