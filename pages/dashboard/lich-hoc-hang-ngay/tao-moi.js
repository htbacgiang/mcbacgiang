import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../../components/layout/AdminLayout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FaSave, 
  FaArrowLeft, 
  FaPlus, 
  FaTrash, 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaUser, 
  FaUsers, 
  FaTag,
  FaEnvelope,
  FaEye
} from 'react-icons/fa';

export default function CreateDailySchedulePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  
  const [formData, setFormData] = useState({
    courseId: '',
    className: '',
    startDate: '',
    endDate: '',
    schedule: '',
    // Changed to specific class sessions instead of recurring time slots
    classSessions: [], // Array of specific dates with times
    weeklyPattern: [{ dayOfWeek: 'Thứ 2', startTime: '19:00', endTime: '21:00' }], // Template for generating sessions
    totalSessions: 10, // Number of sessions in the course
    location: '',
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
    benefits: [''],
    sendEmailAfterCreate: true
  });

  const dayOptions = [
    'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'
  ];

  const statusOptions = [
    'Sắp khai giảng',
    'Đang tuyển sinh', 
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
  }, []);

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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    const course = courses.find(c => c._id === courseId);
    setSelectedCourse(course);
    
    setFormData(prev => ({
      ...prev,
      courseId,
      className: course ? `${course.title} - Lớp ${new Date().getFullYear()}` : '',
      price: course ? (course.price || 0) : 0,
      description: course ? course.description : ''
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
    setFormData(prev => ({
      ...prev,
      weeklyPattern: newPattern
    }));
    
    // Auto-generate schedule summary
    generateScheduleSummary(newPattern);
    
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
    if (!pattern.length || !startDate || !totalSessions) return;

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

    // Get target days of week from pattern
    const targetDays = pattern.map(p => dayMap[p.dayOfWeek]).sort();

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

    setFormData(prev => ({
      ...prev,
      classSessions: sessions,
      endDate: sessions.length > 0 ? sessions[sessions.length - 1].date : prev.endDate
    }));
  };

  const addWeeklyPattern = () => {
    setFormData(prev => ({
      ...prev,
      weeklyPattern: [...prev.weeklyPattern, { dayOfWeek: 'Thứ 2', startTime: '19:00', endTime: '21:00' }]
    }));
  };

  const removeWeeklyPattern = (index) => {
    if (formData.weeklyPattern.length > 1) {
      const newPattern = formData.weeklyPattern.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        weeklyPattern: newPattern
      }));
      generateScheduleSummary(newPattern);
      if (formData.startDate && formData.totalSessions) {
        generateClassSessions(newPattern, formData.startDate, formData.totalSessions);
      }
    }
  };

  const handleTotalSessionsChange = (e) => {
    const totalSessions = parseInt(e.target.value) || 0;
    setFormData(prev => ({ ...prev, totalSessions }));
    
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

  const handleArrayFieldChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field, index) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.courseId) errors.push('Vui lòng chọn khóa học');
    if (!formData.className.trim()) errors.push('Vui lòng nhập tên lớp học');
    if (!formData.startDate) errors.push('Vui lòng chọn ngày bắt đầu');
    if (!formData.location.trim()) errors.push('Vui lòng nhập địa điểm học');
    if (!formData.instructor.name.trim()) errors.push('Vui lòng nhập tên giảng viên');
    if (formData.maxStudents < 1) errors.push('Số học viên tối đa phải lớn hơn 0');
    if (formData.totalSessions < 1) errors.push('Số buổi học phải lớn hơn 0');
    
    // Validate weekly pattern
    const validPattern = formData.weeklyPattern.filter(slot => 
      slot.dayOfWeek && slot.startTime && slot.endTime
    );
    if (validPattern.length === 0) {
      errors.push('Vui lòng thiết lập ít nhất một lịch học trong tuần');
    }
    
    // Validate class sessions
    if (formData.classSessions.length === 0) {
      errors.push('Vui lòng tạo danh sách các buổi học cụ thể');
    } else if (formData.classSessions.length !== formData.totalSessions) {
      errors.push(`Số buổi học được tạo (${formData.classSessions.length}) không khớp với số buổi đã nhập (${formData.totalSessions})`);
    }
    
    // Validate time logic for each session
    formData.classSessions.forEach((session, index) => {
      if (session.startTime >= session.endTime) {
        errors.push(`Buổi ${session.sessionNumber}: Thời gian kết thúc phải sau thời gian bắt đầu`);
      }
    });
    
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error, { position: 'top-right', autoClose: 3000 }));
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Ensure endDate is set from classSessions if not already set
      let endDate = formData.endDate;
      if (!endDate && formData.classSessions.length > 0) {
        endDate = formData.classSessions[formData.classSessions.length - 1].date;
      }
      
      // Ensure schedule is set
      let schedule = formData.schedule;
      if (!schedule || schedule.trim() === '') {
        // Generate schedule from classSessions if not set
        const scheduleParts = formData.classSessions.slice(0, 3).map(s => 
          `${s.dayOfWeek} (${s.startTime}-${s.endTime})`
        );
        schedule = scheduleParts.join(', ');
        if (formData.classSessions.length > 3) {
          schedule += `, ... (+${formData.classSessions.length - 3} buổi khác)`;
        }
      }
      
      // Clean up form data
      const submitData = {
        courseId: formData.courseId,
        className: formData.className.trim(),
        startDate: formData.startDate,
        endDate: endDate || formData.startDate, // Fallback to startDate if endDate is missing
        schedule: schedule.trim(),
        location: formData.location.trim(), // Keep for backward compatibility
        locations: [formData.location.trim()], // Convert to array for model
        instructor: {
          name: formData.instructor.name.trim(),
          experience: formData.instructor.experience?.trim() || '',
          avatar: formData.instructor.avatar?.trim() || ''
        },
        maxStudents: Number(formData.maxStudents),
        currentStudents: Number(formData.currentStudents) || 0,
        price: 0, // Không sử dụng học phí cho lịch học hàng ngày
        discountPrice: 0,
        status: formData.status,
        description: formData.description?.trim() || '',
        requirements: formData.requirements.filter(req => req.trim()),
        benefits: formData.benefits.filter(benefit => benefit.trim()),
        // Convert classSessions to timeSlots format for backend compatibility
        timeSlots: formData.classSessions.map(session => ({
          dayOfWeek: session.dayOfWeek,
          startTime: session.startTime,
          endTime: session.endTime,
          date: session.date // Include specific date
        })),
        // Additional session info
        totalSessions: Number(formData.totalSessions),
        classSessions: formData.classSessions
      };
      
      // Validate all required fields are present
      if (!submitData.courseId) {
        throw new Error('Vui lòng chọn khóa học');
      }
      if (!submitData.className) {
        throw new Error('Vui lòng nhập tên lớp học');
      }
      if (!submitData.startDate) {
        throw new Error('Vui lòng chọn ngày bắt đầu');
      }
      if (!submitData.endDate) {
        throw new Error('Vui lòng chọn ngày kết thúc');
      }
      if (!submitData.schedule) {
        throw new Error('Vui lòng thiết lập lịch học');
      }
      if (!submitData.location) {
        throw new Error('Vui lòng nhập địa điểm học');
      }
      if (!submitData.instructor.name) {
        throw new Error('Vui lòng nhập tên giảng viên');
      }
      if (!submitData.maxStudents || submitData.maxStudents < 1) {
        throw new Error('Số học viên tối đa phải lớn hơn 0');
      }
      
      const response = await axios.post('/api/admin/class-schedules', submitData);
      
      if (response.data.success) {
        toast.success('Lịch học đã được tạo thành công!', {
          position: 'top-right',
          autoClose: 3000,
        });
        
        // Send email notification if requested
        if (formData.sendEmailAfterCreate) {
          try {
            await axios.post('/api/admin/send-daily-schedule', {
              date: formData.startDate
            });
            toast.success('Email thông báo đã được gửi!', {
              position: 'top-right',
              autoClose: 3000,
            });
          } catch (emailError) {
            console.error('Email sending failed:', emailError);
            toast.warning('Lịch học đã tạo nhưng gửi email thất bại', {
              position: 'top-right',
              autoClose: 5000,
            });
          }
        }
        
        // Redirect after success
        setTimeout(() => {
          router.push('/dashboard/lich-hoc-hang-ngay');
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating schedule:', error);
      console.error('Error details:', error.response?.data);
      
      let errorMessage = 'Có lỗi xảy ra khi tạo lịch học';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại các trường bắt buộc.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Bạn cần đăng nhập để thực hiện thao tác này.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Bạn không có quyền thực hiện thao tác này.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    if (!validateForm()) return;
    setPreviewMode(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  if (previewMode) {
    return (
      <AdminLayout title="Xem trước lịch học">
        <div className="min-h-screen ">
          <div className=" max-w-6xl mx-auto">
            {/* Preview Header */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg mb-6 py-4 px-4 border border-gray-100 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Xem trước lịch học
                </h1>
                <div className="flex gap-3">
                  <button
                    onClick={() => setPreviewMode(false)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors duration-200"
                  >
                    Quay lại chỉnh sửa
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
                  >
                    <FaSave />
                    {loading ? 'Đang tạo...' : 'Xác nhận tạo'}
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Content */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-slate-700">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
                    📋 Thông tin cơ bản
                  </h3>
                  <div className="space-y-2">
                    <p><strong>Tên lớp:</strong> {formData.className}</p>
                    <p><strong>Khóa học:</strong> {selectedCourse?.title}</p>
                    <p><strong>Ngày bắt đầu:</strong> {formatDate(formData.startDate)}</p>
                    <p><strong>Ngày kết thúc:</strong> {formatDate(formData.endDate)}</p>
                    <p><strong>Trạng thái:</strong> <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{formData.status}</span></p>
                  </div>
                </div>

                {/* Schedule Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
                    ⏰ Lịch học
                  </h3>
                  <div className="space-y-2">
                    <p><strong>Tóm tắt:</strong> {formData.schedule}</p>
                    <p><strong>Địa điểm:</strong> {formData.location}</p>
                    <div>
                      <strong>Tổng số buổi học:</strong> {formData.totalSessions} buổi
                    </div>
                    <div>
                      <strong>Danh sách các buổi học:</strong>
                      <div className="mt-2 max-h-48 overflow-y-auto space-y-2">
                        {formData.classSessions.slice(0, 5).map((session, index) => (
                          <div key={index} className="text-sm bg-gray-100 dark:bg-slate-700 p-2 rounded flex justify-between">
                            <span>Buổi {session.sessionNumber}: {session.dateString}</span>
                            <span>{session.startTime} - {session.endTime}</span>
                          </div>
                        ))}
                        {formData.classSessions.length > 5 && (
                          <div className="text-sm text-gray-500 text-center py-2">
                            ... và {formData.classSessions.length - 5} buổi khác
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instructor Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
                    👨‍🏫 Giảng viên
                  </h3>
                  <div className="space-y-2">
                    <p><strong>Tên:</strong> {formData.instructor.name}</p>
                    {formData.instructor.experience && (
                      <p><strong>Kinh nghiệm:</strong> {formData.instructor.experience}</p>
                    )}
                  </div>
                </div>

                {/* Student Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
                    👥 Học viên
                  </h3>
                  <div className="space-y-2">
                    <p><strong>Sức chứa:</strong> {formData.maxStudents} học viên</p>
                    <p><strong>Đã đăng ký:</strong> {formData.currentStudents} học viên</p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              {(formData.description || formData.requirements.some(r => r.trim()) || formData.benefits.some(b => b.trim())) && (
                <div className="mt-6 pt-6 border-t">
                  {formData.description && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">📝 Mô tả:</h4>
                      <p className="text-gray-600 dark:text-gray-300">{formData.description}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.requirements.some(r => r.trim()) && (
                      <div>
                        <h4 className="font-semibold mb-2">📋 Yêu cầu:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {formData.requirements.filter(r => r.trim()).map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {formData.benefits.some(b => b.trim()) && (
                      <div>
                        <h4 className="font-semibold mb-2">🎯 Lợi ích:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {formData.benefits.filter(b => b.trim()).map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Email notification notice */}
              {formData.sendEmailAfterCreate && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <FaEnvelope />
                    <span className="font-medium">Email thông báo sẽ được gửi tự động sau khi tạo lịch học.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Tạo lịch học mới">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
        <div className=" max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6 border border-gray-100 dark:border-slate-700">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  ➕ Tạo lịch học mới
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Tạo lịch học mới cho hệ thống quản lý BT Academy
                </p>
              </div>
              <div className="flex gap-3">
                <Link href="/dashboard/lich-hoc-hang-ngay">
                  <button className="bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2">
                    <FaArrowLeft />
                    Quay lại
                  </button>
                </Link>
                <button
                  type="button"
                  onClick={handlePreview}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <FaEye />
                  Xem trước
                </button>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-slate-700">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Basic Information Section */}
              <div className="border-b border-gray-200 dark:border-slate-600 pb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaTag className="text-blue-600" />
                  Thông tin cơ bản
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Khóa học <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="courseId"
                      value={formData.courseId}
                      onChange={handleCourseChange}
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
                      placeholder="VD: MC Cơ bản - Lớp 2024"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    />
                  </div>

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
                      Số buổi học <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="totalSessions"
                      value={formData.totalSessions}
                      onChange={handleTotalSessionsChange}
                      required
                      min="1"
                      max="50"
                      placeholder="Ví dụ: 10"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    />
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Địa điểm học <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
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

              {/* Instructor Section */}
              <div className="border-b border-gray-200 dark:border-slate-600 pb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaUser className="text-purple-600" />
                  Thông tin giảng viên
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      placeholder="VD: Thầy Nguyễn Văn A"
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
                      placeholder="VD: 10 năm kinh nghiệm trong lĩnh vực MC"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Students Section */}
              <div className="border-b border-gray-200 dark:border-slate-600 pb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaUsers className="text-orange-600" />
                  Học viên
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Số học viên tối đa <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="maxStudents"
                      value={formData.maxStudents}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Đã đăng ký
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
              </div>

              {/* Additional Information Section */}
              <div className="border-b border-gray-200 dark:border-slate-600 pb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  📝 Thông tin bổ sung
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mô tả lớp học
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Mô tả chi tiết về lớp học..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Requirements */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Yêu cầu tham gia
                        </label>
                        <button
                          type="button"
                          onClick={() => addArrayField('requirements')}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          <FaPlus className="inline mr-1" /> Thêm
                        </button>
                      </div>
                      <div className="space-y-2">
                        {formData.requirements.map((req, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={req}
                              onChange={(e) => handleArrayFieldChange('requirements', index, e.target.value)}
                              placeholder="VD: Có thiết bị ghi âm"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            />
                            {formData.requirements.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeArrayField('requirements', index)}
                                className="text-red-600 hover:text-red-700 p-2"
                              >
                                <FaTrash />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Benefits */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Lợi ích nhận được
                        </label>
                        <button
                          type="button"
                          onClick={() => addArrayField('benefits')}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          <FaPlus className="inline mr-1" /> Thêm
                        </button>
                      </div>
                      <div className="space-y-2">
                        {formData.benefits.map((benefit, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={benefit}
                              onChange={(e) => handleArrayFieldChange('benefits', index, e.target.value)}
                              placeholder="VD: Nhận chứng chỉ hoàn thành"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            />
                            {formData.benefits.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeArrayField('benefits', index)}
                                className="text-red-600 hover:text-red-700 p-2"
                              >
                                <FaTrash />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Notification Section */}
              <div className="border-b border-gray-200 dark:border-slate-600 pb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaEnvelope className="text-blue-600" />
                  Thông báo Email
                </h3>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="sendEmailAfterCreate"
                      checked={formData.sendEmailAfterCreate}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        Gửi email thông báo sau khi tạo lịch học
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Email sẽ được gửi tự động đến tất cả quản trị viên thông báo về lịch học mới được tạo
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Section */}
              <div className="flex justify-end gap-4 pt-6">
                <Link href="/dashboard/lich-hoc-hang-ngay">
                  <button 
                    type="button"
                    className="bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
                  >
                    <FaArrowLeft />
                    Hủy
                  </button>
                </Link>
                
                <button
                  type="button"
                  onClick={handlePreview}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <FaEye />
                  Xem trước
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaSave />
                  {loading ? 'Đang tạo...' : 'Tạo lịch học'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <ToastContainer />
      </div>
    </AdminLayout>
  );
}
