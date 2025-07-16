import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { useNavigate, useLocation } from "react-router-dom";
import * as actions from "../../../store/actions";
import { crud_actions } from "../../../utils/constants.js";
import { getUavsByDroneId } from "../../../service/uavRegisterService";
import emitter from "../../../utils/eventBus.js";
import "./Registration.css";

class RegisterUav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ownerId: null,
            droneId: "",
            droneName: "",
            startPoint: "",
            endPoint: "",
            heightFly: null,
            speed: null,
            status: "pending",
        };
    }

    async componentDidMount() {
        console.log("=== componentDidMount ===");
        console.log("Props actions:", this.props.actions);
        console.log("crud_actions.EDIT:", crud_actions.EDIT);
        console.log("Actions match:", this.props.actions === crud_actions.EDIT);

        if (this.props.actions === crud_actions.EDIT) {
            console.log("✅ Setting up EDIT mode listener");

            this.handler = async (id) => {
                console.log("🔔 Received ID from event bus:", id);

                try {
                    console.log("📞 Calling getUavsByDroneId with ID:", id);
                    let res = await getUavsByDroneId(id);
                    console.log("📡 API response:", res);

                    if (res && res.errCode === 0) {
                        let uav = res.uavs;
                        console.log("✅ UAV data found:", uav);
                        console.log("📝 About to setState with:", {
                            ownerId: uav.ownerId,
                            droneId: uav.droneId,
                            droneName: uav.droneName,
                            startPoint: uav.startPoint,
                            endPoint: uav.endPoint,
                            heightFly: uav.heightFly,
                            speed: uav.speed,
                            status: uav.status,
                        });

                        // ✅ Sử dụng callback để debug setState
                        this.setState(
                            {
                                ownerId: uav.ownerId,
                                droneId: uav.droneId,
                                droneName: uav.droneName,
                                startPoint: uav.startPoint,
                                endPoint: uav.endPoint,
                                heightFly: uav.heightFly,
                                speed: uav.speed,
                                status: uav.status,
                            },
                            () => {
                                console.log("🎉 setState COMPLETED!");
                                console.log("🔍 New state:", this.state);
                                console.log(
                                    "🆔 DroneId in state:",
                                    this.state.droneId
                                );
                                console.log(
                                    "📝 DroneName in state:",
                                    this.state.droneName
                                );
                            }
                        );
                    } else {
                        console.error("❌ API error:", res);
                    }
                } catch (error) {
                    console.error("💥 Error loading UAV:", error);
                }
            };

            emitter.on("sendId", this.handler);
            console.log("👂 Event listener registered for 'sendId'");
        } else {
            console.log("⚠️ Not in EDIT mode, skipping listener setup");
        }
    }
    componentWillUnmount() {
        console.log("🧹 componentWillUnmount - cleaning up");
        if (this.handler) {
            emitter.off("sendId", this.handler);
            console.log("✅ Event listener removed");
        }
    }
    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value,
        });
    };
    handleCancel = () => {
        this.setState({
            ownerId: "",
            droneId: "",
            droneName: "",
            startPoint: "",
            endPoint: "",
            heightFly: "",
            speed: "",
            status: "pending",
        });
    };
    handleSubmit = (event) => {
        event.preventDefault();
        const {
            ownerId,
            droneId,
            droneName,
            startPoint,
            endPoint,
            heightFly,
            speed,
            status,
        } = this.state;
        if (actions === crud_actions.CREATE) {
            let res = this.props.RegisterUavStart({
                ownerId,
                droneId,
                droneName,
                startPoint,
                endPoint,
                heightFly,
                speed,
                status,
            });
            if (res && res.errCode === 0) {
                this.setState({
                    ownerId: "",
                    droneId: "",
                    droneName: "",
                    startPoint: "",
                    endPoint: "",
                    heightFly: "",
                    speed: "",
                    status: "pending",
                });
            }
        } else if (actions === crud_actions.EDIT) {
        }
    };

    render() {
        const {
            ownerId,
            droneId,
            droneName,
            startPoint,
            endPoint,
            heightFly,
            speed,
            status,
        } = this.state;
        return (
            <div className="registration-uav-container">
                <div className="registration-header">
                    <div className="header-icon">
                        <i className="fas fa-helicopter"></i>
                    </div>
                    <h1>UAV Registration</h1>
                    <p>Register your drone for flight operations</p>
                </div>

                <form
                    className="registration-form"
                    onSubmit={this.handleSubmit}>
                    <div className="form-grid">
                        {/* Owner ID */}
                        <div className="form-group">
                            <label htmlFor="ownerId">
                                <i className="fas fa-user"></i>
                                Owner ID
                            </label>
                            <input
                                type="number"
                                id="ownerId"
                                name="ownerId"
                                value={ownerId}
                                onChange={this.handleInputChange}
                                placeholder="Enter owner ID"
                                required
                            />
                        </div>

                        {/* Drone ID */}
                        <div className="form-group">
                            <label htmlFor="droneId">
                                <i className="fas fa-barcode"></i>
                                Drone ID
                            </label>
                            <input
                                type="text"
                                id="droneId"
                                name="droneId"
                                value={droneId}
                                onChange={this.handleInputChange}
                                placeholder="e.g., DR-001-2024"
                                required
                            />
                        </div>

                        {/* Drone Name */}
                        <div className="form-group">
                            <label htmlFor="droneName">
                                <i className="fas fa-tag"></i>
                                Drone Name
                            </label>
                            <input
                                type="text"
                                id="droneName"
                                name="droneName"
                                value={droneName}
                                onChange={this.handleInputChange}
                                placeholder="e.g., Sky Falcon X1"
                                required
                            />
                        </div>

                        {/* Status */}
                        <div className="form-group">
                            <label htmlFor="status">
                                <i className="fas fa-info-circle"></i>
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={status}
                                onChange={this.handleInputChange}
                                required>
                                <option value="pending">Pending</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="maintenance">Maintenance</option>
                            </select>
                        </div>

                        {/* Start Point */}
                        <div className="form-group full-width">
                            <label htmlFor="startPoint">
                                <i className="fas fa-map-marker-alt"></i>
                                Start Point
                            </label>
                            <input
                                type="text"
                                id="startPoint"
                                name="startPoint"
                                value={startPoint}
                                onChange={this.handleInputChange}
                                placeholder="e.g., Hanoi Airport (21.2187, 105.8040)"
                                required
                            />
                        </div>

                        {/* End Point */}
                        <div className="form-group full-width">
                            <label htmlFor="endPoint">
                                <i className="fas fa-flag-checkered"></i>
                                End Point
                            </label>
                            <input
                                type="text"
                                id="endPoint"
                                name="endPoint"
                                value={endPoint}
                                onChange={this.handleInputChange}
                                placeholder="e.g., Ho Chi Minh Airport (10.8231, 106.6297)"
                                required
                            />
                        </div>

                        {/* Height Fly */}
                        <div className="form-group">
                            <label htmlFor="heightFly">
                                <i className="fas fa-arrows-alt-v"></i>
                                Flight Height (m)
                            </label>
                            <input
                                type="number"
                                id="heightFly"
                                name="heightFly"
                                value={heightFly}
                                onChange={this.handleInputChange}
                                placeholder="e.g., 100"
                                min="1"
                                max="500"
                                required
                            />
                        </div>

                        {/* Speed */}
                        <div className="form-group">
                            <label htmlFor="speed">
                                <i className="fas fa-tachometer-alt"></i>
                                Speed (km/h)
                            </label>
                            <input
                                type="number"
                                id="speed"
                                name="speed"
                                value={speed}
                                onChange={this.handleInputChange}
                                placeholder="e.g., 50"
                                min="1"
                                max="200"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => this.handleCancel()}>
                            <i className="fas fa-times"></i>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                            onClick={this.handleSubmit}>
                            <i className="fas fa-paper-plane"></i>
                            Register UAV
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

const withNavigate = (Component) => {
    return (props) => {
        const navigate = useNavigate();
        const location = useLocation();
        return <Component {...props} navigate={navigate} location={location} />;
    };
};

const mapStateToProps = (state) => {
    return {
        actions: state.uavRegister.actions,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        RegisterUavStart: (data) => dispatch(actions.registerUav(data)), // ✅ Sửa tên
        UpdateUavStart: (data) => dispatch(actions.updateUavRedux(data)), // ✅ Sửa tên
    };
};

export default withNavigate(
    connect(mapStateToProps, mapDispatchToProps)(RegisterUav)
);
