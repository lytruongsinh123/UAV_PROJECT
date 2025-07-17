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
            receivedId: "",
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

    handleReceiveId = (id) => {
        if (id) {
            this.setState({ receivedId: id }, () => {
                getUavsByDroneId(id).then((res) => {
                    if (res && res.errCode === 0) {
                        const uav = res.uavs;
                        this.setState({
                            ownerId: uav.ownerId,
                            droneId: uav.droneId,
                            droneName: uav.droneName,
                            startPoint: uav.startPoint,
                            endPoint: uav.endPoint,
                            heightFly: uav.heightFly,
                            speed: uav.speed,
                            status: uav.status,
                        });
                    }
                });
            });
        }
    };

    async componentDidMount() {
        this.setState({
            ownerId: this.props.userInfo.id,
        });
        if (this.props.actions === crud_actions.EDIT) {
            emitter.on("sendId", (id) => this.handleReceiveId(id));
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
        this.props.HandleChangeAction(crud_actions.CREATE);
    };
    handleSubmit = async (event) => {
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
        const { actions } = this.props;
        if (actions === crud_actions.CREATE) {
            let res = await this.props.RegisterUavStart({
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
            let res = await this.props.UpdateUavStart({
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
                    droneId: "",
                    droneName: "",
                    startPoint: "",
                    endPoint: "",
                    heightFly: "",
                    speed: "",
                    status: "pending",
                });
            }
        }
        await this.props.fetchUavsRegisteredByOwner(ownerId); // Gọi fetch trước
        if (this.props.navigate) {
            this.props.navigate("/dashboard");
        }
    };

    render() {
        const {
            droneId,
            droneName,
            startPoint,
            endPoint,
            heightFly,
            speed,
            status,
        } = this.state;
        const { userInfo } = this.props;
        console.log("State in render:", this.state);
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
                                value={userInfo.id}
                                onChange={this.handleInputChange}
                                placeholder="Enter owner ID"
                                required
                                readOnly
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
                            {this.props.actions === crud_actions.CREATE
                                ? "Register UAV"
                                : "Update UAV"}
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
        userInfo: state.user.userInfo,
        actions: state.uavRegister.actions,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUavsRegisteredByOwner: (ownerId) =>
            dispatch(actions.fetchAllUavsByOwner(ownerId)),
        RegisterUavStart: (data) => dispatch(actions.registerUav(data)),
        UpdateUavStart: (data) => dispatch(actions.updateUavRedux(data)),
        HandleChangeAction: (action) =>
            dispatch(actions.ActionUavRegister(action)),
    };
};

export default withNavigate(
    connect(mapStateToProps, mapDispatchToProps)(RegisterUav)
);
