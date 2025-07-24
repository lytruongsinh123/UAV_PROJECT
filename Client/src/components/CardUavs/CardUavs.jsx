import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import { Buffer } from 'buffer';
import "./CardUavs.css";

class CardUavs extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount = async () => {};

    componentDidUpdate = async (prevProps, prevState, snapshot) => {};

    getPerformanceColor = (performance) => {
        switch (performance?.toLowerCase()) {
            case "excellent":
                return "#10b981"; // green
            case "good":
                return "#3b82f6"; // blue
            case "average":
                return "#f59e0b"; // amber
            case "poor":
                return "#ef4444"; // red
            default:
                return "#6b7280"; // gray
        }
    };

    getPerformanceIcon = (performance) => {
        switch (performance?.toLowerCase()) {
            case "excellent":
                return "fas fa-star";
            case "good":
                return "fas fa-thumbs-up";
            case "average":
                return "fas fa-minus-circle";
            case "poor":
                return "fas fa-exclamation-triangle";
            default:
                return "fas fa-question";
        }
    };

    render() {
        const { uav } = this.props; // Nhận UAV data từ props
        // Default values nếu không có data
        const uavData = uav || {
            droneId: "DRN-001",
            droneName: "Demo Drone",
            speedMax: 60,
            hightMax: 500,
            performance: "Good",
            image: null,
        };

        return (
            <div className="card-uavs-container">
                {/* UAV Image */}
                <div className="uav-image">
                    {uavData.image ? (
                        <img
                            src={uavData.image ? Buffer.from(uavData.image, "base64").toString("binary") : ""}
                            alt={uavData.droneName}
                            className="drone-img"
                        />
                    ) : (
                        <div className="no-image">
                            <i className="fas fa-drone"></i>
                            <span>No Image</span>
                        </div>
                    )}
                </div>

                {/* UAV Information */}
                <div className="uav-information">
                    <div className="uav-header">
                        <div className="uav-id">
                            <i className="fas fa-tag"></i>
                            <span className="label">ID:</span>
                            <span className="value">{uavData.droneId}</span>
                        </div>
                        <div className="uav-status">
                            <span className="status-indicator active"></span>
                            <span>Active</span>
                        </div>
                    </div>

                    <div className="uav-name">
                        <h3>
                            <i className="fas fa-helicopter"></i>
                            {uavData.droneName}
                        </h3>
                    </div>

                    <div className="uav-specs">
                        <div className="spec-item uav-speedmax">
                            <div className="spec-icon">
                                <i className="fas fa-tachometer-alt"></i>
                            </div>
                            <div className="spec-info">
                                <span className="spec-label">Max Speed</span>
                                <span className="spec-value">
                                    {uavData.speedMax} km/h
                                </span>
                            </div>
                        </div>

                        <div className="spec-item uav-highmax">
                            <div className="spec-icon">
                                <i className="fas fa-arrows-alt-v"></i>
                            </div>
                            <div className="spec-info">
                                <span className="spec-label">Max Height</span>
                                <span className="spec-value">
                                    {uavData.hightMax} m
                                </span>
                            </div>
                        </div>

                        <div className="spec-item uav-performance">
                            <div className="spec-icon">
                                <i
                                    className={this.getPerformanceIcon(
                                        uavData.performance
                                    )}
                                    style={{
                                        color: this.getPerformanceColor(
                                            uavData.performance
                                        ),
                                    }}></i>
                            </div>
                            <div className="spec-info">
                                <span className="spec-label">Performance</span>
                                <span
                                    className="spec-value performance-badge"
                                    style={{
                                        backgroundColor:
                                            this.getPerformanceColor(
                                                uavData.performance
                                            ) + "20",
                                        color: this.getPerformanceColor(
                                            uavData.performance
                                        ),
                                    }}>
                                    {uavData.performance}
                                </span>
                            </div>
                        </div>
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
        // language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default withNavigate(
    connect(mapStateToProps, mapDispatchToProps)(CardUavs)
);
