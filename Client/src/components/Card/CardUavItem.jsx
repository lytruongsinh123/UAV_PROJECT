import React, { Component } from "react";
import { crud_actions } from "../../utils/constants";
import { connect } from "react-redux";
import { statusUav } from "../../utils/constants";
import "./CardUavItem.css"; // Import your CSS file
class CardUavItem extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    async componentDidUpdate(prevProps) {
        if (prevProps.uavState !== this.props.uavState) {
            console.log("UAV data updated:", this.props.uavState);
        }
    }
    getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "active":
                return "✅";
            case "pending":
                return "⏳";
            case "maintenance":
                return "🔧";
            default:
                return "❓";
        }
    };
    canNotEditOrDeleteOrLaunch = () => {
        const { uav } = this.props;
        return uav.status === statusUav.MAINTENANCE;
    };
    completedUav = () => {
        const { uav } = this.props;
        return uav.status === statusUav.COMPLETED;
    };
    render() {
        const { uav, index, onEdit, onDelete, onActivate, onMaintenance } =
            this.props;

        return (
            <div key={index} className="uav-item">
                <div className="uav-header">
                    <div className="uav-id">
                        <i className="fas fa-drone"></i>
                        <span>{uav.droneId}</span>
                    </div>
                    <div
                        className="uav-status"
                        data-status={uav.status?.toLowerCase()}>
                        {this.getStatusIcon(uav.status)} {uav.status}
                    </div>
                </div>

                <div className="uav-body">
                    <div className="uav-info">
                        <div className="info-item">
                            <i className="fas fa-tag"></i>
                            <span className="label">Name:</span>
                            <span className="value">{uav.droneName}</span>
                        </div>

                        <div className="info-item">
                            <i className="fas fa-map-marker-alt"></i>
                            <span className="label">Start Point:</span>
                            <span className="value">{uav.startPoint}</span>
                        </div>

                        <div className="info-item">
                            <i className="fas fa-flag-checkered"></i>
                            <span className="label">End Point:</span>
                            <span className="value">{uav.endPoint}</span>
                        </div>

                        <div className="info-item">
                            <i className="fas fa-arrows-alt-v"></i>
                            <span className="label">Height:</span>
                            <span className="value">{uav.heightFly}m</span>
                        </div>

                        <div className="info-item">
                            <i className="fas fa-tachometer-alt"></i>
                            <span className="label">Speed:</span>
                            <span className="value">{uav.speed} km/h</span>
                        </div>
                    </div>

                    <div className="uav-actions">
                        {this.props.uavState === "S0" && (
                            <>
                                <button
                                    className="btn-edit"
                                    onClick={() => onEdit(uav)}>
                                    <i className="fas fa-edit"></i>
                                    Edit
                                </button>
                                <button
                                    className="btn-delete"
                                    onClick={() => onDelete(uav)}>
                                    <i className="fas fa-trash"></i>
                                    Delete
                                </button>
                                <button
                                    className="btn-launch"
                                    onClick={() => onActivate(uav)}>
                                    <i className="fas fa-rocket"></i>
                                    Active
                                </button>
                                <button
                                    className="maintenance-notice"
                                    onClick={() => onMaintenance(uav)}>
                                    <i className="fas fa-tools"></i>
                                    Maintenance
                                </button>
                            </>
                        )}
                        {this.props.uavState === "S1" && (
                            <>
                                <span className="not-allowed">
                                    <i className="fas fa-ban"></i>
                                    Drone is active
                                </span>
                            </>
                        )}
                        {this.props.uavState === "S2" && (
                            <>
                                <span className="maintenance-notice">
                                    <i className="fas fa-tools"></i>
                                    Maintenance
                                </span>
                            </>
                        )}
                        {this.completedUav() && (
                            <>
                                <span className="completed-notice">
                                    <i className="fas fa-check-circle"></i>
                                    Completed
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        // language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(CardUavItem);
