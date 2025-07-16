import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import "./SideBar.css";
class SlideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    // thực hiện một lần
    componentDidMount = async () => {};

    // thực hiện mỗi khi props hoặc state thay đổi
    componentDidUpdate = async (prevProps, prevState, snapshot) => {};
    handleNavigate = (path) => {
        if (this.props.navigate) {
            this.props.navigate(`/${path}`);
        }
    };
    render() {
        let { isOpenSidebar } = this.props;
        return (
            <div className="sidebar">
                <div className="avatar">
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrSLox2ia0u9peaoS7Sy19T60CQ4tO8JT46Q&s"
                        alt="User Avatar"
                    />
                    {isOpenSidebar ? <span>User Name</span> : ""}
                </div>
                <div className="main-section">
                    <div
                        className="home"
                        onClick={() => this.handleNavigate("homeuav")}>
                        <i className="fas fa-home"></i>
                        {isOpenSidebar ? <span>Home</span> : ""}
                    </div>
                    <div className="dsashboard"
                        onClick={() => this.handleNavigate("dashboard")}>
                        <i className="fas fa-tachometer-alt"></i>
                        {isOpenSidebar ? <span>Dashboard</span> : ""}
                    </div>
                    <div className="settings">
                        <i className="fas fa-cog"></i>
                        {isOpenSidebar ? <span>Settings</span> : ""}
                    </div>
                    <div className="notifications">
                        <i className="fas fa-bell"></i>
                        {isOpenSidebar ? <span>Notifications</span> : ""}
                    </div>
                </div>
                <div className="sub-section">
                    <div className="help">
                        <i className="fas fa-question-circle"></i>
                        <span className="title">Help</span>
                    </div>
                    <div className="feedback">
                        <i className="fas fa-comment-dots"></i>
                        <span className="title">Feedback</span>
                    </div>
                    <div className="logout">
                        <i className="fas fa-sign-out-alt"></i>
                        <span className="title">Logout</span>
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
    connect(mapStateToProps, mapDispatchToProps)(SlideBar)
);
