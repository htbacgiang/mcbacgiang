import React, { useState, useEffect } from 'react';
import { FaFilter, FaSearch, FaCalendarAlt, FaUsers, FaTag } from 'react-icons/fa';
import ClassScheduleCard from './ClassScheduleCard';

const ClassScheduleList = ({ year, month }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    sortBy: 'startDate',
    sortOrder: 'asc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  });

  useEffect(() => {
    fetchSchedules();
  }, [year, month, filters, pagination.currentPage]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        year: year,
        month: month,
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      });

      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/class-schedules?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setSchedules(data.data.classSchedules);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const statusOptions = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'Sắp khai giảng', label: 'Sắp khai giảng' },
    { value: 'Đang tuyển sinh', label: 'Đang tuyển sinh' },
    { value: 'Đã đầy', label: 'Đã đầy' },
    { value: 'Đã kết thúc', label: 'Đã kết thúc' },
    { value: 'Tạm hoãn', label: 'Tạm hoãn' }
  ];

  const sortOptions = [
    { value: 'startDate', label: 'Ngày khai giảng' },
    { value: 'className', label: 'Tên lớp' },
    { value: 'currentStudents', label: 'Số học viên' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center space-x-2 mb-4">
          <FaFilter className="text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Bộ lọc</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tìm kiếm
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo tên lớp, khóa học..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sắp xếp theo
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thứ tự
            </label>
            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="asc">Tăng dần</option>
              <option value="desc">Giảm dần</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-gray-600">
          <FaCalendarAlt className="text-green-600" />
          <span>
            Hiển thị {schedules.length} trong tổng số {pagination.totalItems} lớp học
          </span>
        </div>
      </div>

      {/* Schedule Cards */}
      {schedules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedules.map((schedule) => (
            <ClassScheduleCard key={schedule._id} schedule={schedule} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không có lịch khai giảng
          </h3>
          <p className="text-gray-600">
            Không tìm thấy lớp học nào phù hợp với bộ lọc của bạn.
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Trước
          </button>
          
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 border rounded-lg ${
                page === pagination.currentPage
                  ? 'bg-green-600 text-white border-green-600'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default ClassScheduleList;
