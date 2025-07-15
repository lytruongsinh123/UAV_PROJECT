import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import * as actions from "../../../store/actions";
import "./Registration.css";

class RegisterUav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ownerId: "",
            droneId: "",
            droneName: "",
            startPoint: "",
            endPoint: "",
            heightFly: "",
            speed: "",
            status: "pending",
        };
    }

    componentDidMount = async () => {};
    componentDidUpdate = async (prevProps, prevState, snapshot) => {};

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value,
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
        this.props.createUavStart({
            ownerId,
            droneId,
            droneName,
            startPoint,
            endPoint,
            heightFly,
            speed,
            status,
        });
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
        console.log("check state:", this.state);
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
                        <button type="button" className="btn-cancel">
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
        return <Component {...props} navigate={navigate} />;
    };
};

const mapStateToProps = (state) => {
    return {
        // language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        createUavStart: (data) => dispatch(actions.createUavStart(data)), // ✅ Sửa tên
    };
};

export default withNavigate(
    connect(mapStateToProps, mapDispatchToProps)(RegisterUav)
);
