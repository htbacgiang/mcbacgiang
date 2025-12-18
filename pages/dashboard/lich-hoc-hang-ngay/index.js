import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AdminLayout from '../../../components/layout/AdminLayout';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FaCalendarAlt, 
  FaClock,
  FaUser,
  FaUsers, 
  FaChevronLeft, 
  FaChevronRight,
  FaEnvelope
} from 'react-icons/fa';

export default function DailyScheduleManagement() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [selectedView, setSelectedView] = useState('month'); // 'month', 'week', 'day'
  const [calendarData, setCalendarData] = useState({});
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    totalCapacity: 0,
    statusCounts: {}
  });
  const [studentStats, setStudentStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    graduatedStudents: 0,
    pausedStudents: 0
  });
  const [classColorMap, setClassColorMap] = useState({});

  // Fetch calendar data for current month
  const fetchCalendarData = useCallback(async () => {
    setLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      // Fetch calendar data and student stats in parallel
      const [calendarResponse, studentStatsResponse] = await Promise.all([
        axios.get(`/api/class-schedules/calendar?year=${year}&month=${month}`),
        axios.get('/api/students/stats').catch(() => ({ data: { success: false } })) // Fallback if student stats fails
      ]);
      
      if (calendarResponse.data.success) {
        console.log("Calendar API response:", calendarResponse.data.data);
        setCalendarData(calendarResponse.data.data.calendarData || {});
        
        // Create color map for classes
        const newColorMap = {};
        const calendarData = calendarResponse.data.data.calendarData || {};
        Object.values(calendarData).forEach(daySessions => {
          daySessions.forEach(session => {
            if (session.className && !newColorMap[session.className]) {
              newColorMap[session.className] = getClassColor(session.className);
            }
          });
        });
        setClassColorMap(newColorMap);
        
        // Merge calendar stats with student stats
        const calendarStats = calendarResponse.data.data.stats || {};
        const studentStats = studentStatsResponse.data.success ? studentStatsResponse.data.data : {};
        
        const mergedStats = {
          ...calendarStats,
          totalStudents: studentStats.totalStudents || 0, // Use student stats if available
        };
        
        setStats(mergedStats);
        console.log("Merged stats set:", mergedStats);
      }
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      toast.error('Không thể tải dữ liệu lịch học', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  // Format date for API key (avoid timezone issues)
  const formatDateForKey = (date) => {
    // Use local date to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fetch schedules for a specific date
  const fetchSchedulesForDate = useCallback(async (date) => {
    setLoading(true);
    try {
      const dateStr = formatDateForKey(date);
      const response = await axios.get(`/api/class-schedules?date=${dateStr}`);
      
      if (response.data.success) {
        setSchedules(response.data.data.classSchedules || []);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast.error('Không thể tải dữ liệu lịch học', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCalendarData();
  }, [fetchCalendarData]);

  // Send daily schedule email to admins
  const sendDailyEmail = async (date = new Date()) => {
    setEmailSending(true);
    try {
      const dateStr = new Date(date).toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });
      const response = await axios.post('/api/admin/send-daily-schedule', {
        date: dateStr
      });

      if (response.data.success) {
        toast.success('Email lịch học đã được gửi thành công cho admin!', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        throw new Error(response.data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error(error.response?.data?.message || 'Không thể gửi email', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setEmailSending(false);
    }
  };

  // Send daily schedule email to students
  const sendStudentDailyEmail = async (date = new Date()) => {
    setEmailSending(true);
    try {
      const dateStr = new Date(date).toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });
      const response = await axios.post('/api/admin/send-student-daily-schedule', {
        date: dateStr
      });

      if (response.data.success) {
        toast.success(`Email lịch học đã được gửi thành công cho ${response.data.data.emailsSent} người nhận!`, {
          position: 'top-right',
          autoClose: 5000,
        });
        
        // Show detailed stats
        const stats = response.data.data;
        setTimeout(() => {
          toast.info(`📊 Chi tiết: ${stats.totalStudents} học viên, ${stats.schedulesCount} lớp học, ${stats.classesWithSessions?.join(', ') || 'N/A'}`, {
            position: 'top-right',
            autoClose: 7000,
          });
        }, 1000);
      } else {
        throw new Error(response.data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error sending student email:', error);
      toast.error(error.response?.data?.message || 'Không thể gửi email cho học viên', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setEmailSending(false);
    }
  };

  // Generate calendar grid
  const generateCalendarGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    
    // Adjust for new day order: T2, T3, T4, T5, T6, T7, CN
    // Convert getDay() result to new order (0=CN, 1=T2, ..., 6=T7)
    const dayOfWeek = firstDay.getDay();
    const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // CN becomes 6, T2 becomes 0, etc.
    startDate.setDate(startDate.getDate() - adjustedDay);
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Generate distinct colors for each class with 6 main bright colors
  const getClassColor = (className) => {
    // Define 6 main bright colors as requested: Xanh lá cây, Xanh nõn chuối, Đỏ, Hồng, Cam, Tím
    const colors = [
      // 1. Xanh lá cây (Green) - Bright and vibrant
      {
        bg: 'bg-gradient-to-br from-green-400 to-green-600',
        text: 'text-white',
        border: 'border-green-500',
        shadow: 'shadow-green-200 dark:shadow-green-900',
        name: 'green'
      },
      // 2. Xanh nõn chuối (Lime) - Bright lime green
      {
        bg: 'bg-gradient-to-br from-lime-400 to-lime-600',
        text: 'text-white',
        border: 'border-lime-500',
        shadow: 'shadow-lime-200 dark:shadow-lime-900',
        name: 'lime'
      },
      // 3. Đỏ (Red) - Bright red
      {
        bg: 'bg-gradient-to-br from-red-400 to-red-600',
        text: 'text-white',
        border: 'border-red-500',
        shadow: 'shadow-red-200 dark:shadow-red-900',
        name: 'red'
      },
      // 4. Hồng (Pink) - Bright pink
      {
        bg: 'bg-gradient-to-br from-pink-400 to-pink-600',
        text: 'text-white',
        border: 'border-pink-500',
        shadow: 'shadow-pink-200 dark:shadow-pink-900',
        name: 'pink'
      },
      // 5. Cam (Orange) - Bright orange
      {
        bg: 'bg-gradient-to-br from-orange-400 to-orange-600',
        text: 'text-white',
        border: 'border-orange-500',
        shadow: 'shadow-orange-200 dark:shadow-orange-900',
        name: 'orange'
      },
      // 6. Tím (Purple) - Bright purple
      {
        bg: 'bg-gradient-to-br from-purple-400 to-purple-600',
        text: 'text-white',
        border: 'border-purple-500',
        shadow: 'shadow-purple-200 dark:shadow-purple-900',
        name: 'purple'
      }
    ];
    
    // Enhanced hash function for better distribution
    let hash = 0;
    for (let i = 0; i < className.length; i++) {
      hash = ((hash << 5) - hash + className.charCodeAt(i)) & 0xffffffff;
    }
    
    // Priority system: Xanh lá cây (0) và Xanh nõn chuối (1) are most important
    // 60% chance for green colors (index 0, 1), 40% for other colors (index 2-5)
    const isPriorityColor = Math.abs(hash) % 10 < 6; // 60% chance
    
    if (isPriorityColor) {
      // Use green colors (Xanh lá cây or Xanh nõn chuối)
      const greenIndex = Math.abs(hash) % 2; // 0 or 1
      return colors[greenIndex];
    } else {
      // Use other colors (Đỏ, Hồng, Cam, Tím)
      const otherIndex = 2 + (Math.abs(hash) % 4); // 2, 3, 4, or 5
      return colors[otherIndex];
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Sắp khai giảng':
        return 'bg-blue-100 text-blue-800';
      case 'Đang tuyển sinh':
        return 'bg-green-100 text-green-800';
      case 'Đã đầy':
        return 'bg-red-100 text-red-800';
      case 'Đã kết thúc':
        return 'bg-gray-100 text-gray-800';
      case 'Tạm hoãn':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calendarDays = generateCalendarGrid();
  const today = new Date();
  const isToday = (date) => {
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  return (
    <AdminLayout title="Quản lý lịch học hàng ngày">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6 border border-gray-100 dark:border-slate-700">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  📅 Quản lý lịch học
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Theo dõi và quản lý lịch học, tự động gửi email thông báo
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/dashboard/lich-hoc-hang-ngay/tao-moi">
                  <button className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transform hover:scale-105 transition-all duration-200 font-semibold shadow-lg flex items-center gap-2">
                    <FaCalendarAlt className="text-sm" />
                    Tạo lịch học mới
                  </button>
                </Link>
                <button
                  onClick={() => sendDailyEmail()}
                  disabled={emailSending}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 font-semibold shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaEnvelope className="text-sm" />
                  {emailSending ? 'Đang gửi...' : 'Gửi email admin'}
                </button>
                <button
                  onClick={() => sendStudentDailyEmail()}
                  disabled={emailSending}
                  className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transform hover:scale-105 transition-all duration-200 font-semibold shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaUsers className="text-sm" />
                  {emailSending ? 'Đang gửi...' : 'Gửi email học viên'}
                </button>
         
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-slate-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaCalendarAlt className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tổng buổi / Số lớp học</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalClasses}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-slate-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaUsers className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Học viên hiện tại</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalStudents || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-slate-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaUser className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Sức chứa</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCapacity}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-slate-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaClock className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tỷ lệ lấp đầy</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalCapacity > 0 ? Math.round((stats.totalStudents / stats.totalCapacity) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden">
            {/* Calendar Header */}
            <div className="p-6 border-b border-gray-200 dark:border-slate-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigateMonth(-1)}
                      className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={() => navigateMonth(1)}
                      className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="
                    px-6 py-3 text-sm font-bold 
                    bg-gradient-to-r from-blue-500 to-blue-600 
                    text-white rounded-xl shadow-lg
                    hover:from-blue-600 hover:to-blue-700 
                    hover:shadow-xl hover:scale-105
                    transform transition-all duration-200
                    border-2 border-blue-400
                    dark:from-blue-600 dark:to-blue-700
                    dark:hover:from-blue-700 dark:hover:to-blue-800
                    dark:border-blue-500
                  "
                >
                  📅 Hôm nay
                </button>
              </div>
              
            
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
              {/* Days of week header */}
              <div className="grid grid-cols-7 mb-4 gap-2">
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => (
                  <div key={day} className="
                    p-3 text-center text-sm font-semibold 
                    bg-gradient-to-br from-gray-100 to-gray-200 
                    dark:from-slate-700 dark:to-slate-600
                    text-gray-700 dark:text-gray-300
                    rounded-lg border border-gray-200 dark:border-slate-600
                    shadow-sm
                  ">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => {
                  const dayKey = formatDateForKey(day);
                  const daySchedules = calendarData[dayKey] || [];
                  const isCurrentMonthDay = isCurrentMonth(day);
                  const isTodayDay = isToday(day);

                  return (
                    <div
                      key={index}
                      className={`
                        min-h-[120px] p-3 border rounded-xl cursor-pointer transition-all duration-300
                        ${isCurrentMonthDay 
                          ? 'bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 hover:shadow-md hover:border-gray-300 dark:hover:border-slate-500' 
                          : 'bg-gray-50 dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-gray-400 dark:text-gray-500'
                        }
                        ${isTodayDay ? 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-lg' : ''}
                        group
                      `}
                      onClick={() => {
                        if (isCurrentMonthDay) {
                          fetchSchedulesForDate(day);
                        }
                      }}
                    >
                      <div className={`
                        text-lg font-bold mb-2 flex items-center justify-between
                        ${isTodayDay 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : isCurrentMonthDay 
                            ? 'text-gray-900 dark:text-white' 
                            : 'text-gray-400 dark:text-gray-500'
                        }
                      `}>
                        <span>{day.getDate()}</span>
                        {isTodayDay && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                      
                      {daySchedules.slice(0, 3).map((session, idx) => {
                        const classColor = getClassColor(session.className);
                        return (
                          <div
                            key={idx}
                            className={`
                              relative overflow-hidden mb-2 rounded-lg cursor-pointer 
                              transform hover:scale-105 hover:shadow-xl transition-all duration-300
                              ${classColor.bg} ${classColor.text} ${classColor.shadow}
                              border-2 ${classColor.border}
                              ${idx === 0 ? 'ring-2 ring-white/50 shadow-lg' : ''}
                              hover:ring-2 hover:ring-white/30
                            `}
                            title={`${session.className} - ${session.startTime} - ${session.endTime}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              // You can add click handler here if needed
                            }}
                          >
                            <div className="p-1">
                              <div className="flex items-center justify-between mb-1">
                                <div className="font-bold text-sm truncate flex-1">
                                  {session.sessionNumber ? `Buổi ${session.sessionNumber}` : 'Lớp học'}
                                </div>
                                <div className="w-2 h-2 rounded-full bg-white/80 ml-1 flex-shrink-0 animate-pulse"></div>
                              </div>
                              <div className="text-xs opacity-95 mb-1 font-semibold truncate">
                                {session.className}
                              </div>
                            
                              <div className="text-xs opacity-90 font-medium">
                                {session.startTime} - {session.endTime}
                              </div>
                            </div>
                            {/* Enhanced shimmer effect overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            {/* Subtle glow effect */}
                            <div className="absolute inset-0 rounded-lg shadow-inner opacity-20"></div>
                          </div>
                        );
                      })}
                      
                      {daySchedules.length > 3 && (
                        <div className="
                          mt-1 px-3 py-2 rounded-full 
                          bg-gradient-to-r from-green-500 to-emerald-600 
                          text-white text-xs font-bold
                          shadow-lg hover:shadow-xl
                          transform hover:scale-105
                          transition-all duration-200 cursor-pointer
                          border-2 border-white/20
                        ">
                          <div className="flex items-center justify-center">
                            <svg className="w-3 h-3 mr-1 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                            +{daySchedules.length - 3} buổi khác
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Selected Day Schedules */}
          {schedules.length > 0 && (
            <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
              <div className="p-6 border-b border-gray-200 dark:border-slate-600">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Lịch học chi tiết
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {schedules.map((session) => {
                    const classColor = getClassColor(session.className);
                    return (
                      <div
                        key={session._id}
                        className={`
                          relative overflow-hidden rounded-xl p-6 border-2 shadow-lg
                          ${classColor.bg} ${classColor.text} ${classColor.shadow}
                          border-2 ${classColor.border}
                          transform hover:scale-[1.02] transition-all duration-300
                        `}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-bold mb-2 text-white">
                              {session.sessionNumber ? `Buổi ${session.sessionNumber}` : 'Lớp học'}
                            </h4>
                            <p className="text-white/90 mb-1 font-semibold">
                              Lớp: {session.className}
                            </p>
                            <p className="text-white/80 text-sm mb-2">
                              Khóa học: {session.courseId?.title || 'N/A'}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(session.status)}`}>
                            {session.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-white/90">
                            <div className="text-sm font-semibold">{session.dayOfWeek}</div>
                            <div className="text-xs text-white/80">{session.startTime} - {session.endTime}</div>
                          </div>
                          <div className="text-white/90">
                            <span className="font-medium">{session.location}</span>
                          </div>
                          <div className="text-white/90">
                            <span className="font-medium">{session.currentStudents}/{session.maxStudents} học viên</span>
                          </div>
                        </div>

                        {session.instructor?.name && (
                          <div className="mt-4 p-4 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                            <div className="text-white">
                              <span className="font-semibold">Giảng viên: {session.instructor.name}</span>
                            </div>
                            {session.instructor.experience && (
                              <p className="text-sm text-white/80 mt-1">
                                {session.instructor.experience}
                              </p>
                            )}
                          </div>
                        )}

                        {session.sessionNumber && (
                          <div className="mt-3 p-3 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                            <div className="text-sm text-white">
                              <span className="font-semibold">Tiến độ khóa học:</span> Buổi {session.sessionNumber}/{session.totalSessions}
                              <div className="w-full bg-white/30 rounded-full h-2 mt-2">
                                <div 
                                  className="bg-white h-2 rounded-full shadow-sm" 
                                  style={{ 
                                    width: `${(session.sessionNumber / session.totalSessions) * 100}%` 
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Enhanced shimmer effect overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        {/* Subtle glow effect */}
                        <div className="absolute inset-0 rounded-xl shadow-inner opacity-20"></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        <ToastContainer />
      </div>
    </AdminLayout>
  );
}
