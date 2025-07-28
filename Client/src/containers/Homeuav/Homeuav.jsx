import React, { Component } from "react";
import { ReactComponent as DroneIcon } from "../../assets/drone.svg";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import "./Homeuav.css"; // Import file CSS

class Homeuav extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount = async () => {};

    componentDidUpdate = async (prevProps, prevState, snapshot) => {};

    handleExploreClick = () => {
        // Nếu bạn muốn điều hướng đến một trang khác, thêm navigate ở đây
        this.props.navigate("/dashboard"); // Hoặc "/login", tùy bạn
    };

    render() {
        return (
            <div className="homeuav">
                <div className="homeuav-overlay" />
                <div className="homeuav-content">
                    <div className="homeuav-drone-icon">
                        <DroneIcon className="drone-svg-home" />
                    </div>
                    <h1 className="homeuav-title">
                        <FormattedMessage id="homeuav.title" defaultMessage="Sky Registry" />
                    </h1>
                    <h2 className="homeuav-subtitle">
                        <FormattedMessage
                            id="homeuav.sub-title"
                            defaultMessage="Modern, Efficient, and Flexible UAV Management Platform"
                        />
                    </h2>
                    <p className="homeuav-description">
                        <FormattedMessage
                            id="homeuav.description"
                            defaultMessage="The goal of the system is to build a web-based software platform to manage, track, and control unmanned aerial vehicles (UAVs) effectively, safely, and flexibly."
                        />
                    </p>
                    <p className="homeuav-tagline">
                        <FormattedMessage
                            id="homeuav.tagline"
                            defaultMessage="Optimal Coordination – Maximum Safety!"
                        />
                    </p>
                    <button
                        className="homeuav-btn"
                        onClick={this.handleExploreClick}>
                        <FormattedMessage
                            id="homeuav.btn-register"
                            defaultMessage="Explore the System"
                        />
                    </button>
                </div>
            </div>
        );
    }
}

// HOC để inject navigate cho class component
const withNavigate = (Component) => {
    return (props) => {
        const navigate = useNavigate();
        return <Component {...props} navigate={navigate} />;
    };
};

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default withNavigate(
    connect(mapStateToProps, mapDispatchToProps)(Homeuav)
);
