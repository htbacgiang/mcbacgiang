import React from "react";
import TeacherCard from "./TeacherCard";

const TeachersSection = ({ teachers, title = "Đội ngũ giảng viên", subtitle = "Những chuyên gia hàng đầu trong lĩnh vực MC và truyền thông" }) => {
  return (
    <section className="py-8 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 uppercase">
            {title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-rose-500 mx-auto mb-1"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Teachers Grid */}
        {teachers && teachers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teachers.map((teacher, index) => (
              <TeacherCard key={teacher.id || index} teacher={teacher} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Đang cập nhật thông tin giảng viên...</p>
          </div>
        )}

      
      </div>
    </section>
  );
};

export default TeachersSection;
