import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import * as actions from "../../store/actions/uavRegisterActions";
import { useNavigate } from "react-router-dom";
import { statusUav } from "../../utils/constants";
import { getUavByStatusAndOwner } from "../../service/uavRegisterService";
import ModalUav from "../../components/Modal/Modal";
import themeUtils from "../../utils/ThemeUtils";
import {
    getUavsRegisteredRecently,
    getUavsUpdatedRecently,
    getUavCompletedRecently,
} from "../../service/uavRegisterService";
import { getUserById } from "../../service/userService";
import "./Dashboard.css";
class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userimage: "",
            currentTime: new Date(),
            countUavs: 0,
            countActiveUavs: 0,
            isOpenModal: false,
            isOpenTypeModal: null,
            listCompletedUavs: [],
            sumTotalHours: 0, // = distance / speed
            countFlightPaths: 0,
            currentTheme: themeUtils.getCurrentTheme(),
            showRecentUavs: false,
            recentUavs: [],
            showUpdatedUavs: false,
            updatedUavs: [],
            showCompletedUavs: false,
            completedUavs: [],
        };
    }

    componentDidMount = async () => {
        const { userInfo } = this.props;
        if (userInfo && userInfo.id) {
            await this.props.fetchUavsRegisteredByOwner(userInfo.id);
            let listUavsByStatus = await getUavByStatusAndOwner(
                statusUav.COMPLETED,
                userInfo.id
            );
            await this.props.fetchUavsByStatusAndOwner(
                statusUav.ACTIVE,
                userInfo.id
            );
            let user = await getUserById(userInfo.id);
            this.setState({
                listCompletedUavs: listUavsByStatus,
                countFlightPaths: listUavsByStatus.uavs.length,
                userimage: user.data.image,
            });
            // Calculate total flight hours
            let totalHours = 0;
            listUavsByStatus.uavs.forEach((uav) => {
                if (uav.distance && uav.speed) {
                    totalHours += uav.distance / uav.speed;
                }
            });
            this.setState({ sumTotalHours: totalHours });
        }

        // Update time every second
        this.timeInterval = setInterval(() => {
            this.setState({ currentTime: new Date() });
        }, 1000);

        // Listen for theme changes
        themeUtils.addListener(this.handleThemeChange);
    };

    handleThemeChange = (theme) => {
        this.setState({ currentTheme: theme });
    };

    loadRecentUavs = async () => {
        const { userInfo } = this.props;
        if (userInfo && userInfo.id) {
            try {
                let response = await getUavsRegisteredRecently(userInfo.id);
                if (response && response.errCode === 0) {
                    this.setState({ recentUavs: response.uavs });
                }
            } catch (error) {
                console.error("Error loading recent UAVs:", error);
            }
        }
    };

    handleToggleRecentUavs = async () => {
        if (!this.state.showRecentUavs && this.state.recentUavs.length === 0) {
            await this.loadRecentUavs();
        }
        this.setState({ showRecentUavs: !this.state.showRecentUavs });
    };

    loadUpdatedUavs = async () => {
        const { userInfo } = this.props;
        if (userInfo && userInfo.id) {
            try {
                let response = await getUavsUpdatedRecently(userInfo.id);
                if (response && response.errCode === 0) {
                    this.setState({ updatedUavs: response.uavs });
                }
            } catch (error) {
                console.error("Error loading updated UAVs:", error);
            }
        }
    };

    handleToggleUpdatedUavs = async () => {
        if (
            !this.state.showUpdatedUavs &&
            this.state.updatedUavs.length === 0
        ) {
            await this.loadUpdatedUavs();
        }
        this.setState({ showUpdatedUavs: !this.state.showUpdatedUavs });
    };

    loadCompletedUavs = async () => {
        const { userInfo } = this.props;
        if (userInfo && userInfo.id) {
            try {
                let response = await getUavCompletedRecently(userInfo.id);
                if (response && response.errCode === 0) {
                    this.setState({ completedUavs: response.uavs });
                }
            } catch (error) {
                console.error("Error loading completed UAVs:", error);
            }
        }
    };

    handleToggleCompletedUavs = async () => {
        if (
            !this.state.showCompletedUavs &&
            this.state.completedUavs.length === 0
        ) {
            await this.loadCompletedUavs();
        }
        this.setState({ showCompletedUavs: !this.state.showCompletedUavs });
    };

    componentDidUpdate = async (prevProps) => {
        if (this.props.uavs && this.props.uavs !== prevProps.uavs) {
            this.setState({
                countUavs: this.props.uavs.length,
            });
        }
        if (
            this.props.uavsByStatus &&
            this.props.uavsByStatus !== prevProps.uavsByStatus
        ) {
            let listUavsByStatus = await getUavByStatusAndOwner(
                statusUav.COMPLETED,
                this.props.userInfo.id
            );
            this.setState({
                listCompletedUavs: listUavsByStatus,
                countFlightPaths: listUavsByStatus.uavs.length,
            });
            let totalHours = 0;
            listUavsByStatus.uavs.forEach((uav) => {
                if (uav.distance && uav.speed) {
                    totalHours +=
                        parseFloat(uav.distance) / parseFloat(uav.speed);
                }
            });
            this.setState({ sumTotalHours: totalHours });
            this.setState({
                countActiveUavs: this.props.uavsByStatus.length,
            });
        }
    };

    componentWillUnmount() {
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
        }

        // Remove theme listener
        themeUtils.removeListener(this.handleThemeChange);
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

    handleRegisterUAV = (path) => {
        if (this.props.navigate) {
            this.props.navigate(`/${path}`); // Dùng navigate để chuyển hướng
        }
    };
    handleOpenUavsActive = () => {
        this.setState({
            isOpenModal: !this.state.isOpenModal,
            isOpenTypeModal: "active",
        });
    };
    handleOpenModal = () => {
        this.setState({
            isOpenModal: !this.state.isOpenModal,
            isOpenTypeModal: "all",
        });
    };
    handleOpenModalCompleted = () => {
        this.setState({
            isOpenModal: !this.state.isOpenModal,
            isOpenTypeModal: "completed",
        });
    };
    handleToLinkFlightPaths = () => {
        if (this.props.navigate) {
            this.props.navigate("/flightpath");
        }
    };
    render() {
        const { userInfo } = this.props;
        const { currentTime, userimage } = this.state;
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
                                <FormattedMessage id="dashboard.text-notice" />
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
                            {userimage ? (
                                <img src={userimage} alt="userimage" />
                            ) : (
                                <i className="fas fa-user"></i>
                            )}
                        </div>
                        <div className="user-details">
                            <h3>
                                <FormattedMessage id="dashboard.user-info" />
                            </h3>
                            <div className="user-item">
                                <span className="label">
                                    <FormattedMessage id="dashboard.email" />:
                                </span>
                                <span className="value">
                                    {userInfo?.email || "N/A"}
                                </span>
                            </div>
                            <div className="user-item">
                                <span className="label">
                                    <FormattedMessage id="dashboard.user-name" />
                                    :
                                </span>
                                <span className="value">
                                    {userInfo &&
                                    userInfo.firstName &&
                                    userInfo.lastName
                                        ? `${userInfo.firstName} ${userInfo.lastName}`
                                        : "User"}
                                </span>
                            </div>
                            <div className="user-item">
                                <span className="label">
                                    <FormattedMessage id="dashboard.role" />:
                                </span>
                                <span className="value role-badge">
                                    {userInfo?.positionId
                                        ? userInfo.positionId
                                        : "N/A"}
                                </span>
                            </div>
                            <div className="user-item">
                                <span className="label">
                                    <FormattedMessage id="dashboard.status" />:
                                </span>
                                <span className="value status-active">
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="stats-grid">
                        <div
                            className="stat-card"
                            onClick={() => this.handleOpenModal()}>
                            <div className="stat-icon">
                                <i className="fas fa-plane"></i>
                            </div>
                            <div className="stat-content">
                                <div className="dashboard-stat-number">
                                    {this.state.countUavs}
                                </div>
                                <div className="stat-label">
                                    <FormattedMessage id="dashboard.registered-uavs" />
                                </div>
                            </div>
                        </div>

                        <div
                            className="stat-card"
                            onClick={() => this.handleToLinkFlightPaths()}>
                            <div className="stat-icon">
                                <i className="fas fa-route"></i>
                            </div>
                            <div className="stat-content">
                                <div className="dashboard-stat-number">
                                    {this.state.countFlightPaths}
                                </div>
                                <div className="stat-label">
                                    <FormattedMessage id="dashboard.flight-completed" />
                                </div>
                            </div>
                        </div>

                        <div
                            className="stat-card"
                            onClick={() => this.handleOpenUavsActive()}>
                            <div className="stat-icon">
                                <i className="fas fa-map-marker-alt"></i>
                            </div>
                            <div className="stat-content">
                                <div className="dashboard-stat-number">
                                    {this.state.countActiveUavs}
                                </div>
                                <div className="stat-label">
                                    <FormattedMessage id="dashboard.flight-active" />
                                </div>
                            </div>
                        </div>

                        <div
                            className="stat-card"
                            onClick={() => this.handleOpenModalCompleted()}>
                            <div className="stat-icon">
                                <i className="fas fa-clock"></i>
                            </div>
                            <div className="stat-content">
                                <div className="dashboard-stat-number">
                                    {this.state.sumTotalHours.toFixed(2)}
                                </div>
                                <div className="stat-label">
                                    <FormattedMessage id="dashboard.flight-hours" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="recent-activity">
                        <h3>
                            <FormattedMessage id="dashboard.recent-activity" />
                        </h3>
                        <div className="activity-list">
                            <div
                                className="activity-item"
                                onClick={this.handleToggleRecentUavs}
                                style={{ cursor: "pointer" }}>
                                <div className="activity-icon">
                                    <i className="fas fa-plus-circle"></i>
                                </div>
                                <div className="activity-content">
                                    <div className="activity-title">
                                        <FormattedMessage id="dashboard.new-registered-uav" />
                                        <i
                                            className={`fas fa-chevron-${
                                                this.state.showRecentUavs
                                                    ? "up"
                                                    : "down"
                                            }`}
                                            style={{
                                                marginLeft: "10px",
                                                fontSize: "12px",
                                            }}></i>
                                    </div>
                                </div>
                            </div>

                            {/* Recent UAVs List */}
                            {this.state.showRecentUavs && (
                                <div className="recent-uavs-list">
                                    {this.state.recentUavs.length > 0 ? (
                                        this.state.recentUavs.map(
                                            (uav, index) => (
                                                <div
                                                    key={index}
                                                    className="recent-uav-item">
                                                    <div className="uav-info">
                                                        <div className="uav-name">
                                                            {uav.name ||
                                                                `UAV-${uav.droneId}`}
                                                        </div>
                                                        <div className="uav-details">
                                                            <span>
                                                                ID:{" "}
                                                                {uav.droneId}
                                                            </span>
                                                            <span>
                                                                Status:{" "}
                                                                {uav.status}
                                                            </span>
                                                            <span>
                                                                Created:{" "}
                                                                {new Date(
                                                                    uav.createdAt
                                                                ).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <div className="no-recent-uavs">
                                            <p>No recent UAVs registered</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div
                                className="activity-item"
                                onClick={this.handleToggleUpdatedUavs}
                                style={{ cursor: "pointer" }}>
                                <div className="activity-icon">
                                    <i className="fas fa-map"></i>
                                </div>
                                <div className="activity-content">
                                    <div className="activity-title">
                                        <FormattedMessage id="dashboard.recently-updated-uav" />
                                        <i
                                            className={`fas fa-chevron-${
                                                this.state.showUpdatedUavs
                                                    ? "up"
                                                    : "down"
                                            }`}
                                            style={{
                                                marginLeft: "10px",
                                                fontSize: "12px",
                                            }}></i>
                                    </div>
                                </div>
                            </div>

                            {/* Updated UAVs List */}
                            {this.state.showUpdatedUavs && (
                                <div className="recent-uavs-list">
                                    {this.state.updatedUavs.length > 0 ? (
                                        this.state.updatedUavs.map(
                                            (uav, index) => (
                                                <div
                                                    key={index}
                                                    className="recent-uav-item">
                                                    <div className="uav-info">
                                                        <div className="uav-name">
                                                            {uav.name ||
                                                                `UAV-${uav.droneId}`}
                                                        </div>
                                                        <div className="uav-details">
                                                            <span>
                                                                ID:{" "}
                                                                {uav.droneId}
                                                            </span>
                                                            <span>
                                                                Status:{" "}
                                                                {uav.status}
                                                            </span>
                                                            <span>
                                                                Updated:{" "}
                                                                {new Date(
                                                                    uav.updatedAt
                                                                ).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <div className="no-recent-uavs">
                                            <p>
                                                <FormattedMessage id="dashboard.not-found" />
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div
                                className="activity-item"
                                onClick={this.handleToggleCompletedUavs}
                                style={{ cursor: "pointer" }}>
                                <div className="activity-icon">
                                    <i className="fas fa-check-circle"></i>
                                </div>
                                <div className="activity-content">
                                    <div className="activity-title">
                                        <FormattedMessage id="dashboard.recently-completed-uav" />
                                        <i
                                            className={`fas fa-chevron-${
                                                this.state.showCompletedUavs
                                                    ? "up"
                                                    : "down"
                                            }`}
                                            style={{
                                                marginLeft: "10px",
                                                fontSize: "12px",
                                            }}></i>
                                    </div>
                                </div>
                            </div>

                            {/* Completed UAVs List */}
                            {this.state.showCompletedUavs && (
                                <div className="recent-uavs-list">
                                    {this.state.completedUavs.length > 0 ? (
                                        this.state.completedUavs.map(
                                            (uav, index) => (
                                                <div
                                                    key={index}
                                                    className="recent-uav-item">
                                                    <div className="uav-info">
                                                        <div className="uav-name">
                                                            {uav.name ||
                                                                `UAV-${uav.droneId}`}
                                                        </div>
                                                        <div className="uav-details">
                                                            <span>
                                                                ID:{" "}
                                                                {uav.droneId}
                                                            </span>
                                                            <span>
                                                                Status:{" "}
                                                                {uav.status}
                                                            </span>
                                                            <span>
                                                                Completed:{" "}
                                                                {new Date(
                                                                    uav.updatedAt
                                                                ).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <div className="no-recent-uavs">
                                            <p>No recent UAVs completed</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="quick-actions">
                        <h3>
                            <FormattedMessage id="dashboard.quick-actions" />
                        </h3>
                        <div className="actions-grid">
                            <button
                                className="action-btn"
                                onClick={() =>
                                    this.handleRegisterUAV("registration")
                                }>
                                <i className="fas fa-plus"></i>
                                <span>
                                    <FormattedMessage id="dashboard.register-new-uav" />
                                </span>
                            </button>
                            <button className="action-btn">
                                <i className="fas fa-route"></i>
                                <span>
                                    <FormattedMessage id="dashboard.flight-path" />
                                </span>
                            </button>
                            <button className="action-btn">
                                <i className="fas fa-eye"></i>
                                <span>
                                    <FormattedMessage id="dashboard.live-tracking" />
                                </span>
                            </button>
                            <button
                                className="action-btn"
                                onClick={() =>
                                    this.handleRegisterUAV("export-data")
                                }>
                                <i className="fas fa-download"></i>
                                <span>
                                    <FormattedMessage id="dashboard.export-data" />
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Modal for Registering UAV */}
                    <ModalUav
                        isOpen={this.state.isOpenModal}
                        isOpenTypeModal={this.state.isOpenTypeModal}
                        toggleModal={() =>
                            this.setState({
                                isOpenModal: !this.state.isOpenModal,
                            })
                        }
                        listUav={this.props.uavs}
                        listUavByStatus={this.props.uavsByStatus}
                        listUavCompleted={this.state.listCompletedUavs.uavs}
                    />
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
        uavsByStatus: state.uavRegister.uavsByStatus,
        uavs: state.uavRegister.uavs,
        userInfo: state.user.userInfo,
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUavsRegisteredByOwner: (ownerId) =>
            dispatch(actions.fetchAllUavsByOwner(ownerId)),
        fetchUavsByStatusAndOwner: (status, ownerId) =>
            dispatch(actions.fetchUavsByStatusAndOwner(status, ownerId)),
    };
};

export default withNavigate(
    connect(mapStateToProps, mapDispatchToProps)(Dashboard)
);
