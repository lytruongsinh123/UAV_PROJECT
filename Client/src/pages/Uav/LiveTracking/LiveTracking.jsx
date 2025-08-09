import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { useNavigate, useParams } from "react-router-dom";
import LiveTrackingCard from "../../../components/LiveTrackingCard/LiveTrackingCard";
import * as actions from "../../../store/actions/uavRegisterActions";
import "./LiveTracking.css";

class LiveTracking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeUAVs: [],
            selectedUAV: null,
            showFullMap: false,
        };
    }

    componentDidMount = async () => {
        // Fetch UAVs có status S1 (đang hoạt động)
        if (this.props.userInfo && this.props.userInfo.id) {
            await this.props.fetchUavsByStatusAndOwner(
                "S1",
                this.props.userInfo.id
            );
        }

        // Lấy droneId từ URL params và tự động chọn UAV nếu có
        const { droneId } = this.props.params || {};
        if (droneId && this.props.uavsByStatus) {
            const uav = this.props.uavsByStatus.find(
                (u) => u.droneId === droneId
            );
            if (uav) {
                this.handleSelectUAV(uav);
            }
        }
    };

    componentDidUpdate = async (prevProps, prevState, snapshot) => {
        if (prevProps.uavsByStatus !== this.props.uavsByStatus) {
            this.setState({
                activeUAVs: this.props.uavsByStatus,
            });

            // Nếu có droneId trên URL thì tự động chọn UAV khi dữ liệu cập nhật
            const { droneId } = this.props.params || {};
            if (droneId) {
                const uav = this.props.uavsByStatus.find(
                    (u) => u.droneId === droneId
                );
                if (uav) {
                    this.handleSelectUAV(uav);
                }
            }
        }
    };

    handleSelectUAV = (uav) => {
        this.setState({ selectedUAV: uav, showFullMap: true });
    };

    handleBackToList = () => {
        this.setState({ selectedUAV: null, showFullMap: false });
    };

    render() {
        const { activeUAVs, selectedUAV, showFullMap } = this.state;
        if (showFullMap && selectedUAV) {
            return (
                <div className="live-tracking-fullscreen">
                    <div className="fullscreen-header">
                        <button
                            onClick={this.handleBackToList}
                            className="back-btn">
                            <i className="fas fa-arrow-left"></i>
                            <FormattedMessage id="live-tracking.card.back" />
                        </button>
                        <h2>
                            <FormattedMessage id="live-tracking.card.live-tracking" />{" "}
                            - {selectedUAV.droneName}
                        </h2>
                    </div>
                    <LiveTrackingCard
                        uav={selectedUAV}
                        position1={selectedUAV.startPoint}
                        position2={selectedUAV.endPoint}
                    />
                </div>
            );
        }

        return (
            <div className="live-tracking-dashboard">
                <div className="dashboard-header">
                    <h1>
                        <i className="fas fa-satellite-dish"></i>
                        <FormattedMessage id="live-tracking.title" />
                    </h1>
                    <div className="stats">
                        <div className="stat-item">
                            <span className="tracking-stat-number">
                                {activeUAVs.length}
                            </span>
                            <span className="stat-label">
                                <FormattedMessage id="live-tracking.uavs-active" />
                            </span>
                        </div>
                    </div>
                </div>

                {activeUAVs.length > 0 ? (
                    <div className="uav-grid">
                        {activeUAVs.map((uav, index) => (
                            <div
                                key={index}
                                className="uav-card"
                                onClick={() => this.handleSelectUAV(uav)}>
                                <div className="uav-card-header">
                                    <div className="uav-avatar">
                                        <i className="fas fa-helicopter"></i>
                                    </div>
                                    <div className="uav-info">
                                        <h3>{uav.droneName}</h3>
                                        <p>ID: {uav.droneId}</p>
                                    </div>
                                    <div className="uav-status">
                                        <span className="status-indicator active"></span>
                                        <span>
                                            <FormattedMessage id="live-tracking.active" />
                                        </span>
                                    </div>
                                </div>
                                <div className="uav-card-body">
                                    <div className="route-info">
                                        <div className="route-point">
                                            <i className="fas fa-map-marker-alt start"></i>
                                            <span>{uav.startPoint}</span>
                                        </div>
                                        <div className="route-arrow">
                                            <i className="fas fa-arrow-right"></i>
                                        </div>
                                        <div className="route-point">
                                            <i className="fas fa-map-marker-alt end"></i>
                                            <span>{uav.endPoint}</span>
                                        </div>
                                    </div>
                                    <div className="flight-stats">
                                        <div className="stat">
                                            <i className="fas fa-route"></i>
                                            <span>
                                                {uav.distance
                                                    ? `${uav.distance.toFixed(
                                                          2
                                                      )} km`
                                                    : "N/A"}
                                            </span>
                                        </div>
                                        <div className="stat">
                                            <i className="fas fa-tachometer-alt"></i>
                                            <span>{uav.speed} km/h</span>
                                        </div>
                                        <div className="stat">
                                            <i className="fas fa-arrow-up"></i>
                                            <span>{uav.heightFly} m</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="uav-card-footer">
                                    <button className="track-btn">
                                        <i className="fas fa-eye"></i>
                                        <FormattedMessage id="live-tracking.track" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-active-uavs">
                        <div className="no-data-icon">
                            <i className="fas fa-drone"></i>
                        </div>
                        <h3>Không có UAV nào đang hoạt động</h3>
                        <p>
                            Các UAV cần ở trạng thái "Hoạt động" để hiển thị
                            live tracking
                        </p>
                    </div>
                )}
            </div>
        );
    }
}
// HOC để truyền params cho class component
const withNavigateAndParams = (Component) => {
    return (props) => {
        const navigate = useNavigate();
        const params = useParams();
        return <Component {...props} navigate={navigate} params={params} />;
    };
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.user.userInfo,
        uavs: state.uavRegister.uavsByStatus,
        uavsByStatus: state.uavRegister.uavsByStatus,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUavsByStatusAndOwner: (status, ownerId) =>
            dispatch(actions.fetchUavsByStatusAndOwner(status, ownerId)),
    };
};

export default withNavigateAndParams(
    connect(mapStateToProps, mapDispatchToProps)(LiveTracking)
);
