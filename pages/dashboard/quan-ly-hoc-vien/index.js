import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import AdminLayout from "../../../components/layout/AdminLayout";

import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  UserPlus,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
} from "lucide-react";

export default function StudentManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [filterCourse, setFilterCourse] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);
  const [deleteStudent, setDeleteStudent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Redirect nếu chưa đăng nhập
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/dang-nhap");
    }
  }, [session, status, router]);

  // Fetch students data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/students");
        if (response.ok) {
          const data = await response.json();
          setStudents(data);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchStudents();
    }
  }, [session]);

  // Filter students
  const filteredStudents = students.filter((student) => {
    const matchesSearch = 
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone.includes(searchTerm);
    
    const matchesStatus = filterStatus === "Tất cả" || student.status === filterStatus;
    const matchesCourse = filterCourse === "Tất cả" || student.course === filterCourse;
    
    return matchesSearch && matchesStatus && matchesCourse;
  });

  // Pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // Get unique courses for filter
  const uniqueCourses = [...new Set(students.map(student => student.course))];

  const handleDeleteClick = (studentId) => {
    const student = students.find((s) => s._id === studentId);
    if (student) {
      setDeleteStudent(student);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteStudent) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/students/${deleteStudent._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setStudents(students.filter((student) => student._id !== deleteStudent._id));
        setDeleteStudent(null);
      } else {
        alert("Có lỗi xảy ra khi xóa học viên");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Có lỗi xảy ra khi xóa học viên");
    } finally {
      setIsDeleting(false);
    }
  };


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <AdminLayout title="Quản lý học viên">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Quản lý học viên
                </h1>
                <p className="text-gray-600">
                  Quản lý thông tin và theo dõi tiến độ học tập của học viên
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Link
                  href="/dashboard/them-hoc-vien"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Thêm học viên mới
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tổng học viên</p>
                  <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Đang học</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {students.filter(s => s.status === "Đang học").length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tạm nghỉ</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {students.filter(s => s.status === "Tạm nghỉ").length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Đã tốt nghiệp</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {students.filter(s => s.status === "Đã tốt nghiệp").length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm kiếm
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Tìm theo tên, mã học viên, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Tất cả">Tất cả</option>
                  <option value="Đang học">Đang học</option>
                  <option value="Tạm nghỉ">Tạm nghỉ</option>
                  <option value="Đã tốt nghiệp">Đã tốt nghiệp</option>
                  <option value="Bị đình chỉ">Bị đình chỉ</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Khóa học
                </label>
                <select
                  value={filterCourse}
                  onChange={(e) => setFilterCourse(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Tất cả">Tất cả</option>
                  {uniqueCourses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Download className="w-4 h-4 inline mr-2" />
                  Xuất Excel
                </button>
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Học viên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thông tin liên hệ
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Khóa học
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Học phí
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <Image
                              className="h-10 w-10 rounded-full"
                              src={student.avatar}
                              alt={student.fullName}
                              width={40}
                              height={40}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student.studentId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center mb-1">
                            <Mail className="w-4 h-4 text-gray-400 mr-2" />
                            {student.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 text-gray-400 mr-2" />
                            {student.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 align-top">
                        <div className="text-sm text-gray-900 max-w-[120px] truncate">
                          {student.course}
                        </div>
                        <div className="text-sm text-gray-500 max-w-[120px] truncate">
                          {student.class}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          student.status === "Đang học" ? "bg-green-100 text-green-800" :
                          student.status === "Tạm nghỉ" ? "bg-yellow-100 text-yellow-800" :
                          student.status === "Đã tốt nghiệp" ? "bg-blue-100 text-blue-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(student.tuition?.totalAmount || 0)}
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          student.tuition?.paymentStatus === "Đã thanh toán" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {student.tuition?.paymentStatus || "Chưa thanh toán"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link 
                            href={`/dashboard/hoc-vien/${student._id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link 
                            href={`/dashboard/sua-hoc-vien/${student._id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDeleteClick(student._id);
                            }}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 cursor-pointer"
                            type="button"
                            title="Xóa học viên"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Sau
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Hiển thị <span className="font-medium">{indexOfFirstStudent + 1}</span> đến{" "}
                      <span className="font-medium">
                        {Math.min(indexOfLastStudent, filteredStudents.length)}
                      </span>{" "}
                      trong <span className="font-medium">{filteredStudents.length}</span> kết quả
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Trước
                      </button>
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === i + 1
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Sau
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Delete confirmation modal */}
          {deleteStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Xác nhận xóa học viên
                  </h3>
                </div>
                <div className="px-6 py-4">
                  <p className="text-sm text-gray-700 mb-2">
                    Bạn có chắc chắn muốn xóa học viên
                    <span className="font-semibold"> "{deleteStudent.fullName}"</span>?
                  </p>
                  <p className="text-xs text-gray-500">
                    Hành động này <span className="font-semibold">không thể hoàn tác</span>.
                  </p>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setDeleteStudent(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteConfirm}
                    disabled={isDeleting}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                      isDeleting
                        ? "bg-red-300 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {isDeleting ? "Đang xóa..." : "Xóa học viên"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
