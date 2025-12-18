import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../../components/layout/AdminLayout';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSave, FaArrowLeft, FaPlus, FaTrash, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaUsers, FaTag } from 'react-icons/fa';
import { locationOptions } from '../../../utils/locationMapping';

export default function CreateClassSchedulePage() {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    courseId: '',
    className: '',
    startDate: '',
    endDate: '',
    schedule: '',
    // Updated to new format with multiple patterns
    classSessions: [], // Array of specific dates with times
    weeklyPattern: [{ dayOfWeek: 'Thứ 2', startTime: '19:00', endTime: '21:00' }], // Main weekly pattern
    additionalSessions: [], // Extra sessions outside of pattern
    totalSessions: '', // Number of sessions in the course (user input)
    locations: [],
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
    fetchCourses();
    
    // Force reset totalSessions to empty on mount
    setFormData(prev => ({
      ...prev,
      totalSessions: ''
    }));
  }, []);

  // Debug effect to check formData values
  useEffect(() => {
    console.log('FormData totalSessions:', formData.totalSessions);
    console.log('FormData maxStudents:', formData.maxStudents);
  }, [formData.totalSessions, formData.maxStudents]);

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

  // Helper function to generate sessions from pattern
  const generateSessionsFromPattern = (pattern, startDate, totalSessions, additionalSessions = []) => {
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

    // First, add sessions from weekly pattern
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
          type: 'pattern' // Mark as pattern-generated
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

    // Then, add additional sessions (sorted by date)
    const sortedAdditional = [...additionalSessions].sort((a, b) => new Date(a.date) - new Date(b.date));
    sortedAdditional.forEach((additional) => {
      if (additional.date) { // Only add if date is specified
        sessions.push({
          ...additional,
          sessionNumber: sessions.length + 1,
          dateString: new Date(additional.date).toLocaleDateString('vi-VN'),
          type: 'additional' // Mark as additional session
        });
      }
    });

    // Re-number all sessions by date order
    const sortedSessions = sessions.sort((a, b) => new Date(a.date) - new Date(b.date));
    return sortedSessions.map((session, index) => ({
      ...session,
      sessionNumber: index + 1
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
      
      // Add additional sessions info if any
      const additionalCount = formData.additionalSessions.filter(s => s.date).length;
      if (additionalCount > 0) {
        scheduleSummary += ` + ${additionalCount} buổi bổ sung`;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      weeklyPattern: newPattern,
      schedule: scheduleSummary
    }));
    
    // Auto-generate class sessions if we have start date
    if (formData.startDate && formData.totalSessions && formData.totalSessions > 0) {
      generateClassSessions(newPattern, formData.startDate, formData.totalSessions, formData.additionalSessions);
    }
  };

  const generateScheduleSummary = (pattern) => {
    const validSlots = pattern.filter(slot => slot.dayOfWeek && slot.startTime && slot.endTime);
    if (validSlots.length > 0) {
      const summary = validSlots.map(slot => 
        `${slot.dayOfWeek} (${slot.startTime}-${slot.endTime})`
      ).join(', ');
      
      // Add additional sessions info if any
      const additionalCount = formData.additionalSessions.filter(s => s.date).length;
      const finalSummary = additionalCount > 0 
        ? `${summary} + ${additionalCount} buổi bổ sung`
        : summary;
      
      setFormData(prev => ({ ...prev, schedule: finalSummary }));
    }
  };

  const generateClassSessions = (pattern, startDate, totalSessions, additionalSessions) => {
    const sessions = generateSessionsFromPattern(pattern, startDate, totalSessions, additionalSessions);

    setFormData(prev => ({
      ...prev,
      classSessions: sessions,
      endDate: sessions.length > 0 ? sessions[sessions.length - 1].date : prev.endDate
    }));
  };

  const addWeeklyPattern = () => {
    console.log('➕ addWeeklyPattern called (create page)');
    const newPattern = [...formData.weeklyPattern, { dayOfWeek: 'Thứ 2', startTime: '19:00', endTime: '21:00' }];
    
    // Generate schedule summary
    const validSlots = newPattern.filter(slot => slot.dayOfWeek && slot.startTime && slot.endTime);
    let scheduleSummary = '';
    if (validSlots.length > 0) {
      scheduleSummary = validSlots.map(slot => 
        `${slot.dayOfWeek} (${slot.startTime}-${slot.endTime})`
      ).join(', ');
      
      // Add additional sessions info if any
      const additionalCount = formData.additionalSessions.filter(s => s.date).length;
      if (additionalCount > 0) {
        scheduleSummary += ` + ${additionalCount} buổi bổ sung`;
      }
    }
    
    console.log('📝 New schedule summary (create page):', scheduleSummary);
    
    setFormData(prev => ({
      ...prev,
      weeklyPattern: newPattern,
      schedule: scheduleSummary
    }));
    
    // Auto-generate class sessions if we have start date and total sessions
    console.log('🔍 Checking conditions for generateClassSessions (create page):', {
      startDate: formData.startDate,
      totalSessions: formData.totalSessions,
      hasStartDate: !!formData.startDate,
      hasTotalSessions: !!formData.totalSessions,
      totalSessionsValue: formData.totalSessions
    });
    
    if (formData.startDate && formData.totalSessions && formData.totalSessions > 0) {
      console.log('✅ Calling generateClassSessions from addWeeklyPattern (create page)');
      generateClassSessions(newPattern, formData.startDate, formData.totalSessions, formData.additionalSessions);
    } else {
      console.log('❌ Not calling generateClassSessions - missing data (create page)');
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
        
        // Add additional sessions info if any
        const additionalCount = formData.additionalSessions.filter(s => s.date).length;
        if (additionalCount > 0) {
          scheduleSummary += ` + ${additionalCount} buổi bổ sung`;
        }
      }
      
      setFormData(prev => ({
        ...prev,
        weeklyPattern: newPattern,
        schedule: scheduleSummary
      }));
      
      if (formData.startDate && formData.totalSessions && formData.totalSessions > 0) {
        generateClassSessions(newPattern, formData.startDate, formData.totalSessions, formData.additionalSessions);
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
      generateClassSessions(formData.weeklyPattern, formData.startDate, totalSessions, formData.additionalSessions);
    }
  };

  const handleStartDateChange = (e) => {
    const startDate = e.target.value;
    setFormData(prev => ({ ...prev, startDate }));
    
    if (startDate && formData.weeklyPattern.length && formData.totalSessions && formData.totalSessions > 0) {
      generateClassSessions(formData.weeklyPattern, startDate, formData.totalSessions, formData.additionalSessions);
    }
  };

  // Additional Sessions Management
  const addAdditionalSession = () => {
    const newSession = {
      date: '',
      dayOfWeek: 'Thứ 2',
      startTime: '19:00',
      endTime: '21:00'
    };
    
    setFormData(prev => ({
      ...prev,
      additionalSessions: [...prev.additionalSessions, newSession]
    }));
  };

  const removeAdditionalSession = (index) => {
    const newAdditional = formData.additionalSessions.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      additionalSessions: newAdditional
    }));
    
    // Regenerate sessions
    if (formData.startDate && formData.weeklyPattern.length && formData.totalSessions && formData.totalSessions > 0) {
      generateClassSessions(formData.weeklyPattern, formData.startDate, formData.totalSessions, newAdditional);
    }
    
    // Update summary
    generateScheduleSummary(formData.weeklyPattern);
  };

  const editAdditionalSession = (index, field, value) => {
    const newAdditional = [...formData.additionalSessions];
    newAdditional[index][field] = value;
    
    if (field === 'date') {
      // Update dayOfWeek when date changes
      const dayMap = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
      newAdditional[index].dayOfWeek = dayMap[new Date(value).getDay()];
    }
    
    setFormData(prev => ({
      ...prev,
      additionalSessions: newAdditional
    }));
    
    // Regenerate sessions
    if (formData.startDate && formData.weeklyPattern.length && formData.totalSessions && formData.totalSessions > 0) {
      generateClassSessions(formData.weeklyPattern, formData.startDate, formData.totalSessions, newAdditional);
    }
    
    // Update summary
    generateScheduleSummary(formData.weeklyPattern);
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
    
    // Validate weekly pattern
    const validPattern = formData.weeklyPattern.filter(slot => 
      slot.dayOfWeek && slot.startTime && slot.endTime
    );
    if (validPattern.length === 0) {
      toast.error('Vui lòng thiết lập ít nhất một lịch học trong tuần', { position: 'top-right' });
      return;
    }
    
    // Validate class sessions
    if (formData.classSessions.length === 0) {
      toast.error('Vui lòng tạo danh sách các buổi học cụ thể', { position: 'top-right' });
      return;
    }
    
    // Validate time logic for each session
    const invalidSessions = formData.classSessions.filter(session => session.startTime >= session.endTime);
    if (invalidSessions.length > 0) {
      toast.error(`Có ${invalidSessions.length} buổi học có thời gian kết thúc không hợp lệ`, { position: 'top-right' });
      return;
    }
    
    if (!formData.locations || formData.locations.length === 0) {
      toast.error('Vui lòng chọn ít nhất một địa điểm học', { position: 'top-right' });
      return;
    }
    
    if (!formData.instructor.name.trim()) {
      toast.error('Vui lòng nhập tên giảng viên', { position: 'top-right' });
      return;
    }

    // Validate maxStudents and price
    const maxStudentsNum = formData.maxStudents ? Number(formData.maxStudents) : 20;
    const priceNum = formData.price ? Number(formData.price) : 0;
    
    if (!formData.endDate) {
      toast.error('Vui lòng đợi hệ thống tạo ngày kết thúc từ lịch học', { position: 'top-right' });
      return;
    }

    // Ensure schedule is generated from weeklyPattern if it's empty
    let finalSchedule = formData.schedule;
    if (!finalSchedule || !finalSchedule.trim()) {
      const validSlots = formData.weeklyPattern.filter(slot => 
        slot.dayOfWeek && slot.startTime && slot.endTime
      );
      if (validSlots.length > 0) {
        finalSchedule = validSlots.map(slot => 
          `${slot.dayOfWeek} (${slot.startTime}-${slot.endTime})`
        ).join(', ');
        
        // Add additional sessions info if any
        const additionalCount = formData.additionalSessions.filter(s => s.date).length;
        if (additionalCount > 0) {
          finalSchedule += ` + ${additionalCount} buổi bổ sung`;
        }
      } else {
        toast.error('Vui lòng thiết lập lịch học để tạo schedule', { position: 'top-right' });
        return;
      }
    }

    // Validate schedule
    if (!finalSchedule || !finalSchedule.trim()) {
      toast.error('Vui lòng thiết lập lịch học', { position: 'top-right' });
      return;
    }

    setLoading(true);
    try {
      // Clean up form data
      const submitData = {
        ...formData,
        schedule: finalSchedule, // Use the generated schedule
        // Convert classSessions to timeSlots format for backend compatibility
        timeSlots: formData.classSessions.map(session => ({
          dayOfWeek: session.dayOfWeek,
          startTime: session.startTime,
          endTime: session.endTime,
          date: session.date // Include specific date
        })),
        requirements: formData.requirements.filter(req => req.trim()),
        benefits: formData.benefits.filter(benefit => benefit.trim()),
        // Additional session info
        totalSessions: Number(formData.totalSessions),
        classSessions: formData.classSessions,
        additionalSessions: formData.additionalSessions,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        // Ensure numbers are properly converted
        maxStudents: maxStudentsNum,
        currentStudents: Number(formData.currentStudents) || 0,
        price: priceNum,
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : 0
      };
      
      // Remove UI-only fields
      delete submitData.weeklyPattern;

      console.log('Submitting data:', submitData);
      await axios.post('/api/class-schedules', submitData);
      
      toast.success('Tạo lịch khai giảng thành công!', {
        position: 'top-right',
        autoClose: 3000,
      });
      
      // Reset form
      setFormData({
        courseId: '',
        className: '',
        startDate: '',
        endDate: '',
        schedule: '',
        classSessions: [],
        weeklyPattern: [{ dayOfWeek: 'Thứ 2', startTime: '19:00', endTime: '21:00' }],
        additionalSessions: [],
        totalSessions: '',
        locations: [],
        instructor: {
          name: '',
          experience: '',
          avatar: ''
        },
        maxStudents: 20,
        currentStudents: 0,
        price: 0,
        discountPrice: 0,
        status: 'Sắp khai giảng',
        description: '',
        requirements: [''],
        benefits: ['']
      });
      
    } catch (error) {
      console.error('Error creating schedule:', error);
      console.error('Error response:', error?.response?.data);
      const message = error?.response?.data?.message || error?.response?.data?.error || 'Không thể tạo lịch khai giảng';
      toast.error(message, {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Thêm lịch khai giảng">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
        <div className="p-6  mx-auto">
          {/* Header Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 mb-6 border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Thêm lịch khai giảng mới
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Tạo lịch khai giảng cho khóa học
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
                    value={formData.totalSessions}
                    onChange={handleTotalSessionsChange}
                    required
                    min="1"
                    max="100"
                    placeholder="Nhập số buổi (VD: 8, 10, 12...)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    key={`totalSessions-${formData.totalSessions}`}
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
                      Hệ thống sẽ tự động tạo {formData.totalSessions || '[X]'} buổi học cụ thể từ ngày bắt đầu.
                    </div>
                  </div>

                  {/* Additional Sessions */}
                      <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        ➕ Buổi học bổ sung (ngoài pattern)
                        </label>
                      <button
                        type="button"
                        onClick={addAdditionalSession}
                        className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2"
                      >
                        <FaPlus className="text-sm" />
                        Thêm buổi bổ sung
                      </button>
                    </div>
                    
                    {formData.additionalSessions.length > 0 && (
                      <div className="space-y-3">
                        {formData.additionalSessions.map((session, index) => (
                          <div key={index} className="flex gap-3 items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <input
                              type="date"
                              value={session.date}
                              onChange={(e) => editAdditionalSession(index, 'date', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                            />
                            
                            <span className="text-sm text-gray-500 w-20">{session.dayOfWeek}</span>
                            
                            <select
                              value={session.startTime}
                              onChange={(e) => editAdditionalSession(index, 'startTime', e.target.value)}
                              className="w-24 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                            >
                              {timeOptions.map(time => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                            
                            <span className="text-gray-500">-</span>
                            
                            <select
                              value={session.endTime}
                              onChange={(e) => editAdditionalSession(index, 'endTime', e.target.value)}
                              className="w-24 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                            >
                              {timeOptions.map(time => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                            
                            <button
                              type="button"
                              onClick={() => removeAdditionalSession(index)}
                              className="text-red-600 hover:text-red-700 p-2"
                              title="Xóa buổi bổ sung này"
                            >
                              <FaTrash />
                            </button>
                      </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-3 text-sm text-purple-600 dark:text-purple-400">
                      💡 <strong>Gợi ý:</strong> Dùng buổi bổ sung cho lịch đặc biệt như buổi thực hành, thi cử, hoặc make-up class.
                    </div>
                  </div>

                  {/* Generated Class Sessions */}
                  {formData.classSessions.length > 0 && (
                      <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          📅 Danh sách tất cả buổi học ({formData.classSessions.length} buổi)
                        </label>
                        <div className="text-sm text-gray-500">
                          Bạn có thể chỉnh sửa từng buổi học nếu cần
                        </div>
                      </div>
                      
                      <div className="max-h-96 overflow-y-auto space-y-2 border border-gray-200 dark:border-slate-600 rounded-lg p-4">
                        {formData.classSessions.map((session, index) => (
                          <div key={index} className={`flex gap-3 items-center p-3 rounded-lg border ${
                            session.type === 'additional' 
                              ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
                              : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                          }`}>
                            <div className="flex-shrink-0 w-16 text-center">
                              <span className={`inline-flex items-center justify-center w-8 h-8 text-sm font-medium rounded-full ${
                                session.type === 'additional'
                                  ? 'bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200'
                                  : 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200'
                              }`}>
                                {session.sessionNumber}
                              </span>
                            </div>
                            
                        <input
                              type="date"
                              value={session.date}
                              onChange={(e) => editClassSession(index, 'date', e.target.value)}
                              className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-600 dark:border-slate-500 dark:text-white ${
                                session.type === 'additional' ? 'focus:ring-purple-500' : 'focus:ring-green-500'
                              }`}
                            />
                            
                            <span className="text-sm text-gray-500 w-20">{session.dayOfWeek}</span>
                            
                            <select
                              value={session.startTime}
                              onChange={(e) => editClassSession(index, 'startTime', e.target.value)}
                              className={`w-24 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-600 dark:border-slate-500 dark:text-white ${
                                session.type === 'additional' ? 'focus:ring-purple-500' : 'focus:ring-green-500'
                              }`}
                            >
                              {timeOptions.map(time => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                            
                            <span className="text-gray-500">-</span>
                            
                            <select
                              value={session.endTime}
                              onChange={(e) => editClassSession(index, 'endTime', e.target.value)}
                              className={`w-24 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-slate-600 dark:border-slate-500 dark:text-white ${
                                session.type === 'additional' ? 'focus:ring-purple-500' : 'focus:ring-green-500'
                              }`}
                            >
                              {timeOptions.map(time => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                            
                            <div className="text-xs text-gray-500 w-16 text-center">
                              {session.type === 'additional' ? '📝 Bổ sung' : '🔄 Pattern'}
                      </div>
                      
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
                        ✅ Tổng cộng {formData.classSessions.length} buổi học 
                        ({formData.classSessions.filter(s => s.type === 'pattern').length} buổi pattern + 
                        {formData.classSessions.filter(s => s.type === 'additional').length} buổi bổ sung)
                        {formData.classSessions.length > 0 && (
                          <span> từ {formData.classSessions[0]?.dateString} đến {formData.classSessions[formData.classSessions.length - 1]?.dateString}</span>
                        )}
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

              {/* Location and Instructor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Địa điểm học Q&amp;K Bắc Giang <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    {locationOptions.map((loc) => {
                      const optionId = `location-${loc.code.replace(/[^a-zA-Z0-9]/g, '-')}`;
                      const isChecked = formData.locations.includes(loc.code);
                      return (
                        <div key={loc.code} className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id={optionId}
                            checked={isChecked}
                            onChange={(e) => {
                              const newLocations = e.target.checked
                                ? [...formData.locations, loc.code]
                                : formData.locations.filter((code) => code !== loc.code);
                              setFormData((prev) => ({ ...prev, locations: newLocations }));
                            }}
                            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={optionId} className="text-sm text-gray-700 dark:text-gray-300">
                            <div className="font-medium">{loc.name}</div>
                            <div className="text-xs text-gray-500">{loc.address}</div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
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

              {/* Instructor Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    placeholder="VD: MC Hồng Quyên"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kinh nghiệm
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.instructor.experience}
                    onChange={handleInstructorChange}
                    placeholder="VD: 10 năm kinh nghiệm MC tại VTV"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Avatar giảng viên
                  </label>
                  <input
                    type="url"
                    name="avatar"
                    value={formData.instructor.avatar}
                    onChange={handleInstructorChange}
                    placeholder="URL hình ảnh"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                </div>
              </div>

              {/* Students and Price */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                    placeholder="VD: 20 học viên"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    Số lượng học viên tối đa có thể đăng ký lớp này
                  </div>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Học phí (VNĐ)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="5000000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Học phí ưu đãi (VNĐ)
                  </label>
                  <input
                    type="number"
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="4500000"
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
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <FaSave className="text-sm" />
                      Tạo lịch khai giảng
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
