import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Outlet } from "react-router-dom";
import Header from "../../layouts/Header/Header";
import SideBar from "../../layouts/SideBar/SideBar";
import "./HomePage.css";
import * as actions from "../../store/actions";

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenSidebar: false,
        };
    }

    handleLogout = () => {
        this.props.handleLogoutRedux();
        toast.info("Logged out successfully!");
    };

    handleToggleSidebar = () => {
        this.setState({
            isOpenSidebar: !this.state.isOpenSidebar,
        });
    };

    render() {
        const { isOpenSidebar } = this.state;

        return (
            <div className="homepage">
                <div
                    className={`homepage-sidebar ${
                        isOpenSidebar ? "open" : "closed"
                    }`}>
                    <SideBar isOpenSidebar={isOpenSidebar} />
                </div>
                <div
                    className={`homepage-body ${
                        isOpenSidebar ? "closed" : "open"
                    }`}>
                    <div className="home-header">
                        <Header
                            onToggleSidebar={this.handleToggleSidebar}
                            isSidebarOpen={isOpenSidebar}
                            handleLogout={this.handleLogout}
                        />
                    </div>
                    <div className="main-content">
                        <Outlet /> {/* Dashboard sẽ render ở đây */}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleLogoutRedux: () => {
            dispatch(actions.handleLogout());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
