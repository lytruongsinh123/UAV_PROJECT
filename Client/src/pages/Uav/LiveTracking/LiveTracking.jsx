import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import LiveTrackingCard from "../../../components/LiveTrackingCard/LiveTrackingCard";
import * as actions from "../../../store/actions/uavRegisterActions";
import "./LiveTracking.css";

class DefaultClass extends Component {
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
            await this.props.fetchUavsByStatusAndOwner("S1", this.props.userInfo.id);
        }
    };

    componentDidUpdate = async (prevProps, prevState, snapshot) => {
        if (prevProps.uavs !== this.props.uavs) {
            // Filter UAVs đang hoạt động
            const activeUAVs = this.props.uavs.filter(
                (uav) => uav.status === "S1"
            );
            this.setState({ activeUAVs });
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
                            <i className="fas fa-arrow-left"></i> Quay lại
                        </button>
                        <h2>Live Tracking - {selectedUAV.droneName}</h2>
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
                        Live Tracking Dashboard
                    </h1>
                    <div className="stats">
                        <div className="stat-item">
                            <span className="stat-number">
                                {activeUAVs.length}
                            </span>
                            <span className="stat-label">
                                UAVs Đang Hoạt Động
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
                                        <span>Hoạt động</span>
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
                                        Theo dõi
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
const withNavigate = (Component) => {
    return (props) => {
        const navigate = useNavigate();
        return <Component {...props} navigate={navigate} />;
    };
};
const mapStateToProps = (state) => {
    return {
        userInfo: state.user.userInfo,
        uavs: state.uavRegister.uavsByStatus,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUavsByStatusAndOwner: (status, ownerId) =>
            dispatch(actions.fetchUavsByStatusAndOwner(status, ownerId)),
    };
};

export default withNavigate(
    connect(mapStateToProps, mapDispatchToProps)(DefaultClass)
);
