import React, { Component } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import CardFlyPath from "../../../components/CardFlyPath/CardFlyPath";
import * as actions from "../../../store/actions/uavRegisterActions";

class FlightPath extends Component {
    constructor(props) {
        super(props);
        this.map = null;
        this.routingControl = null; // Thêm biến này
        this.state = {
            listuavs: [],
        };
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.uavs !== this.props.uavs) {
            this.setState({
                listuavs: this.props.uavs,
            });
        }
    }
    async componentDidMount() {
        await this.props.fetchUavsRegisteredByOwner(this.props.userInfo.id);
        this.setState({
            listuavs: this.props.uavs,
        });
    }

    componentWillUnmount() {}

    render() {
        console.log("list uavs", this.state.listuavs);
        return (
            <div style={{ height: "100vh", width: "100%" }}>
                {this.state.listuavs.length > 0 ? (
                    this.state.listuavs.map((uav, index) => {
                        return (
                            <CardFlyPath
                                key={index}
                                position1={uav.startPoint}
                                position2={uav.endPoint}
                                navigate={this.props.navigate}
                            />
                        );
                    })
                ) : (
                    <div>Không có UAV nào để hiển thị</div>
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
        uavs: state.uavRegister.uavs,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUavsRegisteredByOwner: (ownerId) =>
            dispatch(actions.fetchAllUavsByOwner(ownerId)),
    };
};

export default withNavigate(
    connect(mapStateToProps, mapDispatchToProps)(FlightPath)
);
