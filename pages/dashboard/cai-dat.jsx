import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/layout/AdminLayout';
import {
  Settings,
  Store,
  Mail,
  CreditCard,
  Truck,
  Shield,
  Palette,
  Bell,
  Database,
  Save,
  X,
  Check
} from 'lucide-react';

export default function CaiDat() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form states
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Trung Tâm MC Q&K Bắc Giang',
    siteDescription: 'Trung Tâm Đào tạo MC Q&K Bắc Giang - Đào tạo MC, dẫn chương trình, phát thanh viên và kỹ năng giao tiếp chuyên nghiệp hàng đầu tại Bắc Giang và Bắc Ninh. Khóa học từ cơ bản đến nâng cao.',
    contactEmail: 'info@mcbacgiang.com',
    contactPhone: '081.6997.000',
    address: 'Số 1 Nguyễn Văn Linh, phường Bắc Giang, tỉnh Bắc Ninh'
  });

  const [businessSettings, setBusinessSettings] = useState({
    businessHours: '8:00 - 20:00',
    deliveryRadius: '20',
    minOrderAmount: '100000',
    freeShippingThreshold: '500000'
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    fromEmail: 'noreply@ecobacgiang.com',
    fromName: 'EcoBacGiang'
  });

  const [paymentSettings, setPaymentSettings] = useState({
    enableMomo: true,
    enableSepay: true,
    enableCOD: true,
    momoPhone: '',
    momoName: '',
    sepayApiKey: '',
    sepaySecretKey: ''
  });

  const [shippingSettings, setShippingSettings] = useState({
    baseShippingCost: '30000',
    shippingPerKm: '2000',
    estimatedDeliveryDays: '2-3',
    enableTracking: true
  });

  // Check authentication & admin role
  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/dang-nhap');
      return;
    }

    if ((session.user)?.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  const handleSave = async (settingsType) => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ 
        type: 'success', 
        text: `${settingsType} đã được lưu thành công!` 
      });
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Có lỗi xảy ra khi lưu cài đặt' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'Cài đặt chung', icon: Settings },
    { id: 'business', name: 'Kinh doanh', icon: Store },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'payment', name: 'Thanh toán', icon: CreditCard },
    { id: 'shipping', name: 'Vận chuyển', icon: Truck },
    { id: 'security', name: 'Bảo mật', icon: Shield }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên website
          </label>
          <input
            type="text"
            value={generalSettings.siteName}
            onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email liên hệ
          </label>
          <input
            type="email"
            value={generalSettings.contactEmail}
            onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số điện thoại
          </label>
          <input
            type="tel"
            value={generalSettings.contactPhone}
            onChange={(e) => setGeneralSettings({...generalSettings, contactPhone: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Địa chỉ
          </label>
          <input
            type="text"
            value={generalSettings.address}
            onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mô tả website
        </label>
        <textarea
          value={generalSettings.siteDescription}
          onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <button
        onClick={() => handleSave('Cài đặt chung')}
        disabled={isLoading}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
        ) : (
          <Save size={20} className="mr-2" />
        )}
        Lưu cài đặt chung
      </button>
    </div>
  );

  const renderBusinessSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Giờ làm việc
          </label>
          <input
            type="text"
            value={businessSettings.businessHours}
            onChange={(e) => setBusinessSettings({...businessSettings, businessHours: e.target.value})}
            placeholder="8:00 - 20:00"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bán kính giao hàng (km)
          </label>
          <input
            type="number"
            value={businessSettings.deliveryRadius}
            onChange={(e) => setBusinessSettings({...businessSettings, deliveryRadius: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đơn hàng tối thiểu (VNĐ)
          </label>
          <input
            type="number"
            value={businessSettings.minOrderAmount}
            onChange={(e) => setBusinessSettings({...businessSettings, minOrderAmount: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Miễn phí vận chuyển từ (VNĐ)
          </label>
          <input
            type="number"
            value={businessSettings.freeShippingThreshold}
            onChange={(e) => setBusinessSettings({...businessSettings, freeShippingThreshold: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <button
        onClick={() => handleSave('Cài đặt kinh doanh')}
        disabled={isLoading}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
        ) : (
          <Save size={20} className="mr-2" />
        )}
        Lưu cài đặt kinh doanh
      </button>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <CreditCard size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-medium">Thanh toán khi nhận hàng (COD)</h3>
              <p className="text-sm text-gray-600">Khách hàng thanh toán khi nhận hàng</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={paymentSettings.enableCOD}
              onChange={(e) => setPaymentSettings({...paymentSettings, enableCOD: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mr-3">
              <CreditCard size={20} className="text-pink-600" />
            </div>
            <div>
              <h3 className="font-medium">Ví MoMo</h3>
              <p className="text-sm text-gray-600">Thanh toán qua ví MoMo</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={paymentSettings.enableMomo}
              onChange={(e) => setPaymentSettings({...paymentSettings, enableMomo: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <CreditCard size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">SePay</h3>
              <p className="text-sm text-gray-600">Thanh toán qua SePay</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={paymentSettings.enableSepay}
              onChange={(e) => setPaymentSettings({...paymentSettings, enableSepay: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {paymentSettings.enableMomo && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-pink-50 rounded-lg border border-pink-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại MoMo
            </label>
            <input
              type="tel"
              value={paymentSettings.momoPhone}
              onChange={(e) => setPaymentSettings({...paymentSettings, momoPhone: e.target.value})}
              placeholder="0123456789"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên chủ tài khoản
            </label>
            <input
              type="text"
              value={paymentSettings.momoName}
              onChange={(e) => setPaymentSettings({...paymentSettings, momoName: e.target.value})}
              placeholder="NGUYEN VAN A"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {paymentSettings.enableSepay && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            <input
              type="text"
              value={paymentSettings.sepayApiKey}
              onChange={(e) => setPaymentSettings({...paymentSettings, sepayApiKey: e.target.value})}
              placeholder="sepay_api_key_here"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secret Key
            </label>
            <input
              type="password"
              value={paymentSettings.sepaySecretKey}
              onChange={(e) => setPaymentSettings({...paymentSettings, sepaySecretKey: e.target.value})}
              placeholder="sepay_secret_key_here"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      <button
        onClick={() => handleSave('Cài đặt thanh toán')}
        disabled={isLoading}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
        ) : (
          <Save size={20} className="mr-2" />
        )}
        Lưu cài đặt thanh toán
      </button>
    </div>
  );

  const renderShippingSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phí vận chuyển cơ bản (VNĐ)
          </label>
          <input
            type="number"
            value={shippingSettings.baseShippingCost}
            onChange={(e) => setShippingSettings({...shippingSettings, baseShippingCost: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phí vận chuyển mỗi km (VNĐ)
          </label>
          <input
            type="number"
            value={shippingSettings.shippingPerKm}
            onChange={(e) => setShippingSettings({...shippingSettings, shippingPerKm: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thời gian giao hàng dự kiến (ngày)
          </label>
          <input
            type="text"
            value={shippingSettings.estimatedDeliveryDays}
            onChange={(e) => setShippingSettings({...shippingSettings, estimatedDeliveryDays: e.target.value})}
            placeholder="2-3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={shippingSettings.enableTracking}
              onChange={(e) => setShippingSettings({...shippingSettings, enableTracking: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
          <span className="ml-3 text-sm font-medium text-gray-700">
            Bật theo dõi đơn hàng
          </span>
        </div>
      </div>
      <button
        onClick={() => handleSave('Cài đặt vận chuyển')}
        disabled={isLoading}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
        ) : (
          <Save size={20} className="mr-2" />
        )}
        Lưu cài đặt vận chuyển
      </button>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'business':
        return renderBusinessSettings();
      case 'payment':
        return renderPaymentSettings();
      case 'shipping':
        return renderShippingSettings();
      default:
        return (
          <div className="text-center py-12">
            <Settings size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chức năng đang phát triển</h3>
            <p className="text-gray-600">Chúng tôi sẽ sớm cập nhật thêm các tính năng cài đặt khác.</p>
          </div>
        );
    }
  };

  return (
    <AdminLayout title="Cài đặt hệ thống - Q&K Bắc Giang">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cài đặt hệ thống</h1>
            <p className="text-gray-600">
              Quản lý cài đặt website, thanh toán, vận chuyển và các thông số khác cho Q&K Bắc Giang
            </p>
          </div>

          {/* Message */}
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center ${
                message.type === 'success'
                  ? 'bg-blue-50 border border-blue-200 text-blue-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              {message.type === 'success' ? (
                <Check size={20} className="mr-2" />
              ) : (
                <X size={20} className="mr-2" />
              )}
              {message.text}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon size={20} className="mr-2" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="p-6">{renderContent()}</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
