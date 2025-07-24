import React, { Component } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { getAllUavs } from "../../../service/uavsService";
import CardUavs from "../../../components/CardUavs/CardUavs";
import "./ShowListUavs.css";
class ShowListUavs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listUavs: [],
        };
    }
    // thực hiện một lần
    componentDidMount = async () => {
        const response = await getAllUavs();
        if (response && response.errCode === 0) {
            this.setState({
                listUavs: response.uavs,
            });
        }
    };

    // thực hiện mỗi khi props hoặc state thay đổi
    componentDidUpdate = async (prevProps, prevState, snapshot) => {};
    render() {
        let { listUavs } = this.state;
        return (
            <>
                {listUavs && listUavs.length > 0 ? (
                    <div className="list-uavs-container">
                        {listUavs.map((uav, index) => {
                            return (
                                <CardUavs
                                    key={index}
                                    uav={uav}
                                    onClick={() =>
                                        this.props.navigate(
                                            `/live-tracking/${uav.droneId}`
                                        )
                                    }
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="no-uavs-message">
                        No UAVs found. Please register a UAV first.
                    </div>
                )}
            </>
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
    connect(mapStateToProps, mapDispatchToProps)(ShowListUavs)
);
