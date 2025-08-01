import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { crud_actions, statusUav } from "../../utils/constants";
import * as actions from "../../store/actions";
import emitter from "../../utils/eventBus";
import CardUavItem from "../Card/CardUavItem";
import { deleteUav } from "../../service/uavRegisterService";
import notificationService from "../../service/notificationService";

import "./Modal.css";

class ModalUav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uavStates: {}, // Lưu trạng thái của từng UAV
            listUav: [],
        };
    }
    async componentDidMount() {
        await this.props.fetchUavsRegisteredByOwner(this.props.userInfo.id);
        const currentList = this.props.listUav;
        if (Array.isArray(currentList) && currentList.length > 0) {
            const uavStates = {};
            currentList.forEach((uav) => {
                uavStates[uav.droneId] = uav.status;
            });
            this.setState({ listUav: currentList, uavStates });
        }
    }
    componentDidUpdate = async (prevProps, prevState, snapshot) => {
        const currentList = this.props.listUav;
        if (
            Array.isArray(prevProps.listUav) &&
            prevProps.listUav.length > 0 &&
            prevProps.listUav !== currentList &&
            Array.isArray(currentList)
        ) {
            const uavStates = {};
            currentList.forEach((uav) => {
                uavStates[uav.droneId] = uav.status;
            });
            this.setState({ listUav: currentList, uavStates });
        }
    };

    handleRegisterUAV = () => {
        this.props.HandleChangeAction(crud_actions.CREATE);
        this.props.navigate("/registration");
        this.props.toggleModal();
    };
    // ✅ Handler functions
    handleEdit = (uav) => {
        this.props.HandleChangeAction(crud_actions.EDIT);
        emitter.emit("sendId", uav.droneId);
        this.props.navigate("/registration");
        this.props.toggleModal();
    };
    handleDelete = async (uav) => {
        if (window.confirm("Are you sure you want to delete this UAV?")) {
            await deleteUav(uav.droneId);
            this.props.fetchUavsRegisteredByOwner(this.props.userInfo.id);
        }
    };

    // handleActivate = async (uav) => {
    //     let copyUavStates = { ...this.state.uavStates };
    //     copyUavStates[uav.droneId] = statusUav.ACTIVE;
    //     this.setState({ uavStates: copyUavStates });
    //     try {
    //         await this.props.HandleChangeStatus(uav.droneId, statusUav.ACTIVE);
    //         await this.props.fetchUavsByStatusAndOwner(
    //             statusUav.ACTIVE,
    //             this.props.userInfo.id
    //         );
    //     } catch (error) {
    //         let rollbackUavStates = { ...this.state.uavStates };
    //         rollbackUavStates[uav.droneId] = uav.status; // Restore original status
    //         this.setState({ uavStates: rollbackUavStates });
    //     }
    // };
    handleActivate = async (uav) => {
        let copyUavStates = { ...this.state.uavStates };
        copyUavStates[uav.droneId] = statusUav.ACTIVE;
        this.setState({ uavStates: copyUavStates });

        try {
            await this.props.HandleChangeStatus(uav.droneId, statusUav.ACTIVE);
            await this.props.fetchUavsByStatusAndOwner(
                statusUav.ACTIVE,
                this.props.userInfo.id
            );

            // ⏳ Sau 10 giây, chuyển UAV sang trạng thái COMPLETED
            setTimeout(async () => {
                let updatedStates = { ...this.state.uavStates };
                updatedStates[uav.droneId] = statusUav.COMPLETED;
                console.log("Updated UAV states:", updatedStates);
                this.setState({ uavStates: updatedStates });

                await this.props.HandleChangeStatus(
                    uav.droneId,
                    statusUav.COMPLETED
                );

                await this.props.fetchUavsByStatusAndOwner(
                    statusUav.ACTIVE,
                    this.props.userInfo.id
                );
                // speed = distance / time => time = distance / speed ,speed(km/h) distance(km) => time (hour)
            }, (uav.distance / uav.speed) * 3600 * 1000); // Chuyển đổi hour  giây sang mili giây
        } catch (error) {
            let rollbackUavStates = { ...this.state.uavStates };
            rollbackUavStates[uav.droneId] = uav.status;
            this.setState({ uavStates: rollbackUavStates });
        }
    };

    handleMaintenance = (uav) => {
        this.props.HandleChangeStatus(uav.droneId, statusUav.MAINTENANCE);
        let copyUavStates = { ...this.state.uavStates };
        copyUavStates[uav.droneId] = statusUav.MAINTENANCE;
        this.setState({ uavStates: copyUavStates });
    };

    render() {
        let { isOpenTypeModal } = this.props;
        let listUav = [];
        if (isOpenTypeModal === "all") {
            listUav = this.props.listUav;
        } else {
            if (isOpenTypeModal === "active") {
                listUav = this.props.listUavByStatus;
            } else if (isOpenTypeModal === "completed") {
                listUav = this.props.listUavCompleted;
            }
        }

        // "all-uavs": "Tất cả UAV",
        // "active-uavs": "UAV đang hoạt động",
        // "completed-uavs": "UAV đã hoàn thành",
        return (
            <Modal isOpen={this.props.isOpen} size="xl">
                <ModalHeader toggle={this.props.toggleModal}>
                    <i className="fas fa-helicopter"></i>{" "}
                    {isOpenTypeModal === "all" ? (
                        <FormattedMessage id="modal.all-uavs" />
                    ) : isOpenTypeModal === "active" ? (
                        <FormattedMessage id="modal.active-uavs" />
                    ) : (
                        <FormattedMessage id="modal.completed-uavs" />
                    )}
                </ModalHeader>
                <ModalBody>
                    <div className="uav-list">
                        {listUav && listUav.length > 0 ? (
                            listUav.map((uav, index) => {
                                const currentState =
                                    this.state.uavStates[uav.droneId];
                                return (
                                    <React.Fragment key={index}>
                                        <CardUavItem
                                            uav={uav}
                                            uavState={currentState}
                                            index={index}
                                            onEdit={this.handleEdit}
                                            onDelete={this.handleDelete}
                                            onActivate={this.handleActivate}
                                            onMaintenance={
                                                this.handleMaintenance
                                            }
                                        />
                                        {isOpenTypeModal === "completed" && (
                                            <span>
                                                Hour of Flight:{" "}
                                                {(
                                                    uav.distance / uav.speed
                                                ).toFixed(2)}{" "}
                                            </span>
                                        )}
                                    </React.Fragment>
                                );
                            })
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
                        <i className="fas fa-plus"></i>{" "}
                        <FormattedMessage id="modal.register-new-uav" />
                    </Button>
                    <Button color="secondary" onClick={this.props.toggleModal}>
                        <i className="fas fa-times"></i>{" "}
                        <FormattedMessage id="modal.close" />
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
        userInfo: state.user.userInfo,
        actions: state.uavRegister.actions,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUavsRegisteredByOwner: (ownerId) =>
            dispatch(actions.fetchAllUavsByOwner(ownerId)),
        HandleChangeAction: (action) =>
            dispatch(actions.ActionUavRegister(action)),
        HandleChangeStatus: (droneId, status, oldStatus) =>
            dispatch(actions.changeUavStatus(droneId, status, oldStatus)),
        fetchUavsByStatusAndOwner: (status, ownerId) =>
            dispatch(actions.fetchUavsByStatusAndOwner(status, ownerId)),
        batchChangeUavStatus: (statusChanges) =>
            dispatch(actions.batchChangeUavStatus(statusChanges)),
    };
};

export default withNavigate(
    connect(mapStateToProps, mapDispatchToProps)(ModalUav)
);
