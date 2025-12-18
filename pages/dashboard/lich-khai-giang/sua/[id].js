import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import AdminLayout from '../../../../components/layout/AdminLayout';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSave, FaArrowLeft, FaPlus, FaTrash, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaUsers, FaTag } from 'react-icons/fa';

export default function EditClassSchedulePage() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    courseId: '',
    className: '',
    startDate: '',
    endDate: '',
    schedule: '',
    // Updated to new format
    classSessions: [], // Array of specific dates with times
    weeklyPattern: [{ dayOfWeek: 'Thứ 2', startTime: '19:00', endTime: '21:00' }], // Template for generating sessions
    totalSessions: '', // Number of sessions in the course (user input)
    location: '', // Single location string
    locations: [], // Array for model compatibility
    instructor: {
      name: '',
      experience: '',
      avatar: ''
    },
    maxStudents: '',
    currentStudents: 0,
    price: 0,
    discountPrice: 0,
    status: 'Sắp khai giảng',
    description: '',
    requirements: [''],
    benefits: ['']
  });

  const dayOptions = [
    'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'
  ];

  const statusOptions = [
    'Sắp khai giảng',
    'Đang tuyển sinh',
    'Đang diễn ra',
    'Đã đầy',
    'Đã kết thúc',
    'Tạm hoãn'
  ];

  const timeOptions = [];
  for (let hour = 6; hour <= 23; hour++) {
    for (let minute of ['00', '30']) {
      const time = `${hour.toString().padStart(2, '0')}:${minute}`;
      timeOptions.push(time);
    }
  }

  useEffect(() => {
    if (id) {
      fetchSchedule();
      fetchCourses();
    }
  }, [id]);

  // Debug formData changes
  useEffect(() => {
    console.log('🔍 FormData totalSessions changed:', formData.totalSessions);
  }, [formData.totalSessions]);

  // Helper function to generate sessions from pattern
  const generateSessionsFromPattern = (pattern, startDate, totalSessions) => {
    if (!pattern.length || !startDate || !totalSessions) return [];

    const sessions = [];
    const start = new Date(startDate);
    let currentDate = new Date(start);
    let sessionCount = 0;

    // Map Vietnamese day names to numbers (0 = Sunday)
    const dayMap = {
      'Chủ nhật': 0,
      'Thứ 2': 1,
      'Thứ 3': 2,
      'Thứ 4': 3,
      'Thứ 5': 4,
      'Thứ 6': 5,
      'Thứ 7': 6
    };

    while (sessionCount < totalSessions) {
      const currentDay = currentDate.getDay();
      
      // Check if current day matches any pattern day
      const matchingPattern = pattern.find(p => dayMap[p.dayOfWeek] === currentDay);
      
      if (matchingPattern) {
        sessions.push({
          sessionNumber: sessionCount + 1,
          date: new Date(currentDate).toISOString().split('T')[0],
          dayOfWeek: matchingPattern.dayOfWeek,
          startTime: matchingPattern.startTime,
          endTime: matchingPattern.endTime,
          dateString: new Date(currentDate).toLocaleDateString('vi-VN'),
        });
        sessionCount++;
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
      
      // Safety check to prevent infinite loop
      if (currentDate.getTime() - start.getTime() > 365 * 24 * 60 * 60 * 1000) {
        break;
      }
    }

    return sessions;
  };

  const fetchSchedule = async () => {
    try {
      setInitialLoading(true);
      const response = await axios.get(`/api/class-schedules/${id}`);
      const schedule = response.data.data;
      
      // Format dates for input fields
      const startDate = new Date(schedule.startDate).toISOString().split('T')[0];
      const endDate = new Date(schedule.endDate).toISOString().split('T')[0];
      
      // Convert old timeSlots to new format
      let classSessions = [];
      let weeklyPattern = [];
      let totalSessions = schedule.totalSessions || '';

      console.log('🔍 Schedule data from API:', {
        totalSessions: schedule.totalSessions,
        classSessions: schedule.classSessions,
        timeSlots: schedule.timeSlots
      });

      if (schedule.classSessions && schedule.classSessions.length > 0) {
        // New format - has classSessions
        classSessions = schedule.classSessions;
        // Use totalSessions from database, fallback to classSessions.length if not set
        totalSessions = schedule.totalSessions || classSessions.length;
        
        // Extract pattern from first few sessions
        const uniquePatterns = {};
        classSessions.forEach(session => {
          const key = `${session.dayOfWeek}-${session.startTime}-${session.endTime}`;
          if (!uniquePatterns[key]) {
            uniquePatterns[key] = {
              dayOfWeek: session.dayOfWeek,
              startTime: session.startTime,
              endTime: session.endTime
            };
          }
        });
        weeklyPattern = Object.values(uniquePatterns);
      } else if (schedule.timeSlots && schedule.timeSlots.length > 0) {
        // Old format - convert timeSlots to sessions
        weeklyPattern = schedule.timeSlots.filter(slot => 
          slot.dayOfWeek && slot.startTime && slot.endTime
        );
        
        // For old format, try to estimate totalSessions from timeSlots
        // or use a default value if not available
        if (!totalSessions) {
          totalSessions = 8; // Default fallback
        }
      } else {
        // Default pattern
        weeklyPattern = [{ dayOfWeek: 'Thứ 2', startTime: '19:00', endTime: '21:00' }];
        if (!totalSessions) {
          totalSessions = 8; // Default fallback
        }
      }

      console.log('🔍 Loading schedule data:', {
        scheduleTotalSessions: schedule.totalSessions,
        calculatedTotalSessions: totalSessions,
        classSessionsLength: classSessions.length,
        scheduleMaxStudents: schedule.maxStudents
      });

      setFormData({
        courseId: schedule.courseId?._id || schedule.courseId || '',
        className: schedule.className || '',
        startDate: startDate,
        endDate: endDate,
        schedule: schedule.schedule || '',
        classSessions: classSessions,
        weeklyPattern: weeklyPattern.length > 0 ? weeklyPattern : [{ dayOfWeek: 'Thứ 2', startTime: '19:00', endTime: '21:00' }],
        totalSessions: totalSessions,
        locations: schedule.locations || [],
        instructor: {
          name: schedule.instructor?.name || '',
          experience: schedule.instructor?.experience || '',
          avatar: schedule.instructor?.avatar || ''
        },
    maxStudents: schedule.maxStudents || '',
    currentStudents: schedule.currentStudents || 0,
    price: 0, // Không sử dụng học phí cho lịch học hàng ngày
    discountPrice: 0,
    status: schedule.status || 'Sắp khai giảng',
        description: schedule.description || '',
        requirements: schedule.requirements && schedule.requirements.length > 0 
          ? schedule.requirements 
          : [''],
        benefits: schedule.benefits && schedule.benefits.length > 0 
          ? schedule.benefits 
          : ['']
      });
    } catch (error) {
      console.error('Error fetching schedule:', error);
      toast.error('Không thể tải thông tin lịch khai giảng', {
        position: 'top-right',
        autoClose: 3000,
      });
      router.push('/dashboard/lich-khai-giang');
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses');
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Không thể tải danh sách khóa học', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Skip totalSessions - handled by handleTotalSessionsChange
    if (name === 'totalSessions') {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInstructorChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      instructor: {
        ...prev.instructor,
        [name]: value
      }
    }));
  };

  const handleWeeklyPatternChange = (index, field, value) => {
    const newPattern = [...formData.weeklyPattern];
    newPattern[index][field] = value;
    
    // Generate schedule summary first
    const validSlots = newPattern.filter(slot => slot.dayOfWeek && slot.startTime && slot.endTime);
    let scheduleSummary = '';
    if (validSlots.length > 0) {
      scheduleSummary = validSlots.map(slot => 
        `${slot.dayOfWeek} (${slot.startTime}-${slot.endTime})`
      ).join(', ');
    }
    
    setFormData(prev => ({
      ...prev,
      weeklyPattern: newPattern,
      schedule: scheduleSummary
    }));
    
    // Auto-generate class sessions if we have start date
    if (formData.startDate && formData.totalSessions) {
      generateClassSessions(newPattern, formData.startDate, formData.totalSessions);
    }
  };

  const generateScheduleSummary = (pattern) => {
    const validSlots = pattern.filter(slot => slot.dayOfWeek && slot.startTime && slot.endTime);
    if (validSlots.length > 0) {
      const summary = validSlots.map(slot => 
        `${slot.dayOfWeek} (${slot.startTime}-${slot.endTime})`
      ).join(', ');
      setFormData(prev => ({ ...prev, schedule: summary }));
    }
  };

  const generateClassSessions = (pattern, startDate, totalSessions) => {
    console.log('🔄 generateClassSessions called:', { pattern, startDate, totalSessions });
    
    if (!pattern.length || !startDate || !totalSessions) {
      console.log('❌ Missing required data for generateClassSessions');
      return;
    }

    const sessions = generateSessionsFromPattern(pattern, startDate, totalSessions);
    console.log('✅ Generated sessions:', sessions);

    setFormData(prev => ({
      ...prev,
      classSessions: sessions,
      endDate: sessions.length > 0 ? sessions[sessions.length - 1].date : prev.endDate
    }));
  };

  const addWeeklyPattern = () => {
    console.log('➕ addWeeklyPattern called');
    const newPattern = [...formData.weeklyPattern, { dayOfWeek: 'Thứ 2', startTime: '19:00', endTime: '21:00' }];
    
    // Generate schedule summary
    const validSlots = newPattern.filter(slot => slot.dayOfWeek && slot.startTime && slot.endTime);
    let scheduleSummary = '';
    if (validSlots.length > 0) {
      scheduleSummary = validSlots.map(slot => 
        `${slot.dayOfWeek} (${slot.startTime}-${slot.endTime})`
      ).join(', ');
    }
    
    console.log('📝 New schedule summary:', scheduleSummary);
    
    setFormData(prev => ({
      ...prev,
      weeklyPattern: newPattern,
      schedule: scheduleSummary
    }));
    
    // Auto-generate class sessions if we have start date and total sessions
    console.log('🔍 Checking conditions for generateClassSessions:', {
      startDate: formData.startDate,
      totalSessions: formData.totalSessions,
      hasStartDate: !!formData.startDate,
      hasTotalSessions: !!formData.totalSessions,
      totalSessionsValue: formData.totalSessions
    });
    
    if (formData.startDate && formData.totalSessions && formData.totalSessions > 0) {
      console.log('✅ Calling generateClassSessions from addWeeklyPattern');
      generateClassSessions(newPattern, formData.startDate, formData.totalSessions);
    } else {
      console.log('❌ Not calling generateClassSessions - missing data');
    }
  };

  const removeWeeklyPattern = (index) => {
    if (formData.weeklyPattern.length > 1) {
      const newPattern = formData.weeklyPattern.filter((_, i) => i !== index);
      
      // Generate schedule summary
      const validSlots = newPattern.filter(slot => slot.dayOfWeek && slot.startTime && slot.endTime);
      let scheduleSummary = '';
      if (validSlots.length > 0) {
        scheduleSummary = validSlots.map(slot => 
          `${slot.dayOfWeek} (${slot.startTime}-${slot.endTime})`
        ).join(', ');
      }
      
      setFormData(prev => ({
        ...prev,
        weeklyPattern: newPattern,
        schedule: scheduleSummary
      }));
      
      if (formData.startDate && formData.totalSessions) {
        generateClassSessions(newPattern, formData.startDate, formData.totalSessions);
      }
    }
  };

  const handleTotalSessionsChange = (e) => {
    console.log('🔥 handleTotalSessionsChange called!', e.target.value); // Debug log
    
    const value = e.target.value;
    const totalSessions = value === '' ? '' : parseInt(value) || 0;
    
    console.log('Total sessions changed:', { value, totalSessions }); // Debug log
    
    setFormData(prev => {
      console.log('Setting totalSessions to:', totalSessions);
      return { ...prev, totalSessions };
    });
    
    if (formData.startDate && formData.weeklyPattern.length && totalSessions > 0) {
      generateClassSessions(formData.weeklyPattern, formData.startDate, totalSessions);
    }
  };

  const handleStartDateChange = (e) => {
    const startDate = e.target.value;
    setFormData(prev => ({ ...prev, startDate }));
    
    if (startDate && formData.weeklyPattern.length && formData.totalSessions > 0) {
      generateClassSessions(formData.weeklyPattern, startDate, formData.totalSessions);
    }
  };

  const removeClassSession = (index) => {
    const newSessions = formData.classSessions.filter((_, i) => i !== index);
    setFormData(prev => ({ 
      ...prev, 
      classSessions: newSessions.map((session, i) => ({ ...session, sessionNumber: i + 1 })),
      endDate: newSessions.length > 0 ? newSessions[newSessions.length - 1].date : prev.endDate
    }));
  };

  const editClassSession = (index, field, value) => {
    const newSessions = [...formData.classSessions];
    newSessions[index][field] = value;
    
    if (field === 'date') {
      // Update dateString when date changes
      newSessions[index].dateString = new Date(value).toLocaleDateString('vi-VN');
      // Update dayOfWeek
      const dayMap = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
      newSessions[index].dayOfWeek = dayMap[new Date(value).getDay()];
    }
    
    setFormData(prev => ({ 
      ...prev, 
      classSessions: newSessions,
      endDate: newSessions.length > 0 ? newSessions[newSessions.length - 1].date : prev.endDate
    }));
  };

  const handleTimeSlotChange = (index, field, value) => {
    const newTimeSlots = [...formData.timeSlots];
    newTimeSlots[index][field] = value;
    setFormData(prev => ({
      ...prev,
      timeSlots: newTimeSlots
    }));
  };

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, { dayOfWeek: '', startTime: '', endTime: '' }]
    }));
  };

  const removeTimeSlot = (index) => {
    if (formData.timeSlots.length > 1) {
      const newTimeSlots = formData.timeSlots.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        timeSlots: newTimeSlots
      }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        [field]: newArray
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.courseId) {
      toast.error('Vui lòng chọn khóa học', { position: 'top-right' });
      return;
    }
    
    if (!formData.className.trim()) {
      toast.error('Vui lòng nhập tên lớp học', { position: 'top-right' });
      return;
    }
    
    if (!formData.startDate) {
      toast.error('Vui lòng chọn ngày bắt đầu', { position: 'top-right' });
      return;
    }
    
    if (!formData.totalSessions || formData.totalSessions < 1) {
      toast.error('Vui lòng nhập số buổi học (tối thiểu 1 buổi)', { position: 'top-right' });
      return;
    }
    
    if (!formData.location || !formData.location.trim()) {
      toast.error('Vui lòng chọn địa điểm học', { position: 'top-right' });
      return;
    }
    
    if (!formData.instructor.name.trim()) {
      toast.error('Vui lòng nhập tên giảng viên', { position: 'top-right' });
      return;
    }

    setLoading(true);
    try {
      // Clean up form data
      const submitData = {
        ...formData,
        // Convert classSessions to timeSlots format for backend compatibility
        timeSlots: formData.classSessions.map(session => ({
          dayOfWeek: session.dayOfWeek,
          startTime: session.startTime,
          endTime: session.endTime,
          date: session.date // Include specific date
        })),
        location: formData.location.trim(), // Keep for backward compatibility
        locations: [formData.location.trim()], // Convert to array for model
        requirements: formData.requirements.filter(req => req.trim()),
        benefits: formData.benefits.filter(benefit => benefit.trim()),
        price: 0, // Không sử dụng học phí cho lịch học hàng ngày
        discountPrice: 0,
        // Additional session info
        totalSessions: formData.totalSessions,
        classSessions: formData.classSessions,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate)
      };
      
      // Remove UI-only fields
      delete submitData.weeklyPattern;

      await axios.put(`/api/class-schedules/${id}`, submitData);
      
      toast.success('Cập nhật lịch khai giảng thành công!', {
        position: 'top-right',
        autoClose: 3000,
      });
      
      router.push('/dashboard/lich-khai-giang');
      
    } catch (error) {
      console.error('Error updating schedule:', error);
      toast.error('Không thể cập nhật lịch khai giảng', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <AdminLayout title="Sửa lịch khai giảng">
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Đang tải dữ liệu...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Sửa lịch khai giảng">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
        <div className="p-6 max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 mb-6 border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Sửa lịch khai giảng
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Cập nhật thông tin lịch khai giảng
                </p>
              </div>
              <Link href="/dashboard/lich-khai-giang">
                <button className="bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-all duration-200 font-semibold shadow-lg flex items-center gap-2">
                  <FaArrowLeft className="text-sm" />
                  Quay lại
                </button>
              </Link>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-slate-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Khóa học <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  >
                    <option value="">Chọn khóa học</option>
                    {courses.map(course => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tên lớp học <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="className"
                    value={formData.className}
                    onChange={handleInputChange}
                    required
                    placeholder="VD: MC Cơ bản - Lớp 1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                </div>
              </div>

              {/* Date Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ngày bắt đầu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleStartDateChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Số buổi học theo pattern <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="totalSessions"
                    value={formData.totalSessions || ''}
                    onChange={handleTotalSessionsChange}
                    required
                    min="1"
                    max="100"
                    placeholder="Nhập số buổi (VD: 8, 10, 12...)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    📚 Nhập số buổi học chính theo khóa học. Mỗi khóa có thể có số buổi khác nhau (8-20 buổi phổ biến)
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ngày kết thúc (tự động)
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 dark:bg-slate-600 dark:border-slate-600 dark:text-white cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Schedule Section */}
              <div className="border-b border-gray-200 dark:border-slate-600 pb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaClock className="text-green-600" />
                  Lịch học
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tóm tắt lịch học (tự động tạo)
                    </label>
                    <input
                      type="text"
                      name="schedule"
                      value={formData.schedule}
                      onChange={handleInputChange}
                      readOnly
                      placeholder="Sẽ tự động tạo từ pattern bên dưới"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 dark:bg-slate-600 dark:border-slate-600 dark:text-white cursor-not-allowed"
                    />
                  </div>

                  {/* Weekly Pattern */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        🔄 Pattern lịch học hàng tuần <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={addWeeklyPattern}
                        className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                      >
                        <FaPlus className="text-sm" />
                        Thêm ngày
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {formData.weeklyPattern.map((slot, index) => (
                        <div key={index} className="flex gap-3 items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <select
                            value={slot.dayOfWeek}
                            onChange={(e) => handleWeeklyPatternChange(index, 'dayOfWeek', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                          >
                            {dayOptions.map(day => (
                              <option key={day} value={day}>{day}</option>
                            ))}
                          </select>
                          
                          <select
                            value={slot.startTime}
                            onChange={(e) => handleWeeklyPatternChange(index, 'startTime', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                          >
                            {timeOptions.map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                          
                          <span className="text-gray-500">đến</span>
                          
                          <select
                            value={slot.endTime}
                            onChange={(e) => handleWeeklyPatternChange(index, 'endTime', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                          >
                            {timeOptions.map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                          
                          {formData.weeklyPattern.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeWeeklyPattern(index)}
                              className="text-red-600 hover:text-red-700 p-2"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                      💡 <strong>Hướng dẫn:</strong> Thiết lập pattern lịch học hàng tuần (VD: Thứ 2, 4, 6). 
                      Hệ thống sẽ tự động tạo {formData.totalSessions} buổi học cụ thể từ ngày bắt đầu.
                    </div>
                  </div>

                  {/* Generated Class Sessions */}
                  {formData.classSessions.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          📅 Danh sách các buổi học cụ thể ({formData.classSessions.length}/{formData.totalSessions} buổi)
                        </label>
                        <div className="text-sm text-gray-500">
                          Bạn có thể chỉnh sửa từng buổi học nếu cần
                        </div>
                      </div>
                      
                      <div className="max-h-96 overflow-y-auto space-y-2 border border-gray-200 dark:border-slate-600 rounded-lg p-4">
                        {formData.classSessions.map((session, index) => (
                          <div key={index} className="flex gap-3 items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                            <div className="flex-shrink-0 w-16 text-center">
                              <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-sm font-medium rounded-full">
                                {session.sessionNumber}
                              </span>
                            </div>
                            
                            <input
                              type="date"
                              value={session.date}
                              onChange={(e) => editClassSession(index, 'date', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                            />
                            
                            <span className="text-sm text-gray-500 w-20">{session.dayOfWeek}</span>
                            
                            <select
                              value={session.startTime}
                              onChange={(e) => editClassSession(index, 'startTime', e.target.value)}
                              className="w-24 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                            >
                              {timeOptions.map(time => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                            
                            <span className="text-gray-500">-</span>
                            
                            <select
                              value={session.endTime}
                              onChange={(e) => editClassSession(index, 'endTime', e.target.value)}
                              className="w-24 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                            >
                              {timeOptions.map(time => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                            
                            <button
                              type="button"
                              onClick={() => removeClassSession(index)}
                              className="text-red-600 hover:text-red-700 p-2"
                              title="Xóa buổi học này"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-3 text-sm text-green-600 dark:text-green-400">
                        ✅ Đã tạo {formData.classSessions.length} buổi học từ {formData.classSessions[0]?.dateString} đến {formData.classSessions[formData.classSessions.length - 1]?.dateString}
                      </div>
                    </div>
                  )}
                  
                  {formData.startDate && formData.totalSessions > 0 && formData.weeklyPattern.length > 0 && formData.classSessions.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg">
                      <div className="text-gray-500 dark:text-gray-400">
                        <FaCalendarAlt className="mx-auto text-4xl mb-4" />
                        <p className="text-lg font-medium mb-2">Chưa có buổi học nào được tạo</p>
                        <p className="text-sm">Hãy điều chỉnh pattern lịch học hoặc ngày bắt đầu để tự động tạo lịch</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Location, Instructor and Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Địa điểm học <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={(e) => {
                      setFormData(prev => ({ 
                        ...prev, 
                        location: e.target.value,
                        locations: e.target.value ? [e.target.value] : []
                      }));
                    }}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  >
                    <option value="">Chọn địa điểm học</option>
                    <option value="Số 1 Nguyễn Văn Linh, phường Bắc Giang, tỉnh Bắc Ninh">
                      Số 1 Nguyễn Văn Linh, phường Bắc Giang, tỉnh Bắc Ninh
                    </option>
                    <option value="Học online">Học online</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tên giảng viên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.instructor.name}
                    onChange={handleInstructorChange}
                    required
                    placeholder="VD: MC Minh Tuấn"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Trạng thái
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Students */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Số học viên tối đa
                  </label>
                  <input
                    type="number"
                    name="maxStudents"
                    value={formData.maxStudents}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Số học viên hiện tại
                  </label>
                  <input
                    type="number"
                    name="currentStudents"
                    value={formData.currentStudents}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Mô tả về lớp học..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>

              {/* Requirements */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Yêu cầu
                  </label>
                  <button
                    type="button"
                    onClick={() => addArrayItem('requirements')}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                  >
                    <FaPlus className="text-sm" />
                    Thêm yêu cầu
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                        placeholder="Yêu cầu..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      />
                      {formData.requirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('requirements', index)}
                          className="bg-red-600 text-white px-3 py-3 rounded-xl hover:bg-red-700 transition-colors duration-200"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Lợi ích
                  </label>
                  <button
                    type="button"
                    onClick={() => addArrayItem('benefits')}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                  >
                    <FaPlus className="text-sm" />
                    Thêm lợi ích
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                        placeholder="Lợi ích..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      />
                      {formData.benefits.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('benefits', index)}
                          className="bg-red-600 text-white px-3 py-3 rounded-xl hover:bg-red-700 transition-colors duration-200"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-slate-600">
                <Link href="/dashboard/lich-khai-giang">
                  <button
                    type="button"
                    className="px-6 py-3 bg-gray-300 dark:bg-slate-600 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-400 dark:hover:bg-slate-500 transition-colors duration-200 font-medium"
                  >
                    Hủy
                  </button>
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <FaSave className="text-sm" />
                      Cập nhật lịch khai giảng
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </AdminLayout>
  );
}
