import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { crud_actions } from "../../utils/constants";
import * as actions from "../../store/actions";
import emitter from "../../utils/eventBus";
import "./Modal.css";

class ModalUav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listUav: [],
        };
    }

    componentDidMount = async () => {
        this.setState({
            listUav: this.props.listUav,
        });
    };

    componentDidUpdate = async (prevProps, prevState, snapshot) => {
        if (prevProps.listUav !== this.props.listUav) {
            this.setState({
                listUav: this.props.listUav,
            });
        }
    };

    getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "active":
                return "✅";
            case "pending":
                return "⏳";
            case "inactive":
                return "❌";
            case "maintenance":
                return "🔧";
            default:
                return "❓";
        }
    };

    handleRegisterUAV = () => {
        // Navigate to registration page
        this.props.navigate("/registration");
        this.props.toggleModal();
    };
    HandleChangeActionAndLinkTo = (action, uav) => {
        this.props.HandleChangeAction(action);
        emitter.emit("sendId", uav.droneId);
        if (this.props.navigate) {
            this.props.navigate(`/registration`);
        }
        this.props.toggleModal();
    };
    render() {
        let { listUav } = this.state;

        return (
            <Modal isOpen={this.props.isOpen} size="xl">
                <ModalHeader toggle={this.props.toggleModal}>
                    <i className="fas fa-helicopter"></i> UAV Registry
                </ModalHeader>
                <ModalBody>
                    <div className="uav-list">
                        {listUav && listUav.length > 0 ? (
                            listUav.map((uav, index) => (
                                <div key={index} className="uav-item">
                                    <div className="uav-header">
                                        <div className="uav-id">
                                            <i className="fas fa-drone"></i>
                                            <span>{uav.droneId}</span>
                                        </div>
                                        <div
                                            className="uav-status"
                                            data-status={uav.status?.toLowerCase()}>
                                            {this.getStatusIcon(uav.status)}{" "}
                                            {uav.status}
                                        </div>
                                    </div>

                                    <div className="uav-body">
                                        <div className="uav-info">
                                            <div className="info-item">
                                                <i className="fas fa-tag"></i>
                                                <span className="label">
                                                    Name:
                                                </span>
                                                <span className="value">
                                                    {uav.droneName}
                                                </span>
                                            </div>

                                            <div className="info-item">
                                                <i className="fas fa-map-marker-alt"></i>
                                                <span className="label">
                                                    Start Point:
                                                </span>
                                                <span className="value">
                                                    {uav.startPoint}
                                                </span>
                                            </div>

                                            <div className="info-item">
                                                <i className="fas fa-flag-checkered"></i>
                                                <span className="label">
                                                    End Point:
                                                </span>
                                                <span className="value">
                                                    {uav.endPoint}
                                                </span>
                                            </div>

                                            <div className="info-item">
                                                <i className="fas fa-arrows-alt-v"></i>
                                                <span className="label">
                                                    Height:
                                                </span>
                                                <span className="value">
                                                    {uav.heightFly}m
                                                </span>
                                            </div>

                                            <div className="info-item">
                                                <i className="fas fa-tachometer-alt"></i>
                                                <span className="label">
                                                    Speed:
                                                </span>
                                                <span className="value">
                                                    {uav.speed} km/h
                                                </span>
                                            </div>
                                        </div>

                                        <div className="uav-actions">
                                            <button
                                                className="btn-edit"
                                                onClick={() =>
                                                    this.HandleChangeActionAndLinkTo(
                                                        crud_actions.EDIT,
                                                        uav
                                                    )
                                                }>
                                                <i className="fas fa-edit"></i>
                                                Edit
                                            </button>
                                            <button className="btn-delete">
                                                <i className="fas fa-trash"></i>
                                                Delete
                                            </button>
                                            <button className="btn-launch">
                                                <i className="fas fa-rocket"></i>
                                                Launch
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <i className="fas fa-helicopter"></i>
                                <p>No UAVs registered yet.</p>
                                <p>Click "Register New UAV" to get started!</p>
                            </div>
                        )}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.handleRegisterUAV}>
                        <i className="fas fa-plus"></i> Register New UAV
                    </Button>
                    <Button color="secondary" onClick={this.props.toggleModal}>
                        <i className="fas fa-times"></i> Close
                    </Button>
                </ModalFooter>
            </Modal>
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
        HandleChangeAction: (action) =>
            dispatch(actions.ActionUavRegister(action)),
    };
};

export default withNavigate(
    connect(mapStateToProps, mapDispatchToProps)(ModalUav)
);
