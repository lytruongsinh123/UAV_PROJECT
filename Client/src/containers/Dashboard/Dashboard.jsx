import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./Dashboard.css";
class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTime: new Date(),
        };
    }

    componentDidMount = async () => {
        // Update time every second
        this.timeInterval = setInterval(() => {
            this.setState({ currentTime: new Date() });
        }, 1000);
    };

    componentWillUnmount() {
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
        }
    }

    formatTime = (date) => {
        return date.toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    formatDate = (date) => {
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    render() {
        const { userInfo } = this.props;
        const { currentTime } = this.state;
        console.log("User Info:", userInfo);
        return (
            <div className="dashboard">
                <div className="dashboard-container">
                    {/* Header Section */}
                    <div className="dashboard-header">
                        <div className="welcome-section">
                            <h1 className="welcome-title">
                                Welcome back,{" "}
                                {userInfo &&
                                userInfo.firstName &&
                                userInfo.lastName
                                    ? `${userInfo.firstName} ${userInfo.lastName}`
                                    : "User"}
                                !
                            </h1>
                            <p className="welcome-subtitle">
                                Here's what's happening with your UAV registry
                                today
                            </p>
                        </div>
                        <div className="time-section">
                            <div className="current-time">
                                {this.formatTime(currentTime)}
                            </div>
                            <div className="current-date">
                                {this.formatDate(currentTime)}
                            </div>
                        </div>
                    </div>

                    {/* User Info Card */}
                    <div className="user-info-card">
                        <div className="user-avatar">
                            <i className="fas fa-user"></i>
                        </div>
                        <div className="user-details">
                            <h3>User Information</h3>
                            <div className="user-item">
                                <span className="label">Email:</span>
                                <span className="value">
                                    {userInfo?.email || "N/A"}
                                </span>
                            </div>
                            <div className="user-item">
                                <span className="label">Username:</span>
                                <span className="value">
                                    {userInfo &&
                                    userInfo.firstName &&
                                    userInfo.lastName
                                        ? `${userInfo.firstName} ${userInfo.lastName}`
                                        : "User"}
                                </span>
                            </div>
                            <div className="user-item">
                                <span className="label">Role:</span>
                                <span className="value role-badge">
                                    {userInfo?.positionId
                                        ? userInfo.positionId
                                        : "N/A"}
                                </span>
                            </div>
                            <div className="user-item">
                                <span className="label">Status:</span>
                                <span className="value status-active">
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-plane"></i>
                            </div>
                            <div className="stat-content">
                                <div className="stat-number">12</div>
                                <div className="stat-label">
                                    Registered UAVs
                                </div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-route"></i>
                            </div>
                            <div className="stat-content">
                                <div className="stat-number">8</div>
                                <div className="stat-label">Flight Paths</div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-map-marker-alt"></i>
                            </div>
                            <div className="stat-content">
                                <div className="stat-number">3</div>
                                <div className="stat-label">Active Flights</div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-clock"></i>
                            </div>
                            <div className="stat-content">
                                <div className="stat-number">24.5</div>
                                <div className="stat-label">Total Hours</div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="recent-activity">
                        <h3>Recent Activity</h3>
                        <div className="activity-list">
                            <div className="activity-item">
                                <div className="activity-icon">
                                    <i className="fas fa-plus-circle"></i>
                                </div>
                                <div className="activity-content">
                                    <div className="activity-title">
                                        New UAV Registered
                                    </div>
                                    <div className="activity-time">
                                        2 hours ago
                                    </div>
                                </div>
                            </div>

                            <div className="activity-item">
                                <div className="activity-icon">
                                    <i className="fas fa-map"></i>
                                </div>
                                <div className="activity-content">
                                    <div className="activity-title">
                                        Flight Path Updated
                                    </div>
                                    <div className="activity-time">
                                        5 hours ago
                                    </div>
                                </div>
                            </div>

                            <div className="activity-item">
                                <div className="activity-icon">
                                    <i className="fas fa-check-circle"></i>
                                </div>
                                <div className="activity-content">
                                    <div className="activity-title">
                                        Flight Completed
                                    </div>
                                    <div className="activity-time">
                                        1 day ago
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="quick-actions">
                        <h3>Quick Actions</h3>
                        <div className="actions-grid">
                            <button className="action-btn">
                                <i className="fas fa-plus"></i>
                                <span>Register New UAV</span>
                            </button>
                            <button className="action-btn">
                                <i className="fas fa-route"></i>
                                <span>Plan Flight Path</span>
                            </button>
                            <button className="action-btn">
                                <i className="fas fa-eye"></i>
                                <span>View Live Tracking</span>
                            </button>
                            <button className="action-btn">
                                <i className="fas fa-download"></i>
                                <span>Export Data</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.user.userInfo,
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
