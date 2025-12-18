import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import AdminLayout from '../../../components/layout/AdminLayout';
import Link from 'next/link';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toCloudinaryUrl } from '../../../utils/cloudinary';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaStar, FaUsers, FaClock } from 'react-icons/fa';

export default function CoursesListPage() {
  const [allCourses, setAllCourses] = useState([]);
  const [displayedCourses, setDisplayedCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const limit = 10;

  const tableContainerRef = useRef(null);


  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/courses');
      const courses = response.data.courses || [];
      console.log('Courses from API:', courses);
      setAllCourses(courses);
      setTotalPages(Math.ceil(courses.length / limit));
      setDisplayedCourses(courses.slice(0, limit));
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Không thể tải danh sách khóa học', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Filter courses based on search term and selected level
  const filteredCourses = useCallback(() => {
    let filtered = allCourses;
    
    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(course => 
        course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.maKhoaHoc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.level?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by level
    if (selectedLevel) {
      filtered = filtered.filter(course => 
        course.level === selectedLevel
      );
    }
    
    return filtered;
  }, [allCourses, searchTerm, selectedLevel]);

  useEffect(() => {
    const filtered = filteredCourses();
    setTotalPages(Math.ceil(filtered.length / limit));
    setPage(1); // Reset to first page when filtering
  }, [filteredCourses, limit]);

  useEffect(() => {
    const filtered = filteredCourses();
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    setDisplayedCourses(filtered.slice(startIndex, endIndex));

    if (tableContainerRef.current) {
      tableContainerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [page, filteredCourses, limit]);

  const handleDelete = async () => {
    if (!courseToDelete) return;

    setLoading(true);
    try {
      await axios.delete(`/api/courses?_id=${courseToDelete}`);
      toast.success('Khóa học đã được xóa thành công', {
        position: 'top-right',
        autoClose: 3000,
      });
      const updatedCourses = allCourses.filter((course) => course._id !== courseToDelete);
      setAllCourses(updatedCourses);
      setTotalPages(Math.ceil(updatedCourses.length / limit));
      if (updatedCourses.length > 0 && displayedCourses.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Không thể xóa khóa học', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      setCourseToDelete(null);
    }
  };

  const confirmDelete = (id) => {
    setCourseToDelete(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCourseToDelete(null);
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const ellipsis = "...";

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, page - 2);
      let endPage = Math.min(totalPages, page + 2);

      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push(ellipsis);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push(ellipsis);
        pageNumbers.push(totalPages);
      }
    }

    return (
      <div className="flex justify-center mt-8 space-x-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
        >
          Trước
        </button>
        {pageNumbers.map((num, index) => (
          <button
            key={index}
            onClick={() => typeof num === 'number' && setPage(num)}
            disabled={num === ellipsis}
            className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${
              num === page
                ? 'bg-blue-600 text-white shadow-lg'
                : num === ellipsis
                  ? 'text-gray-500 cursor-default'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-blue-300'
            }`}
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
        >
          Sau
        </button>
      </div>
    );
  };

  return (
    <AdminLayout title="Danh sách khóa học">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 mb-6 border border-gray-100 dark:border-slate-700">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Danh sách khóa học
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Quản lý và theo dõi tất cả khóa học trong hệ thống
                </p>
              </div>
              <Link href="/dashboard/them-khoa-hoc">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 font-semibold shadow-lg flex items-center gap-2">
                  <FaPlus className="text-sm" />
                  Thêm khóa học
                </button>
              </Link>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 mb-3 border border-gray-100 dark:border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm khóa học..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white appearance-none cursor-pointer"
                >
                  <option value="">Tất cả cấp độ</option>
                  <option value="Cơ bản">Cơ bản</option>
                  <option value="Nâng cao">Nâng cao</option>
                  <option value="Chuyên nghiệp">Chuyên nghiệp</option>
                  <option value="Tất cả cấp độ">Tất cả cấp độ</option>
                </select>
              </div>
            </div>
            
            {/* Filter Status and Clear Button */}
            {(searchTerm || selectedLevel) && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-600">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <span>Kết quả tìm kiếm:</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {filteredCourses().length} khóa học
                  </span>
                  {searchTerm && (
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
                      &quot;{searchTerm}&quot;
                    </span>
                  )}
                  {selectedLevel && (
                    <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full text-xs">
                      {selectedLevel}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedLevel('');
                  }}
                  className="text-sm text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>

          {/* Courses Table Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden">
            {loading && allCourses.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">Đang tải dữ liệu...</p>
                </div>
              </div>
            ) : filteredCourses().length === 0 && (searchTerm || selectedLevel) ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-xl font-medium mb-2 text-gray-900 dark:text-white">Không tìm thấy khóa học</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Thử thay đổi từ khóa tìm kiếm hoặc cấp độ</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedLevel('');
                    }}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              </div>
            ) : (
             <div ref={tableContainerRef} className="overflow-x-auto">
               <table className="w-full" role="grid" aria-label="Danh sách khóa học">
                 <thead>
                   <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-600 border-b border-gray-200 dark:border-slate-600">
                     <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wider" scope="col">
                       STT
                     </th>
                     <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wider" scope="col">
                       Khóa học
                     </th>
                     <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wider" scope="col">
                       Mã khóa học
                     </th>
                     <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wider" scope="col">
                       Cấp độ
                     </th>
                     <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wider" scope="col">
                       Thông tin
                     </th>
                     <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wider" scope="col">
                       Hành động
                     </th>
                   </tr>
                 </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
                  {displayedCourses.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="text-gray-500 dark:text-gray-400">
                          <div className="text-6xl mb-4">📚</div>
                          <p className="text-xl font-medium mb-2">Không có khóa học nào</p>
                          <p className="text-sm">Hãy thêm khóa học đầu tiên để bắt đầu</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                   displayedCourses.map((course, index) => (
                     <tr
                       key={course._id}
                       className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200"
                       role="row"
                     >
                       <td className="px-6 py-4 whitespace-nowrap">
                         <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
                           {(page - 1) * limit + index + 1}
                         </span>
                       </td>
                       <td className="px-6 py-4">
                         <div className="flex items-center">
                           <div className="flex-shrink-0 h-16 w-16 mr-4">
                             <Image
                               src={toCloudinaryUrl(course.image || '')}
                               alt={course.title || 'Khóa học'}
                               width={64}
                               height={64}
                               loading="lazy"
                               className="rounded-lg object-cover w-full h-full shadow-sm"
                             />
                           </div>
                           <div className="max-w-xs">
                             <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                               {course.title || 'N/A'}
                             </div>
                             {course.subtitle && (
                               <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                 {course.subtitle}
                               </div>
                             )}
                             <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                               ID: {course._id?.slice(-8) || 'N/A'}
                             </div>
                           </div>
                         </div>
                       </td>

                       <td className="px-6 py-4 whitespace-nowrap">
                         <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                           {course.maKhoaHoc || 'N/A'}
                         </span>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                           course.level === 'Cơ bản' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                           course.level === 'Nâng cao' ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200' :
                           course.level === 'Chuyên nghiệp' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                           'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                         }`}>
                           {course.level || 'Không xác định'}
                         </span>
                       </td>
                       <td className="px-6 py-4">
                         <div className="text-sm text-gray-900 dark:text-white space-y-1">
                           <div className="flex items-center gap-1">
                             <FaClock className="text-gray-400 text-xs" />
                             <span className="text-xs">{course.duration || 'N/A'}</span>
                           </div>
                           {course.rating > 0 && (
                             <div className="flex items-center gap-1">
                               <FaStar className="text-yellow-400 text-xs" />
                               <span className="text-xs">{course.rating}/5 ({course.reviews || 0} đánh giá)</span>
                             </div>
                           )}
                           {course.students > 0 && (
                             <div className="flex items-center gap-1">
                               <FaUsers className="text-blue-400 text-xs" />
                               <span className="text-xs">{course.students} học viên</span>
                             </div>
                           )}
                         </div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="flex items-center space-x-3">
                           <Link href={`/dashboard/them-khoa-hoc?_id=${course._id}`}>
                             <button
                               className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
                               aria-label={`Sửa khóa học ${course.title || 'Khóa học'}`}
                             >
                               <FaEdit className="mr-1" />
                               Sửa
                             </button>
                           </Link>
                           <button
                             onClick={() => confirmDelete(course._id)}
                             className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 transition-colors duration-200"
                             aria-label={`Xóa khóa học ${course.title || 'Khóa học'}`}
                           >
                             <FaTrash className="mr-1" />
                             Xóa
                           </button>
                         </div>
                       </td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
           </div>
         )}
       </div>

       {/* Pagination */}
       {totalPages > 1 && (
         <div className="mt-6">
           {renderPagination()}
         </div>
       )}

       {/* Delete Confirmation Modal */}
       {isModalOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
             <div className="p-6">
               <div className="flex items-center mb-4">
                 <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
                   <FaTrash className="h-6 w-6 text-red-600 dark:text-red-400" />
                 </div>
               </div>
               <h3 className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-white">
                 Xác nhận xóa
               </h3>
               <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                 Bạn có chắc muốn xóa khóa học này? Hành động này không thể hoàn tác.
               </p>
               <div className="flex justify-center gap-3">
                 <button
                   onClick={closeModal}
                   className="px-6 py-3 bg-gray-300 dark:bg-slate-600 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-400 dark:hover:bg-slate-500 transition-colors duration-200 font-medium"
                 >
                   Hủy
                 </button>
                 <button
                   onClick={handleDelete}
                   className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                   disabled={loading}
                 >
                   {loading ? (
                     <div className="flex items-center">
                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                       Đang xóa...
                     </div>
                   ) : (
                     'Xóa'
                   )}
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

       <ToastContainer />
     </div>
   </div>
 </AdminLayout>
);
}