// Danh sách địa điểm áp dụng cho Q&K Bắc Giang
export const locationOptions = [
  {
    code: "Q&K - Bắc Giang",
    name: "Trung tâm MC Q&K Bắc Giang",
    address: "Số 1 Nguyễn Văn Linh, Phường Bắc Giang, TP. Bắc Giang"
  },

  {
    code: "Online/Doanh nghiệp",
    name: "Đào tạo Online / Tại doanh nghiệp",
    address: "Linh hoạt theo lịch của học viên hoặc doanh nghiệp"
  }
];

// Mapping địa chỉ chi tiết cho các cơ sở
export const locationMapping = locationOptions.reduce((acc, option) => {
  acc[option.code] = {
    name: option.name,
    address: option.address
  };
  return acc;
}, {});

// Hàm helper để lấy thông tin địa chỉ
export const getLocationInfo = (locationCode) => {
  return locationMapping[locationCode] || {
    name: locationCode,
    address: "Địa chỉ chi tiết sẽ được cập nhật"
  };
};

// Hàm helper để format địa chỉ cho hiển thị
export const formatLocationsForDisplay = (locations) => {
  if (!locations || locations.length === 0) {
    return 'Q&K Bắc Giang';
  }
  
  return locations.map(location => {
    const info = getLocationInfo(location);
    return info.name;
  }).join(', ');
};
