import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';
import ClassScheduleCard from './ClassScheduleCard';

const CalendarView = ({ year, month, onMonthChange }) => {
  const [calendarData, setCalendarData] = useState({});
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  useEffect(() => {
    fetchCalendarData();
  }, [year, month]);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/class-schedules/calendar?year=${year}&month=${month}`);
      const data = await response.json();
      
      if (data.success) {
        setCalendarData(data.data.calendarData);
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const formatDate = (day) => {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getDateKey = (day) => {
    return formatDate(day);
  };

  const navigateMonth = (direction) => {
    let newYear = year;
    let newMonth = month;
    
    if (direction === 'prev') {
      newMonth--;
      if (newMonth < 1) {
        newMonth = 12;
        newYear--;
      }
    } else {
      newMonth++;
      if (newMonth > 12) {
        newMonth = 1;
        newYear++;
      }
    }
    
    onMonthChange(newYear, newMonth);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-16 md:h-24 border border-gray-200 bg-gray-50"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = getDateKey(day);
      const daySchedules = calendarData[dateKey] || [];
      const isToday = new Date().toDateString() === new Date(year, month - 1, day).toDateString();
      const isSelected = selectedDate === dateKey;
      const hasSchedules = daySchedules.length > 0;

      days.push(
        <div
          key={day}
          className={`h-16 md:h-24 border border-gray-200 p-1 cursor-pointer transition-all duration-200 ${
            isToday 
              ? 'bg-blue-50 border-blue-300 shadow-md' 
              : hasSchedules 
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 hover:shadow-lg hover:scale-105' 
                : 'hover:bg-gray-50'
          } ${isSelected ? 'bg-green-100 border-green-400 shadow-lg ring-2 ring-green-300' : ''}`}
          onClick={() => setSelectedDate(isSelected ? null : dateKey)}
        >
          <div className="flex justify-between items-start mb-1">
            <span className={`text-xs md:text-sm font-medium ${
              isToday 
                ? 'text-blue-600 font-bold' 
                : hasSchedules 
                  ? 'text-green-700 font-semibold' 
                  : 'text-gray-700'
            }`}>
              {day}
            </span>
            {hasSchedules && (
              <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center shadow-sm font-bold">
                {daySchedules.length}
              </span>
            )}
          </div>
          
          {hasSchedules && (
            <div className="space-y-0.5 md:space-y-1">
              {daySchedules.slice(0, 1).map((schedule, index) => (
                <div
                  key={index}
                  className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-1 py-0.5 rounded-md truncate font-medium shadow-sm"
                  title={schedule.className}
                >
                  {schedule.className}
                </div>
              ))}
              {daySchedules.length > 1 && (
                <div className="text-xs text-green-600 font-medium">
                  +{daySchedules.length - 1} khác
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 md:space-x-4">
          <FaCalendarAlt className="text-green-600 text-lg md:text-xl" />
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">
            {monthNames[month - 1]} {year}
          </h2>
        </div>
        
        <div className="flex items-center space-x-1 md:space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <FaChevronLeft className="text-gray-600 text-sm md:text-base" />
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <FaChevronRight className="text-gray-600 text-sm md:text-base" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="p-3 md:p-4 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          <div className="text-center bg-green-50 rounded-lg p-2 md:p-3">
            <div className="text-lg md:text-2xl font-bold text-green-600">{stats.totalClasses}</div>
            <div className="text-xs md:text-sm text-gray-600">Lớp học</div>
          </div>
          <div className="text-center bg-blue-50 rounded-lg p-2 md:p-3">
            <div className="text-lg md:text-2xl font-bold text-blue-600">{stats.totalStudents}</div>
            <div className="text-xs md:text-sm text-gray-600">Học viên</div>
          </div>
          <div className="text-center bg-purple-50 rounded-lg p-2 md:p-3">
            <div className="text-lg md:text-2xl font-bold text-purple-600">{stats.totalCapacity}</div>
            <div className="text-xs md:text-sm text-gray-600">Tổng sức chứa</div>
          </div>
          <div className="text-center bg-orange-50 rounded-lg p-2 md:p-3">
            <div className="text-lg md:text-2xl font-bold text-orange-600">
              {Math.round((stats.totalStudents / stats.totalCapacity) * 100) || 0}%
            </div>
            <div className="text-xs md:text-sm text-gray-600">Tỷ lệ đăng ký</div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-2 md:p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-0 mb-1 md:mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs md:text-sm font-medium text-gray-600 py-1 md:py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-0">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && calendarData[selectedDate] && (
        <div className="p-3 md:p-4 border-t border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
            📅 Lịch khai giảng ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {calendarData[selectedDate].map((schedule) => (
              <ClassScheduleCard key={schedule._id} schedule={schedule} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
