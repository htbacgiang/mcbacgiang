import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toCloudinaryUrl } from '../../utils/cloudinary';
import { Calendar, Clock, MapPin, User, Users } from 'lucide-react';
import RegistrationPopup from './RegistrationPopup';

const ClassScheduleCard = ({ schedule }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const formatDate = (date) => {
    if (!date) return 'Chưa có thông tin';
    try {
      let dateObj;
      if (typeof date === 'string') {
        // Handle ISO string or YYYY-MM-DD format
        if (date.includes('T')) {
          dateObj = new Date(date);
        } else {
          // YYYY-MM-DD format - add time to avoid timezone issues
          dateObj = new Date(date + 'T00:00:00');
        }
      } else if (date instanceof Date) {
        dateObj = date;
      } else {
        // Try to parse as date
        dateObj = new Date(date);
      }
      
      if (isNaN(dateObj.getTime())) return 'Chưa có thông tin';
      
      return dateObj.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error, date);
      return 'Chưa có thông tin';
    }
  };

  const formatTime = (time) => {
    return time.slice(0, 5); // Remove seconds if present
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Sắp khai giảng':
        return 'bg-blue-100 text-blue-800';
      case 'Đang tuyển sinh':
        return 'bg-pink-100 text-pink-800';
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

  const slug = schedule?.courseId?.slug;
  const computedSlug = slug || (schedule?.courseId?.title ? schedule.courseId.title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-') : '');

  // Format location display
  const formatLocation = (location) => {
    if (!location) {
      const locations = schedule.locations && schedule.locations.length > 0 ? schedule.locations[0] : null;
      if (!locations) return 'Chưa có địa điểm';
      location = locations;
    }
    
    if (location === 'Học online') {
      return 'Học online';
    }
    
    if (location.includes('Nguyễn Văn Linh') || location.includes('Bắc Giang')) {
      return 'Trung tâm MC Q&K Bắc Giang - Số 1 Nguyễn Văn Linh, Phường Bắc Giang, tỉnh Bắc Ninh';
    }
    
    return location;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      {/* Course Image */}
      <div className="relative h-48 w-full">
        <Image
          src={toCloudinaryUrl(schedule.courseId?.image)}
          alt={schedule.courseId?.title || 'Khóa học'}
          fill
          className="object-cover rounded-t-lg"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
            {schedule.status}
          </span>
        </div>
        {schedule.discountPrice && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              -{schedule.discountPercentage}%
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Course Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {schedule.courseId?.title || 'Khóa học'}
        </h3>
        
        {/* Class Name */}
        <h4 className="text-md font-medium text-gray-700 mb-3">
          {schedule.className}
        </h4>

        {/* Schedule Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-green-600" />
            <span>Khai giảng: {formatDate(schedule.startDate || schedule.date || schedule.classSessions?.[0]?.date)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2 text-green-600" />
            <span>{schedule.schedule || 'Chưa có lịch học'}</span>
          </div>
          
          <div className="flex items-start text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
            <span>{formatLocation(schedule.location)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-2 text-green-600" />
            <span>{schedule.instructor?.name || 'Chưa có thông tin'}</span>
          </div>
        </div>

        {/* Time Slots */}
        {schedule.timeSlots && schedule.timeSlots.length > 0 && (
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Lịch học:</h5>
            <div className="space-y-1">
              {schedule.timeSlots.map((slot, index) => (
                <div key={index} className="flex justify-between text-xs text-gray-600">
                  <span>{slot.dayOfWeek}</span>
                  <span>{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Students Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2 text-pink-600" />
            <span>{schedule.currentStudents || 0}/{schedule.maxStudents} học viên</span>
          </div>
          <div className="text-sm text-gray-500">
            Còn {schedule.availableSpots || (schedule.maxStudents - (schedule.currentStudents || 0))} chỗ
          </div>
        </div>

        {/* Price hidden as requested */}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Link
            href={`/khoa-hoc/${computedSlug}`}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-center py-2 px-4 rounded-lg transition-colors duration-200 text-sm font-medium"
          >
            Xem chi tiết
          </Link>
          <button
            onClick={handleOpenPopup}
            className="flex-1 bg-pink-600 hover:bg-pink-700 text-white text-center py-2 px-4 rounded-lg transition-colors duration-200 text-sm font-medium"
          >
            Đăng ký ngay
          </button>
        </div>
      </div>
      
      {/* Registration Popup */}
      <RegistrationPopup 
        isOpen={isPopupOpen} 
        onClose={handleClosePopup}
        courseSlug={schedule?.courseId?.slug}
      />
    </div>
  );
};

export default ClassScheduleCard;
