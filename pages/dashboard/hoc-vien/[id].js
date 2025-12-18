import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import AdminLayout from "../../../components/layout/AdminLayout";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  DollarSign,
  User,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function StudentDetail() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id && session) {
      fetchStudent();
    }
  }, [id, session]);

  const fetchStudent = async () => {
    try {
      const response = await fetch(`/api/students/${id}`);
      if (response.ok) {
        const data = await response.json();
        setStudent(data);
      } else {
        setError("Không tìm thấy học viên");
      }
    } catch (error) {
      console.error("Error fetching student:", error);
      setError("Có lỗi xảy ra khi tải thông tin học viên");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async () => {
    const studentName = student ? student.fullName : "học viên này";
    
    if (confirm(`Bạn có chắc chắn muốn xóa học viên "${studentName}"?\n\nHành động này không thể hoàn tác!`)) {
      try {
        const response = await fetch(`/api/students/${id}`, {
          method: "DELETE",
        });
        
        if (response.ok) {
          alert("Học viên đã được xóa thành công!");
          router.push("/dashboard/quan-ly-hoc-vien");
        } else {
          alert("Có lỗi xảy ra khi xóa học viên");
        }
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("Có lỗi xảy ra khi xóa học viên");
      }
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
    router.push("/dang-nhap");
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lỗi</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/dashboard/quan-ly-hoc-vien"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin học viên...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Chi tiết học viên - {student.fullName} - BT Academy</title>
        <meta name="description" content={`Thông tin chi tiết của học viên ${student.fullName}`} />
      </Head>

      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link
                  href="/dashboard/quan-ly-hoc-vien"
                  className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </Link>
                <div className="flex items-center">
                  <Image
                    className="h-16 w-16 rounded-full mr-4"
                    src={student.avatar}
                    alt={student.fullName}
                    width={64}
                    height={64}
                  />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {student.fullName}
                    </h1>
                    <p className="text-gray-600">
                      Mã học viên: {student.studentId}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Link
                  href={`/dashboard/sua-hoc-vien/${student._id}`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </Link>
                <button
                  onClick={handleDeleteStudent}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Thông tin cơ bản */}
            <div className="lg:col-span-2 space-y-6">
              {/* Thông tin cá nhân */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Thông tin cá nhân
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên
                    </label>
                    <p className="text-gray-900">{student.fullName}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã học viên
                    </label>
                    <p className="text-gray-900 font-mono">{student.studentId}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <p className="text-gray-900">{student.email}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại
                    </label>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <p className="text-gray-900">{student.phone}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày sinh
                    </label>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <p className="text-gray-900">{formatDate(student.dateOfBirth)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giới tính
                    </label>
                    <p className="text-gray-900">{student.gender}</p>
                  </div>
                </div>
              </div>

              {/* Thông tin địa chỉ */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Thông tin địa chỉ
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ
                    </label>
                    <p className="text-gray-900">{student.address.street}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Xã/Phường
                      </label>
                      <p className="text-gray-900">{student.address.ward}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tỉnh/Thành phố
                      </label>
                      <p className="text-gray-900">{student.address.city}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin học tập */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
                  Thông tin học tập
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày nhập học
                    </label>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <p className="text-gray-900">{formatDate(student.enrollmentDate)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      student.status === "Đang học" ? "bg-green-100 text-green-800" :
                      student.status === "Tạm nghỉ" ? "bg-yellow-100 text-yellow-800" :
                      student.status === "Đã tốt nghiệp" ? "bg-blue-100 text-blue-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {student.status}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Khóa học
                    </label>
                    <p className="text-gray-900">{student.course}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lớp học
                    </label>
                    <p className="text-gray-900">{student.class}</p>
                  </div>
                  
                </div>
              </div>

              {/* Thông tin phụ huynh */}
              {(student.parentInfo.parentName || student.parentInfo.parentPhone || student.parentInfo.parentEmail) && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Thông tin phụ huynh
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {student.parentInfo.parentName && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Họ tên phụ huynh
                        </label>
                        <p className="text-gray-900">{student.parentInfo.parentName}</p>
                      </div>
                    )}
                    
                    {student.parentInfo.parentPhone && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Số điện thoại phụ huynh
                        </label>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          <p className="text-gray-900">{student.parentInfo.parentPhone}</p>
                        </div>
                      </div>
                    )}
                    
                    {student.parentInfo.parentEmail && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email phụ huynh
                        </label>
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" />
                          <p className="text-gray-900">{student.parentInfo.parentEmail}</p>
                        </div>
                      </div>
                    )}
                    
                    {student.parentInfo.relationship && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mối quan hệ
                        </label>
                        <p className="text-gray-900">{student.parentInfo.relationship}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Ghi chú */}
              {student.notes && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Ghi chú
                  </h2>
                  <p className="text-gray-900 whitespace-pre-wrap">{student.notes}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Thông tin học phí */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                  Thông tin học phí
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tổng học phí
                    </label>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(student.tuition?.totalAmount || 0)}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Đã thanh toán
                    </label>
                    <p className="text-xl font-semibold text-green-600">
                      {formatCurrency(student.tuition?.paidAmount || 0)}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Còn lại
                    </label>
                    <p className="text-xl font-semibold text-red-600">
                      {formatCurrency(student.tuition?.remainingAmount || 0)}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái thanh toán
                    </label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      student.tuition?.paymentStatus === "Đã thanh toán" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {student.tuition?.paymentStatus || "Chưa thanh toán"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Thông tin liên hệ khẩn cấp */}
              {(student.emergencyContact.name || student.emergencyContact.phone) && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Liên hệ khẩn cấp
                  </h2>
                  
                  <div className="space-y-4">
                    {student.emergencyContact.name && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Họ tên
                        </label>
                        <p className="text-gray-900">{student.emergencyContact.name}</p>
                      </div>
                    )}
                    
                    {student.emergencyContact.phone && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Số điện thoại
                        </label>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          <p className="text-gray-900">{student.emergencyContact.phone}</p>
                        </div>
                      </div>
                    )}
                    
                    {student.emergencyContact.relationship && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mối quan hệ
                        </label>
                        <p className="text-gray-900">{student.emergencyContact.relationship}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Thông tin học tập bổ sung */}
              {(student.academicInfo.previousEducation || student.academicInfo.currentSchool || student.academicInfo.grade) && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Thông tin học tập bổ sung
                  </h2>
                  
                  <div className="space-y-4">
                    {student.academicInfo.previousEducation && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Học vấn trước đây
                        </label>
                        <p className="text-gray-900">{student.academicInfo.previousEducation}</p>
                      </div>
                    )}
                    
                    {student.academicInfo.currentSchool && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Trường hiện tại
                        </label>
                        <p className="text-gray-900">{student.academicInfo.currentSchool}</p>
                      </div>
                    )}
                    
                    {student.academicInfo.grade && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Lớp/Khóa
                        </label>
                        <p className="text-gray-900">{student.academicInfo.grade}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </AdminLayout>
    );  
}
