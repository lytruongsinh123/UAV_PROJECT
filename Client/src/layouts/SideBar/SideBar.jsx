import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import { getUserById } from "../../service/userService";
import notificationService from "../../services/notificationService";
import * as actions from "../../store/actions";
import themeUtils from "../../utils/ThemeUtils";
import "./SideBar.css";
class SlideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            notifications: [],
            unreadCount: 0,
            isNotificationPanelOpen: false,
            currentTheme: themeUtils.getCurrentTheme(),
        };
    }
    // thực hiện một lần
    componentDidMount = async () => {
        let user = await getUserById(this.props.userId);
        this.setState({
            user: user.data,
        });

        //  Lắng nghe thông báo mới
        window.addEventListener("showNotification", this.handleNewNotification);

        //  Lắng nghe thay đổi theme
        themeUtils.addListener(this.handleThemeChange);
    };

    componentWillUnmount() {
        // Cleanup event listener
        window.removeEventListener(
            "showNotification",
            this.handleNewNotification
        );

        // Cleanup theme listener
        themeUtils.removeListener(this.handleThemeChange);
    }

    //  Xử lý thay đổi theme
    handleThemeChange = (theme) => {
        this.setState({ currentTheme: theme });
    };
    toggleTheme = () => {
        const newTheme = themeUtils.toggleTheme();
        this.setState({ currentTheme: newTheme });
    };

    //  Xử lý thông báo mới
    handleNewNotification = (event) => {
        const notification = {
            ...event.detail,
            isRead: false,
            showInSidebar: true, // Chỉ hiển thị một số loại thông báo trong sidebar
        };

        // Chỉ hiển thị thông báo UAV-related trong sidebar
        if (this.shouldShowInSidebar(notification)) {
            this.setState((prevState) => ({
                notifications: [
                    notification,
                    ...prevState.notifications.slice(0, 19),
                ], // Giữ tối đa 20 thông báo
                unreadCount: prevState.unreadCount + 1,
            }));
        }
    };

    //  Kiểm tra xem thông báo có nên hiển thị trong sidebar không
    shouldShowInSidebar = (notification) => {
        const sidebarTypes = ["status-change", "success", "error", "warning"];
        return sidebarTypes.includes(notification.type);
    };

    //  Toggle notification panel
    toggleNotificationPanel = () => {
        this.setState((prevState) => ({
            isNotificationPanelOpen: !prevState.isNotificationPanelOpen,
        }));
    };

    //  Đánh dấu tất cả thông báo đã đọc
    markAllAsRead = () => {
        this.setState((prevState) => ({
            notifications: prevState.notifications.map((n) => ({
                ...n,
                isRead: true,
            })),
            unreadCount: 0,
        }));
    };

    //  Xóa thông báo
    removeNotification = (id) => {
        this.setState((prevState) => ({
            notifications: prevState.notifications.filter((n) => n.id !== id),
            unreadCount:
                prevState.unreadCount -
                (prevState.notifications.find((n) => n.id === id && !n.isRead)
                    ? 1
                    : 0),
        }));
    };

    //  Định dạng thời gian
    formatNotificationTime = (timestamp) => {
        const now = new Date();
        const notificationTime = new Date(timestamp);
        const diffInMinutes = Math.floor(
            (now - notificationTime) / (1000 * 60)
        );

        if (diffInMinutes < 1) return "Just now";
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440)
            return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    //  Lấy icon cho thông báo
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

    // thực hiện mỗi khi props hoặc state thay đổi
    componentDidUpdate = async (prevProps, prevState, snapshot) => {
        if (prevProps.userId !== this.props.userId) {
            let user = await getUserById(this.props.userId);
            this.setState({
                user: user.data,
            });
        }
    };
    handleNavigate = (path) => {
        if (this.props.navigate) {
            this.props.navigate(`/${path}`);
        }
    };

    //  Test function để tạo thông báo demo
    testNotifications = () => {
        // Test notification mới
        notificationService.statusChange("UAV001", "Pending", "Active");

        setTimeout(() => {
            notificationService.success(
                "Mission Complete",
                "UAV002 has completed its mission successfully"
            );
        }, 2000);

        setTimeout(() => {
            notificationService.error(
                "Connection Lost",
                "UAV003 lost connection to ground station"
            );
        }, 4000);

        setTimeout(() => {
            notificationService.warning(
                "Battery Low",
                "UAV001 battery level is below 20%"
            );
        }, 6000);
    };
    render() {
        const isOpenSidebar = this.props.isOpenSidebar;
        let avatarSrc = "https://via.placeholder.com/150";
        if (this.state.user.image && this.state.user.image.data) {
            // Convert Uint8Array to base64 string (browser safe)
            const uint8Array = new Uint8Array(this.state.user.image.data);
            const base64String = btoa(
                uint8Array.reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ""
                )
            );
            avatarSrc = `data:image/jpeg;base64,${base64String}`;
        }
        return (
            <div className="sidebar">
                <div
                    className="avatar"
                    onClick={() => this.handleNavigate("edit-user")}>
                    <div
                        className="image-avatar"
                        style={{
                            backgroundImage: `url(${avatarSrc})`,
                        }}></div>
                    {isOpenSidebar ? (
                        <span>
                            {this.state.user.firstName +
                                " " +
                                this.state.user.lastName}
                        </span>
                    ) : (
                        ""
                    )}
                </div>
                <div className="main-section">
                    <div
                        className="home"
                        onClick={() => this.handleNavigate("homeuav")}>
                        <i className="fas fa-home"></i>
                        {isOpenSidebar ? (
                            <span>
                                <FormattedMessage id="sidebar.home" />
                            </span>
                        ) : (
                            ""
                        )}
                    </div>
                    <div
                        className="dsashboard"
                        onClick={() => this.handleNavigate("dashboard")}>
                        <i className="fas fa-tachometer-alt"></i>
                        {isOpenSidebar ? (
                            <span>
                                <FormattedMessage id="sidebar.dashboard" />
                            </span>
                        ) : (
                            ""
                        )}
                    </div>
                    <div
                        className="settings"
                        onClick={() => this.handleNavigate("settings")}>
                        <i className="fas fa-cog"></i>
                        {isOpenSidebar ? (
                            <span>
                                <FormattedMessage id="sidebar.settings" />
                            </span>
                        ) : (
                            ""
                        )}
                    </div>

                    <div
                        className="settings"
                        onClick={() => this.handleNavigate("show-list-uavs")}>
                        <i className="fa-solid fa-helicopter"></i>
                        {isOpenSidebar ? (
                            <span>
                                <FormattedMessage id="sidebar.uav" />
                            </span>
                        ) : (
                            ""
                        )}
                    </div>

                    {/* 🧪 Test button for notifications - Remove in production */}
                    <div
                        className="test-notifications"
                        onClick={this.testNotifications}
                        style={{
                            opacity: 0.7,
                            fontSize: "12px",
                            cursor: "pointer",
                            padding: "8px 16px",
                            borderTop: "1px solid rgba(255,255,255,0.1)",
                        }}>
                        <i className="fas fa-vial"></i>
                        {isOpenSidebar ? (
                            <span>
                                <FormattedMessage id="sidebar.test-notifications" />
                            </span>
                        ) : (
                            ""
                        )}
                    </div>
                    <div
                        className="notifications"
                        onClick={this.toggleNotificationPanel}>
                        <i className="fas fa-bell"></i>
                        {this.state.unreadCount > 0 && (
                            <span className="notification-badge">
                                {this.state.unreadCount > 99
                                    ? "99+"
                                    : this.state.unreadCount}
                            </span>
                        )}
                        {isOpenSidebar ? (
                            <span>
                                <FormattedMessage id="sidebar.notifications" />
                            </span>
                        ) : (
                            ""
                        )}
                    </div>

                    {/* 🔔 Notification Panel */}
                    {this.state.isNotificationPanelOpen && (
                        <div className="notification-panel">
                            <div className="notification-header">
                                <h4>
                                    <FormattedMessage id="sidebar.notifications" />
                                </h4>
                                <div className="notification-actions">
                                    {this.state.unreadCount > 0 && (
                                        <button
                                            className="mark-all-read"
                                            onClick={this.markAllAsRead}
                                            title="Mark all as read">
                                            <i className="fas fa-check-double"></i>
                                        </button>
                                    )}
                                    <button
                                        className="close-panel"
                                        onClick={this.toggleNotificationPanel}
                                        title="Close">
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>

                            <div className="notification-list">
                                {this.state.notifications.length > 0 ? (
                                    this.state.notifications.map(
                                        (notification) => (
                                            <div
                                                key={notification.id}
                                                className={`notification-item ${
                                                    !notification.isRead
                                                        ? "unread"
                                                        : ""
                                                }`}>
                                                <div className="notification-icon">
                                                    {this.getNotificationIcon(
                                                        notification.type
                                                    )}
                                                </div>
                                                <div className="notification-content">
                                                    <div className="notification-title">
                                                        {notification.title}
                                                    </div>
                                                    <div className="notification-message">
                                                        {notification.message}
                                                    </div>
                                                    <div className="notification-time">
                                                        {this.formatNotificationTime(
                                                            notification.timestamp
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    className="remove-notification"
                                                    onClick={() =>
                                                        this.removeNotification(
                                                            notification.id
                                                        )
                                                    }
                                                    title="Remove">
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            </div>
                                        )
                                    )
                                ) : (
                                    <div className="no-notifications">
                                        <i className="fas fa-bell-slash"></i>
                                        <p>
                                            <FormattedMessage id="sidebar.not-notifications" />
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className="sub-section">
                    <div className="theme-toggle" onClick={this.toggleTheme}>
                        <i
                            className={themeUtils.getThemeIcon(
                                this.state.currentTheme
                            )}></i>
                        <span className="title">
                            {this.state.currentTheme === "light" ? (
                                <FormattedMessage id="sidebar.light-mode" />
                            ) : this.state.currentTheme === "dark" ? (
                                <FormattedMessage id="sidebar.dark-mode" />
                            ) : (
                                <FormattedMessage id="sidebar.auto-mode" />
                            )}
                        </span>
                    </div>
                    <div
                        className="help"
                        onClick={() => this.handleNavigate("help")}>
                        <i className="fas fa-question-circle"></i>
                        <span className="title">
                            <FormattedMessage id="sidebar.help" />
                        </span>
                    </div>
                    <div
                        className="feedback"
                        onClick={() => this.handleNavigate("feedback")}>
                        <i className="fas fa-comment-dots"></i>
                        <span className="title">
                            <FormattedMessage id="sidebar.feedback" />
                        </span>
                    </div>
                    <div
                        className="logout"
                        onClick={this.props.handleLogoutRedux}>
                        <i className="fas fa-sign-out-alt"></i>
                        <span className="title">
                            <FormattedMessage id="sidebar.logout" />
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

const withNavigate = (Component) => {
    return (props) => {
        const navigate = useNavigate();
        return <Component {...props} navigate={navigate} />;
    };
};
const mapStateToProps = (state) => {
    return {
        userId: state.user.userInfo.id,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleLogoutRedux: () => {
            dispatch(actions.handleLogout());
        },
    };
};

export default withNavigate(
    connect(mapStateToProps, mapDispatchToProps)(SlideBar)
);
