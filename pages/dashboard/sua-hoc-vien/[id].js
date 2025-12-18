import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";import AdminLayout from "../../../components/layout/AdminLayout";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  DollarSign,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function EditStudent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // Thông tin cơ bản
    studentId: "",
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    
    // Thông tin địa chỉ
    address: {
      street: "",
      ward: "",
      city: "",
    },
    
    // Thông tin học tập
    enrollmentDate: "",
    status: "Đang học",
    course: "",
    class: "",
    
    // Thông tin phụ huynh
    parentInfo: {
      parentName: "",
      parentPhone: "",
      parentEmail: "",
      relationship: "",
    },
    
    // Thông tin học phí
    tuition: {
      totalAmount: "",
      paidAmount: "0",
      paymentStatus: "Chưa thanh toán",
    },
    
    // Thông tin bổ sung
    notes: "",
    
    // Thông tin liên hệ khẩn cấp
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
    
    // Thông tin học tập bổ sung
    academicInfo: {
      previousEducation: "",
      currentSchool: "",
      grade: "",
    },
  });

  useEffect(() => {
    if (id && session) {
      fetchStudent();
    }
  }, [id, session]);

  const fetchStudent = async () => {
    try {
      const response = await fetch(`/api/students/${id}`);
      if (response.ok) {
        const student = await response.json();
        
        // Debug: Log the fetched student data
        console.log("Fetched student data:", student);
        console.log("Student tuition:", student.tuition);
        console.log("Student payment status:", student.tuition?.paymentStatus);
        
        setFormData({
          studentId: student.studentId || "",
          fullName: student.fullName || "",
          email: student.email || "",
          phone: student.phone || "",
          dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : "",
          gender: student.gender || "",
          address: {
            street: student.address?.street || "",
            ward: student.address?.ward || "",
            city: student.address?.city || "",
          },
          enrollmentDate: student.enrollmentDate ? new Date(student.enrollmentDate).toISOString().split('T')[0] : "",
          status: student.status || "Đang học",
          course: student.course || "",
          class: student.class || "",
          parentInfo: {
            parentName: student.parentInfo?.parentName || "",
            parentPhone: student.parentInfo?.parentPhone || "",
            parentEmail: student.parentInfo?.parentEmail || "",
            relationship: student.parentInfo?.relationship || "",
          },
          tuition: {
            totalAmount: student.tuition?.totalAmount || "",
            paidAmount: student.tuition?.paidAmount || "0",
            paymentStatus: student.tuition?.paymentStatus || "Chưa thanh toán",
          },
          notes: student.notes || "",
          emergencyContact: {
            name: student.emergencyContact?.name || "",
            phone: student.emergencyContact?.phone || "",
            relationship: student.emergencyContact?.relationship || "",
          },
          academicInfo: {
            previousEducation: student.academicInfo?.previousEducation || "",
            currentSchool: student.academicInfo?.currentSchool || "",
            grade: student.academicInfo?.grade || "",
          },
        });
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      // Debug: Log form data before sending
      console.log("Update form data before submit:", formData);
      console.log("Update tuition data:", formData.tuition);
      console.log("Update payment status:", formData.tuition.paymentStatus);

      // Validate required fields
      if (!formData.studentId || !formData.fullName || !formData.email || !formData.phone) {
        throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc");
      }

      const response = await fetch(`/api/students/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/dashboard/hoc-vien/${id}`);
        }, 2000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Có lỗi xảy ra khi cập nhật học viên");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
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

  if (error && !formData.studentId) {
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

  return (
    <AdminLayout>
      <Head>
        <title>Chỉnh sửa học viên - BT Academy</title>
        <meta name="description" content="Chỉnh sửa thông tin học viên" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link
                  href={`/dashboard/hoc-vien/${id}`}
                  className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Chỉnh sửa học viên
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Cập nhật thông tin chi tiết của học viên
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-green-800">
                    Cập nhật học viên thành công!
                  </h3>
                  <p className="text-sm text-green-700 mt-1">
                    Đang chuyển hướng về trang chi tiết học viên...
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">
                    Có lỗi xảy ra
                  </h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Thông tin cơ bản */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Thông tin cơ bản
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã học viên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VD: HV001"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="example@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    pattern="[0-9]{10,11}"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0123456789"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày sinh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giới tính <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Thông tin địa chỉ */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Thông tin địa chỉ
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số nhà, thôn xóm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Số 123, thôn ABC"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xã/Phường <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address.ward"
                    value={formData.address.ward}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Xã Dịch Vọng"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tỉnh/Thành phố <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Hà Nội"
                  />
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày nhập học
                  </label>
                  <input
                    type="date"
                    name="enrollmentDate"
                    value={formData.enrollmentDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Đang học">Đang học</option>
                    <option value="Tạm nghỉ">Tạm nghỉ</option>
                    <option value="Đã tốt nghiệp">Đã tốt nghiệp</option>
                    <option value="Bị đình chỉ">Bị đình chỉ</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Khóa học <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Lập trình Web"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lớp học <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="WEB001"
                  />
                </div>
                
              </div>
            </div>

            {/* Thông tin học phí */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                Thông tin học phí
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tổng học phí <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="tuition.totalAmount"
                    value={formData.tuition.totalAmount}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="5000000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái thanh toán
                  </label>
                  <select
                    name="tuition.paymentStatus"
                    value={formData.tuition.paymentStatus}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formData.tuition.paymentStatus === "Đã thanh toán"
                        ? "border-green-300 bg-green-50 text-green-800"
                        : "border-red-300 bg-red-50 text-red-800"
                    }`}
                  >
                    <option value="Chưa thanh toán">Chưa thanh toán</option>
                    <option value="Đã thanh toán">Đã thanh toán</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Thông tin phụ huynh */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Thông tin phụ huynh (Tùy chọn)
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ tên phụ huynh
                  </label>
                  <input
                    type="text"
                    name="parentInfo.parentName"
                    value={formData.parentInfo.parentName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nguyễn Văn B"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại phụ huynh
                  </label>
                  <input
                    type="tel"
                    name="parentInfo.parentPhone"
                    value={formData.parentInfo.parentPhone}
                    onChange={handleInputChange}
                    pattern="[0-9]{10,11}"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0987654321"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email phụ huynh
                  </label>
                  <input
                    type="email"
                    name="parentInfo.parentEmail"
                    value={formData.parentInfo.parentEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="parent@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mối quan hệ
                  </label>
                  <select
                    name="parentInfo.relationship"
                    value={formData.parentInfo.relationship}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn mối quan hệ</option>
                    <option value="Cha">Cha</option>
                    <option value="Mẹ">Mẹ</option>
                    <option value="Anh/Chị">Anh/Chị</option>
                    <option value="Người giám hộ">Người giám hộ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Ghi chú */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Ghi chú bổ sung
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập ghi chú về học viên..."
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <Link
                href={`/dashboard/hoc-vien/${id}`}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Cập nhật học viên
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout >
  );
}
  