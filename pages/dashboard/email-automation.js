import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/layout/AdminLayout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FaClock, 
  FaEnvelope, 
  FaUsers, 
  FaToggleOn, 
  FaToggleOff,
  FaSave,
  FaSync,
  FaCog,
  FaCalendarAlt
} from 'react-icons/fa';

export default function EmailAutomationSettings() {
  const [settings, setSettings] = useState({
    dailyStudentEmail: {
      enabled: false,
      time: "07:00",
      timezone: "Asia/Ho_Chi_Minh",
      lastRun: null,
      nextRun: null
    },
    dailyAdminEmail: {
      enabled: false,
      time: "08:00",
      timezone: "Asia/Ho_Chi_Minh",
      lastRun: null,
      nextRun: null
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch current settings
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/schedule-automation');
      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Không thể tải cài đặt', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (type, updates) => {
    setSaving(true);
    try {
      const response = await axios.post('/api/admin/schedule-automation', {
        type,
        ...updates
      });

      if (response.data.success) {
        setSettings(prev => ({
          ...prev,
          [type]: response.data.data
        }));
        
        toast.success('Cài đặt đã được cập nhật!', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error(error.response?.data?.message || 'Không thể cập nhật cài đặt', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (type) => {
    const currentEnabled = settings[type]?.enabled || false;
    updateSetting(type, { enabled: !currentEnabled });
  };

  const handleTimeChange = (type, time) => {
    setSettings(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        time
      }
    }));
  };

  const saveTimeSettings = (type) => {
    updateSetting(type, { 
      time: settings[type].time,
      enabled: settings[type].enabled 
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Chưa có';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  if (loading) {
    return (
      <AdminLayout title="Cài đặt Email Tự động">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Cài đặt Email Tự động">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
        <div className="p-6 max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6 border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  ⚙️ Cài đặt Email Tự động
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Quản lý việc gửi email lịch học hàng ngày tự động
                </p>
              </div>
              <button
                onClick={fetchSettings}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
              >
                <FaSync className={`text-sm ${loading ? 'animate-spin' : ''}`} />
                Làm mới
              </button>
            </div>
          </div>

          {/* Email Settings Cards */}
          <div className="space-y-6">
            {/* Student Email Settings */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                      <FaUsers className="text-purple-600 dark:text-purple-300 text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Email cho Học viên
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Gửi lịch học cá nhân cho từng học viên và phụ huynh
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('dailyStudentEmail')}
                    disabled={saving}
                    className="text-3xl transition-colors duration-200 disabled:opacity-50"
                  >
                    {settings.dailyStudentEmail?.enabled ? (
                      <FaToggleOn className="text-green-500" />
                    ) : (
                      <FaToggleOff className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaClock className="inline mr-2" />
                      Thời gian gửi hàng ngày
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="time"
                        value={settings.dailyStudentEmail?.time || '07:00'}
                        onChange={(e) => handleTimeChange('dailyStudentEmail', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                      />
                      <button
                        onClick={() => saveTimeSettings('dailyStudentEmail')}
                        disabled={saving}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50"
                      >
                        <FaSave />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Trạng thái
                    </label>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Lần chạy cuối:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatDateTime(settings.dailyStudentEmail?.lastRun)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Lần chạy tiếp theo:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatDateTime(settings.dailyStudentEmail?.nextRun)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">
                    📋 Thông tin gửi email học viên:
                  </h4>
                  <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                    <li>• Email sẽ được gửi cho từng học viên theo lớp học của họ</li>
                    <li>• Với khóa MC nhí, email có thể gửi cho phụ huynh tùy theo cài đặt</li>
                    <li>• Chỉ gửi cho học viên có trạng thái &quot;Đang học&quot; và đồng ý nhận email</li>
                    <li>• Nội dung email được cá nhân hóa theo từng học viên</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Admin Email Settings */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                      <FaEnvelope className="text-blue-600 dark:text-blue-300 text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Email cho Admin
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Gửi tổng hợp lịch học cho các quản trị viên
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('dailyAdminEmail')}
                    disabled={saving}
                    className="text-3xl transition-colors duration-200 disabled:opacity-50"
                  >
                    {settings.dailyAdminEmail?.enabled ? (
                      <FaToggleOn className="text-green-500" />
                    ) : (
                      <FaToggleOff className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaClock className="inline mr-2" />
                      Thời gian gửi hàng ngày
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="time"
                        value={settings.dailyAdminEmail?.time || '08:00'}
                        onChange={(e) => handleTimeChange('dailyAdminEmail', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                      />
                      <button
                        onClick={() => saveTimeSettings('dailyAdminEmail')}
                        disabled={saving}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                      >
                        <FaSave />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Trạng thái
                    </label>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Lần chạy cuối:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatDateTime(settings.dailyAdminEmail?.lastRun)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Lần chạy tiếp theo:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatDateTime(settings.dailyAdminEmail?.nextRun)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                    📋 Thông tin gửi email admin:
                  </h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Email sẽ được gửi cho tất cả admin có quyền truy cập</li>
                    <li>• Chứa tổng hợp tất cả lịch học trong ngày</li>
                    <li>• Bao gồm thống kê số lớp, học viên, giảng viên</li>
                    <li>• Giúp admin theo dõi tổng quan hoạt động hàng ngày</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Setup Instructions */}
          <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <FaCog className="mr-2" />
              Hướng dẫn thiết lập Cron Job
            </h3>
            
            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                🚀 Để email tự động hoạt động, bạn cần thiết lập cron job:
              </h4>
              
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <div>
                  <strong>1. Cài đặt dependencies:</strong>
                  <div className="bg-gray-800 text-green-400 p-2 rounded mt-1 font-mono">
                    npm install node-cron axios
                  </div>
                </div>
                
                <div>
                  <strong>2. Chạy script thiết lập:</strong>
                  <div className="bg-gray-800 text-green-400 p-2 rounded mt-1 font-mono">
                    node scripts/daily-email-cron.js setup
                  </div>
                </div>
                
                <div>
                  <strong>3. Hoặc thêm vào crontab của server:</strong>
                  <div className="bg-gray-800 text-green-400 p-2 rounded mt-1 font-mono">
                    0 7 * * * cd /path/to/project && node scripts/daily-email-cron.js test-student<br/>
                    0 8 * * * cd /path/to/project && node scripts/daily-email-cron.js test-admin
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Lưu ý:</strong> Cần cấu hình các biến môi trường ADMIN_EMAIL, ADMIN_PASSWORD trong file .env để script có thể xác thực.
            </div>
          </div>
        </div>

        <ToastContainer />
      </div>
    </AdminLayout>
  );
}
