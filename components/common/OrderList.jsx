import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Eye, Trash2, Edit, Check, X, Package, Truck, CreditCard, Clock } from 'lucide-react';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  // Order status options
  const statusOptions = [
    { value: 'pending', label: 'Chờ xử lý', icon: Clock, color: 'bg-yellow-500' },
    { value: 'processing', label: 'Đang xử lý', icon: Package, color: 'bg-blue-500' },
    { value: 'shipped', label: 'Đã gửi hàng', icon: Truck, color: 'bg-purple-500' },
    { value: 'delivered', label: 'Đã giao hàng', icon: Check, color: 'bg-green-500' },
    { value: 'cancelled', label: 'Đã hủy', icon: X, color: 'bg-red-500' },
    { value: 'paid', label: 'Đã thanh toán', icon: CreditCard, color: 'bg-emerald-500' }
  ];

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/orders');
        if (!response.ok) {
          throw new Error('Lỗi khi lấy danh sách đơn hàng');
        }
        const data = await response.json();
        const fetchedOrders = data.orders || [];
        setOrders(fetchedOrders);
        setFilteredOrders(fetchedOrders);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách đơn hàng:', error);
        setOrders([]);
        setFilteredOrders([]);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Close popup with Esc key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setSelectedOrder(null);
        setIsEditingStatus(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Reusable filter logic
  const filterOrders = (orders, filterType, selectedDate) => {
    if (selectedDate) {
      const filterDate = new Date(selectedDate);
      return orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate.getDate() === filterDate.getDate() &&
          orderDate.getMonth() === filterDate.getMonth() &&
          orderDate.getFullYear() === filterDate.getFullYear()
        );
      });
    }

    const now = new Date();
    if (filterType === 'all') return orders;

    if (filterType === 'day') {
      return orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate.getDate() === now.getDate() &&
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      });
    } else if (filterType === 'week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay() + 1);
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      return orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startOfWeek && orderDate <= endOfWeek;
      });
    } else if (filterType === 'month') {
      return orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      });
    } else if (filterType === 'year') {
      return orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getFullYear() === now.getFullYear();
      });
    }
    return orders;
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const filter = e.target.value;
    setFilterType(filter);
    setSelectedDate(''); // Reset selected date when filter type changes
    setCurrentPage(1);
    let filtered = filterOrders(orders, filter, '');
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.phone.includes(searchQuery)
      );
    }
    setFilteredOrders(filtered);
  };

  // Handle date change
  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setFilterType(''); // Reset filter type when a date is selected
    setCurrentPage(1);
    let filtered = filterOrders(orders, '', date);
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.phone.includes(searchQuery)
      );
    }
    setFilteredOrders(filtered);
  };

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = filterOrders(orders, filterType, selectedDate).filter(
      (order) =>
        order.id.toLowerCase().includes(query.toLowerCase()) ||
        order.name.toLowerCase().includes(query.toLowerCase()) ||
        order.phone.includes(query)
    );
    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!newStatus || !selectedOrder) return;
    
    try {
      const response = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Lỗi khi cập nhật trạng thái');
      }

      // Update local state
      const updatedOrders = orders.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, status: newStatus }
          : order
      );
      
      setOrders(updatedOrders);
      setFilteredOrders(filterOrders(updatedOrders, filterType, selectedDate));
      setSelectedOrder({ ...selectedOrder, status: newStatus });
      setIsEditingStatus(false);
      setNewStatus('');
      
      // Show success message
      alert('Cập nhật trạng thái thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      alert('Lỗi khi cập nhật trạng thái: ' + error.message);
    }
  };

  // Start editing status
  const startEditStatus = () => {
    setNewStatus(selectedOrder.status);
    setIsEditingStatus(true);
  };

  // Cancel editing status
  const cancelEditStatus = () => {
    setIsEditingStatus(false);
    setNewStatus('');
  };

  // Handle delete confirmation
  const confirmDelete = (order) => {
    setOrderToDelete(order);
    setShowDeleteConfirm(true);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!orderToDelete) return;
    
    try {
      const response = await fetch(`/api/orders/${orderToDelete._id || orderToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Lỗi khi xóa đơn hàng');
      
      const updatedOrders = orders.filter((order) => order._id !== orderToDelete._id && order.id !== orderToDelete.id);
      setOrders(updatedOrders);
      setFilteredOrders(filterOrders(updatedOrders, filterType, selectedDate));
      setCurrentPage(1);
      
      // Close popup and reset
      setShowDeleteConfirm(false);
      setOrderToDelete(null);
    } catch (error) {
      console.error('Lỗi khi xóa đơn hàng:', error);
      setError(error.message);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setOrderToDelete(null);
  };

  const getStatusColor = (status) => {
    const statusMap = {
      pending: 'bg-yellow-500 text-white',
      processing: 'bg-blue-500 text-white',
      shipped: 'bg-purple-500 text-white',
      delivered: 'bg-green-500 text-white',
      cancelled: 'bg-red-500 text-white',
      paid: 'bg-emerald-500 text-white',
      default: 'bg-gray-500 text-white',
    };
    return statusMap[status.toLowerCase()] || statusMap.default;
  };

  const getStatusIcon = (status) => {
    const statusOption = statusOptions.find(option => option.value === status.toLowerCase());
    return statusOption ? statusOption.icon : Clock;
  };

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (loading) {
    return (
      <div className="loading-container">
        {[...Array(itemsPerPage)].map((_, i) => (
          <div key={i} className="loading-skeleton"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div>Lỗi: {error}</div>
        <button onClick={() => window.location.reload()}>
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="order-list-container">
      <div className="order-list-controls">
        <div className="order-list-filters">
          <div className="filter-group">
            <label>Hiển thị</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span>Đơn hàng</span>
          </div>
          <div className="filter-group">
            <label>Lọc theo:</label>
            <select
              value={filterType}
              onChange={handleFilterChange}
            >
              <option value="all">Tất cả</option>
              <option value="day">Ngày</option>
              <option value="week">Tuần</option>
              <option value="month">Tháng</option>
              <option value="year">Năm</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Chọn ngày:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>
        </div>
        <div className="order-search">
          <input
            type="text"
            placeholder="Tìm kiếm ID, tên, số điện thoại..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <div className="empty-state-title">Không có đơn hàng</div>
          <div className="empty-state-description">
            {selectedDate
              ? 'Chưa có đơn hàng trong ngày đã chọn.'
              : filterType === 'day'
              ? 'Chưa có người đặt hàng hôm nay.'
              : 'Không có đơn hàng nào phù hợp với bộ lọc.'}
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="order-list-table" aria-label="Danh sách đơn hàng">
              <thead>
                <tr>
                  <th>ID Đơn Hàng</th>
                  <th>Ngày Đặt</th>
                  <th>Khách Hàng</th>
                  <th>Số Điện Thoại</th>
                  <th>Tổng Tiền</th>
                  <th>Phương Thức</th>
                  <th>Trạng Thái</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className="order-id">#{order.id.slice(-6)}</span>
                    </td>
                    <td>
                      <span className="order-date">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </td>
                    <td>
                      <span className="customer-name">{order.name}</span>
                    </td>
                    <td>
                      <span className="customer-phone">{order.phone}</span>
                    </td>
                    <td>
                      <span className="order-total">{formatVND(order.finalTotal)}</span>
                    </td>
                    <td>
                      <span className="payment-method">{order.paymentMethod}</span>
                    </td>
                                         <td>
                       <span className={`order-status status-${order.status.toLowerCase()}`}>
                         {order.status}
                       </span>
                     </td>
                     <td>
                       <div className="order-actions">
                         <button
                           onClick={() => setSelectedOrder(order)}
                           className="action-btn view-btn"
                           aria-label="Xem chi tiết"
                         >
                           <Eye size={18} />
                         </button>
                         <button
                           onClick={() => confirmDelete(order)}
                           className="action-btn delete-btn"
                           aria-label="Xóa"
                         >
                           <Trash2 size={18} />
                         </button>
                       </div>
                     </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

                     {/* Pagination Controls */}
           <div className="pagination-container">
             <div className="pagination-controls">
               <button
                 onClick={prevPage}
                 disabled={currentPage === 1}
                 className="pagination-btn"
               >
                 ← Trước
               </button>
               <span className="pagination-info">
                 Trang {currentPage} / {totalPages}
               </span>
               <button
                 onClick={nextPage}
                 disabled={currentPage === totalPages}
                 className="pagination-btn"
               >
                 Sau →
               </button>
             </div>
             <span className="pagination-count">
               Tổng số: {filteredOrders.length} đơn hàng
             </span>
           </div>
        </>
      )}

             {/* Enhanced Popup for Order Details */}
       {selectedOrder && (
         <div 
           className="modalOverlay"
           onClick={(e) => {
             if (e.target === e.currentTarget) {
               setSelectedOrder(null);
               setIsEditingStatus(false);
             }
           }}
         >
           <div className="modalContent">
             {/* Header */}
             <div className="modalHeader">
               <div className="flex justify-between items-center">
                 <div>
                   <h2 className="modalTitle">Chi tiết đơn hàng</h2>
                   <p className="text-blue-50">#{selectedOrder.id.slice(-6)}</p>
                 </div>
                 <button
                   onClick={() => {
                     setSelectedOrder(null);
                     setIsEditingStatus(false);
                   }}
                   className="modalClose"
                   aria-label="Đóng"
                 >
                   ×
                 </button>
               </div>
             </div>

                                       {/* Body */}
              <div className="modalBody">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                 {/* Customer Information */}
                 <div className="bg-gray-50 rounded-lg p-4">
                   <h3 className="text-base font-semibold mb-3 flex items-center">
                     <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                     Thông tin khách hàng
                   </h3>
                   <div className="space-y-2">
                     <div className="flex justify-between">
                       <span className="text-gray-600 text-sm">Tên:</span>
                       <span className="font-medium text-sm">{selectedOrder.name}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-600 text-sm">Số điện thoại:</span>
                       <span className="font-medium text-sm">{selectedOrder.phone}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-600 text-sm">Địa chỉ:</span>
                       <span className="font-medium text-sm text-right max-w-xs">{selectedOrder.shippingAddress?.address || 'N/A'}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-600 text-sm">Ngày đặt:</span>
                       <span className="font-medium text-sm">{new Date(selectedOrder.createdAt).toLocaleDateString('vi-VN')}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-600 text-sm">Tổng tiền:</span>
                       <span className="font-bold text-green-600 text-sm">{formatVND(selectedOrder.finalTotal)}</span>
                     </div>
                   </div>
                 </div>

                 {/* Order Status */}
                 <div className="bg-gray-50 rounded-lg p-4">
                   <h3 className="text-base font-semibold mb-3 flex items-center">
                     <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                     Trạng thái đơn hàng
                   </h3>
                  
                                     {isEditingStatus ? (
                     <div className="statusEditSection">
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                           Chọn trạng thái mới:
                         </label>
                         <select
                           value={newStatus}
                           onChange={(e) => setNewStatus(e.target.value)}
                           className="statusSelect"
                         >
                           {statusOptions.map((option) => {
                             const IconComponent = option.icon;
                             return (
                               <option key={option.value} value={option.value}>
                                 {option.label}
                               </option>
                             );
                           })}
                         </select>
                       </div>
                       <div className="statusButtons">
                         <button
                           onClick={handleStatusUpdate}
                           className="statusUpdateBtn"
                         >
                           <Check size={16} className="mr-2" />
                           Cập nhật
                         </button>
                         <button
                           onClick={cancelEditStatus}
                           className="statusCancelBtn"
                         >
                           <X size={16} className="mr-2" />
                           Hủy
                         </button>
                       </div>
                     </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {(() => {
                            const StatusIcon = getStatusIcon(selectedOrder.status);
                            return <StatusIcon size={20} className="mr-3 text-gray-600" />;
                          })()}
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                            {selectedOrder.status}
                          </span>
                        </div>
                        <button
                          onClick={startEditStatus}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">
                        Cập nhật trạng thái đơn hàng để khách hàng theo dõi được tiến trình giao hàng.
                      </p>
                    </div>
                  )}
                </div>
              </div>

                             {/* Order Items */}
               <div className="mt-4">
                 <h3 className="text-base font-semibold mb-3 flex items-center">
                   <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                   Sản phẩm đã đặt
                 </h3>
                 <div className="space-y-2">
                   {selectedOrder.orderItems?.map((item, index) => (
                     <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                       <div className="flex items-center">
                         <div className="relative w-12 h-12 mr-3 flex-shrink-0">
                           <Image
                             src={item.image || '/images/placeholder.jpg'}
                             alt={item.title}
                             layout="fill"
                             objectFit="cover"
                             className="rounded-md"
                           />
                         </div>
                         <div className="flex-1 min-w-0">
                           <h4 className="font-medium text-gray-900 truncate text-sm">{item.title}</h4>
                           <p className="text-xs text-gray-600 mt-0.5">Số lượng: {item.quantity}</p>
                           <p className="text-xs font-semibold text-green-600 mt-0.5">
                             {formatVND(item.price)}
                           </p>
                         </div>
                         <div className="text-right">
                           <p className="font-bold text-base text-gray-900">
                             {formatVND(item.price * item.quantity)}
                           </p>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
            </div>

            {/* Footer */}
            <div className="modalFooter">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Đơn hàng được tạo lúc: {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
                </div>
                <button
                  onClick={() => {
                    setSelectedOrder(null);
                    setIsEditingStatus(false);
                  }}
                  className="modalBtn modalBtnPrimary"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={cancelDelete}
            ></div>
            
            {/* Modal */}
            <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
              {/* Header */}
              <div className="bg-red-500 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white bg-opacity-20">
                      <Trash2 size={24} className="text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-white">Xác nhận xóa</h3>
                      <p className="text-sm text-red-100">Bạn có chắc chắn muốn xóa đơn hàng này?</p>
                    </div>
                  </div>
                  <button
                    onClick={cancelDelete}
                    className="rounded-full p-1 text-white hover:bg-white hover:bg-opacity-20 transition-colors"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-6">
                {/* Order Info Card */}
                <div className="mb-6 rounded-xl bg-gray-50 p-4 border border-gray-200">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Mã đơn hàng</span>
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        #{orderToDelete?.id?.slice(-6) || orderToDelete?._id?.slice(-6)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Khách hàng</span>
                      <span className="text-sm font-semibold text-gray-900">{orderToDelete?.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Tổng tiền</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatVND(orderToDelete?.totalAmount || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Warning Message */}
                <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Hành động không thể hoàn tác</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>Đơn hàng sẽ bị xóa vĩnh viễn khỏi hệ thống.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4">
                <div className="flex space-x-3">
                  <button
                    onClick={cancelDelete}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all transform hover:scale-105"
                  >
                    <Trash2 size={16} className="mr-2 inline" />
                    Xóa đơn hàng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}