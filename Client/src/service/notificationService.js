// Notification Service để quản lý thông báo toàn cục
class NotificationService {
    constructor() {
        this.notifications = [];
        this.listeners = [];
    }

    // Hiển thị thông báo
    show(type, title, message, options = {}) {
        const notification = {
            id: Date.now() + Math.random(),
            type,
            title,
            message,
            timestamp: new Date(),
            duration: options.duration || 5000,
            isRead: false,
            ...options,
        };

        // Lưu vào danh sách thông báo
        this.notifications.unshift(notification);

        // Giữ tối đa 50 thông báo
        if (this.notifications.length > 50) {
            this.notifications = this.notifications.slice(0, 50);
        }

        // Dispatch custom event để component lắng nghe
        const event = new CustomEvent("showNotification", {
            detail: notification,
        });
        window.dispatchEvent(event);

        return notification.id;
    }

    // Shortcuts cho các loại thông báo
    success(title, message, options = {}) {
        return this.show("success", title, message, options);
    }

    error(title, message, options = {}) {
        return this.show("error", title, message, options);
    }

    warning(title, message, options = {}) {
        return this.show("warning", title, message, options);
    }

    info(title, message, options = {}) {
        return this.show("info", title, message, options);
    }

    // Thông báo đặc biệt cho status change
    statusChange(droneId, oldStatus, newStatus, options = {}) {
        const title = `UAV Status Changed`;
        const message = `Drone ${droneId}: ${oldStatus} → ${newStatus}`;
        return this.show("status-change", title, message, options);
    }

    // Thông báo batch status change
    batchStatusChange(changes, options = {}) {
        const title = `Batch Status Update`;
        const message = `Updated ${changes.length} UAV(s) status`;
        return this.show("status-change", title, message, options);
    }

    // Thông báo UAV actions
    uavAction(action, droneId, details = "", options = {}) {
        const actionMessages = {
            ACTIVATE: "🚀 Activated",
            DEACTIVATE: "⏸️ Deactivated",
            MAINTENANCE: "🔧 Maintenance Mode",
            COMPLETE: "✅ Completed",
            REGISTER: "📝 Registered",
            DELETE: "🗑️ Deleted",
            EDIT: "✏️ Updated",
        };

        const title = `UAV ${actionMessages[action] || action}`;
        const message = `Drone ${droneId} ${details}`;

        // Determine type based on action
        let type = "info";
        if (["ACTIVATE", "COMPLETE", "REGISTER"].includes(action)) {
            type = "success";
        } else if (["DELETE", "MAINTENANCE"].includes(action)) {
            type = "warning";
        }

        return this.show(type, title, message, options);
    }

    // Ẩn thông báo (nếu cần thiết)
    hide(id) {
        const event = new CustomEvent("hideNotification", {
            detail: { id },
        });
        window.dispatchEvent(event);
    }

    // Ẩn tất cả thông báo
    hideAll() {
        const event = new CustomEvent("hideAllNotifications");
        window.dispatchEvent(event);
    }

    // Lấy danh sách thông báo (cho sidebar)
    getNotifications() {
        return this.notifications;
    }

    // Xóa thông báo khỏi danh sách
    removeNotification(id) {
        this.notifications = this.notifications.filter((n) => n.id !== id);
        const event = new CustomEvent("notificationRemoved", {
            detail: { id },
        });
        window.dispatchEvent(event);
    }

    // Đánh dấu thông báo đã đọc
    markAsRead(id) {
        const notification = this.notifications.find((n) => n.id === id);
        if (notification) {
            notification.isRead = true;
            const event = new CustomEvent("notificationRead", {
                detail: { id },
            });
            window.dispatchEvent(event);
        }
    }

    // Đánh dấu tất cả đã đọc
    markAllAsRead() {
        this.notifications.forEach((n) => (n.isRead = true));
        const event = new CustomEvent("allNotificationsRead");
        window.dispatchEvent(event);
    }

    // Lấy số lượng thông báo chưa đọc
    getUnreadCount() {
        return this.notifications.filter((n) => !n.isRead).length;
    }
}

// Tạo instance singleton
const notificationService = new NotificationService();

export default notificationService;
