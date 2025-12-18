import { useState } from "react";
import Image from "next/image";
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock,
  FaFacebookF,
  FaYoutube,

} from "react-icons/fa";
import { SiZalo } from "react-icons/si";

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState("contact");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    projectType: "",
    area: "",
    budget: "",
    location: "",
    message: "",
    consultationDate: "",
    consultationTime: "",
    consultationType: "office"
  });


  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const contactInfo = {
    address: "Số 1 Nguyễn Văn Linh, Phường Bắc Giang, tỉnh Bắc Ninh",
    phone: "081 699 7000",
    email: "",
    workingHours: {
      weekdays: "Thứ 2 - Thứ 7: 8:00 - 21:00",
      weekend: "Chủ nhật: 9:00 - 21:00"
    }
  };

  const socialLinks = [
    { name: "Facebook", icon: FaFacebookF, url: "https://facebook.com/daotaomcbacgiang", color: "bg-pink-600" },
    { name: "Zalo", icon: SiZalo, url: "https://zalo.me/0816997000", color: "bg-pink-500" }
  ];


  const validateForm = () => {
    const newErrors = {};

    // Validate required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Họ và tên là bắt buộc';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else {
      // Basic phone validation
      const phoneRegex = /^[0-9+\-\s()]+$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Số điện thoại không hợp lệ';
      }
    }

    // Validate email if provided
    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Email không hợp lệ';
      }
    }

    // Validate consultation date if provided
    if (formData.consultationDate) {
      const selectedDate = new Date(formData.consultationDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.consultationDate = 'Ngày tư vấn phải là ngày trong tương lai';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const response = await fetch('/api/consultation/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus("success");
        setErrors({});
        // Reset form
        setFormData({
          name: "",
          phone: "",
          email: "",
          projectType: "",
          area: "",
          budget: "",
          location: "",
          message: "",
          consultationDate: "",
          consultationTime: "",
          consultationType: "office"
        });
      } else {
        setSubmitStatus("error");
        console.error('API Error:', result.message);
      }
    } catch (error) {
      setSubmitStatus("error");
      console.error('Network Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen max-w-6xl mx-auto">
      {/* Tabs Navigation */}
      <div className="h-[70px]"></div>
      {/* Contact Information */}
      <section className="py-20 ">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Thông tin liên hệ
              </h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="text-pink-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Địa chỉ trung tâm</h3>
                    <p className="text-gray-700 leading-relaxed">{contactInfo.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <FaPhone className="text-pink-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Hotline</h3>
                    <a 
                      href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                      className="font-medium text-lg text-pink-600 hover:text-pink-700 transition-colors"
                     
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>

                {contactInfo.email && (
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <FaEnvelope className="text-pink-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Email</h3>
                    <a 
                      href={`mailto:${contactInfo.email}`}
                      className="text-pink-600 hover:text-pink-700 font-medium transition-colors"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
                )}

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <FaClock className="text-pink-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Giờ làm việc</h3>
                    <p className="text-gray-700">{contactInfo.workingHours.weekdays}</p>
                    <p className="text-gray-700">{contactInfo.workingHours.weekend}</p>
                  </div>
                </div>
              </div>

        
            </div>

            {/* Map */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Vị trí trung tâm</h2>
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg h-96">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3717.9928527396683!2d106.21641749999999!3d21.2717505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31356d0059f8ad7d%3A0x642fabdf23d3d464!2zVHJ1bmcgdMOibSDEkcOgbyB04bqhbyBNQyBRJksgQuG6r2MgR2lhbmc!5e0!3m2!1svi!2s!4v1765732123644!5m2!1svi!2s" 
                  width="100%" 
                  height="100%" 
                  style={{border:0}} 
                  allowFullScreen={true}
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
