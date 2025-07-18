import React, { Component } from "react";
import "./Notification.css";

class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            notifications: [],
        };
    }

    componentDidMount() {
        // Lắng nghe sự kiện thông báo toàn cục
        window.addEventListener(
            "showNotification",
            this.handleShowNotification
        );
    }

    componentWillUnmount() {
        window.removeEventListener(
            "showNotification",
            this.handleShowNotification
        );
    }

    handleShowNotification = (event) => {
        const { type, title, message, duration = 5000 } = event.detail;
        const notification = {
            id: Date.now() + Math.random(),
            type,
            title,
            message,
            timestamp: new Date(),
            duration,
        };

        this.setState((prevState) => ({
            notifications: [...prevState.notifications, notification],
        }));

        // Tự động ẩn thông báo sau duration
        setTimeout(() => {
            this.removeNotification(notification.id);
        }, duration);
    };

    removeNotification = (id) => {
        this.setState((prevState) => ({
            notifications: prevState.notifications.filter((n) => n.id !== id),
        }));
    };

    getNotificationIcon = (type) => {
        switch (type) {
            case "success":
                return "✅";
            case "error":
                return "❌";
            case "warning":
                return "⚠️";
            case "info":
                return "ℹ️";
            case "status-change":
                return "🔄";
            default:
                return "📢";
        }
    };

    formatTimestamp = (timestamp) => {
        return timestamp.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    render() {
        const { notifications } = this.state;

        return (
            <div className="notification-container">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`notification notification-${notification.type}`}
                        onClick={() =>
                            this.removeNotification(notification.id)
                        }>
                        <div className="notification-icon">
                            {this.getNotificationIcon(notification.type)}
                        </div>
                        <div className="notification-content">
                            <div className="notification-header">
                                <span className="notification-title">
                                    {notification.title}
                                </span>
                                <span className="notification-time">
                                    {this.formatTimestamp(
                                        notification.timestamp
                                    )}
                                </span>
                            </div>
                            <div className="notification-message">
                                {notification.message}
                            </div>
                        </div>
                        <div className="notification-close">
                            <i className="fas fa-times"></i>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

export default Notification;
