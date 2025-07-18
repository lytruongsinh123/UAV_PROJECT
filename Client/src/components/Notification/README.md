# Hệ thống Thông báo UAV Status Change

## 📋 Tổng quan

Hệ thống thông báo được thiết kế để hiển thị các thông báo real-time khi có thay đổi status UAV, với các tính năng:

-   ✅ Thông báo thành công/lỗi cho mọi hành động UAV
-   🔄 Thông báo riêng cho status change với icon và màu sắc phù hợp
-   📦 Batch notification cho nhiều thay đổi cùng lúc
-   🎨 UI/UX đẹp mắt với animation
-   📱 Responsive design
-   🌙 Dark mode support

## 🏗️ Cấu trúc Files

```
src/
├── components/
│   └── Notification/
│       ├── Notification.jsx      # Component hiển thị thông báo
│       └── Notification.css      # Styling cho notifications
├── services/
│   └── notificationService.js    # Service quản lý notifications
├── utils/
│   └── testNotification.js       # Demo và test notifications
└── store/actions/
    └── uavRegisterActions.js     # Redux actions với notifications
```

## 🚀 Cách sử dụng

### 1. Import service

```javascript
import notificationService from "../../services/notificationService";
```

### 2. Hiển thị thông báo cơ bản

```javascript
// Thông báo thành công
notificationService.success("Thành công", "UAV đã được kích hoạt");

// Thông báo lỗi
notificationService.error("Lỗi", "Không thể kết nối server");

// Thông báo cảnh báo
notificationService.warning("Cảnh báo", "UAV cần bảo trì");

// Thông báo thông tin
notificationService.info("Thông tin", "Đang cập nhật dữ liệu");
```

### 3. Thông báo Status Change

```javascript
// Thông báo thay đổi status UAV
notificationService.statusChange("UAV001", "Pending", "Active");

// Thông báo batch status change
notificationService.batchStatusChange([
    { droneId: "UAV001", oldStatus: "Active", newStatus: "Completed" },
    { droneId: "UAV002", oldStatus: "Pending", newStatus: "Active" },
]);
```

### 4. Thông báo UAV Actions

```javascript
// Thông báo hành động UAV
notificationService.uavAction("ACTIVATE", "UAV001", "is now flying");
notificationService.uavAction("COMPLETE", "UAV002", "mission completed");
notificationService.uavAction("MAINTENANCE", "UAV003", "scheduled maintenance");
```

### 5. Tùy chỉnh thông báo

```javascript
// Thông báo với tùy chọn
notificationService.success("Thành công", "UAV registered", {
    duration: 7000, // Hiển thị 7 giây
    // Các tùy chọn khác...
});
```

## 🎨 Các loại thông báo

| Loại            | Icon | Màu sắc    | Sử dụng             |
| --------------- | ---- | ---------- | ------------------- |
| `success`       | ✅   | Xanh lá    | Thành công          |
| `error`         | ❌   | Đỏ         | Lỗi                 |
| `warning`       | ⚠️   | Vàng       | Cảnh báo            |
| `info`          | ℹ️   | Xanh dương | Thông tin           |
| `status-change` | 🔄   | Tím        | Thay đổi trạng thái |

## 🔧 Tích hợp với Redux

Hệ thống đã được tích hợp sẵn trong Redux actions:

```javascript
// Trong uavRegisterActions.js
export const changeUavStatus = (droneId, newStatus, oldStatus = null) => {
    return async (dispatch, getState) => {
        try {
            let res = await handleChangeStatus(droneId, newStatus);
            if (res && res.errCode === 0) {
                // ✅ Tự động hiển thị thông báo thành công
                notificationService.statusChange(droneId, oldStatus, newStatus);
            } else {
                // ❌ Tự động hiển thị thông báo lỗi
                notificationService.error("Status Change Failed", res.message);
            }
        } catch (error) {
            notificationService.error("Status Change Error", error.message);
        }
    };
};
```

## 🧪 Test Notifications

Mở DevTools Console và chạy:

```javascript
// Test tất cả loại thông báo
testNotifications();

// Test từng loại
notificationService.success("Test", "Success message");
notificationService.statusChange("UAV001", "Pending", "Active");
```

## 📱 Responsive Design

-   Desktop: Góc phải màn hình
-   Mobile: Full width với margin 10px
-   Auto-hide sau 5 giây (có thể tùy chỉnh)
-   Click để đóng sớm

## 🌙 Dark Mode

Hệ thống tự động detect dark mode và thay đổi theme phù hợp.

## 🔧 Tùy chỉnh

### Thay đổi vị trí hiển thị

Sửa CSS trong `Notification.css`:

```css
.notification-container {
    position: fixed;
    top: 20px;
    right: 20px; /* Thay đổi thành left: 20px để hiển thị bên trái */
    z-index: 9999;
}
```

### Thay đổi thời gian hiển thị mặc định

Sửa trong `notificationService.js`:

```javascript
show(type, title, message, options = {}) {
    const notification = {
        // ...
        duration: options.duration || 8000,  // 8 giây thay vì 5 giây
        // ...
    };
}
```

## 🚀 Triển khai

1. **Đã tích hợp sẵn** - Không cần cài đặt thêm
2. **Auto-import** - Component Notification đã được thêm vào App.js
3. **Ready to use** - Chỉ cần import service và sử dụng

## 🎯 Lợi ích

-   📈 **Giảm API calls**: Optimistic updates với rollback
-   🎨 **UX tốt hơn**: Thông báo đẹp mắt, rõ ràng
-   🔄 **Real-time**: Cập nhật trạng thái ngay lập tức
-   📦 **Batch operations**: Xử lý nhiều thay đổi cùng lúc
-   🛡️ **Error handling**: Xử lý lỗi gracefully với rollback

## 📞 Hỗ trợ

Nếu có vấn đề, kiểm tra:

1. Console có lỗi JavaScript không
2. Notification component đã được import trong App.js chưa
3. Service đã được import đúng chưa
4. CSS đã được load chưa
