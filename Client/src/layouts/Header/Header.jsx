import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./Header.css";
import * as actions from "../../store/actions";
import { useNavigate } from "react-router-dom";

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleToggleClick = () => {
        if (this.props.onToggleSidebar) {
            this.props.onToggleSidebar(); // Gọi hàm từ cha
        }
    };
    handleLinkTo = (path) => {
        if (this.props.navigate) {
            this.props.navigate(`/${path}`); // Dùng navigate để chuyển hướng
        }
    };
    render() {
        return (
            <div className="header">
                <div className="header-container">
                    {/* Logo và nút toggle sidebar */}
                    <div className="header-logo">
                        <i
                            className="fa-solid fa-bars sidebar-toggle"
                            onClick={this.handleToggleClick}></i>

                        <div className="logo-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="logo-svg">
                                <path d="M12 12h.01"></path>
                                <path d="M12 2L6 8h12L12 2z"></path>
                                <path d="M22 12l-6-6v12l6-6z"></path>
                                <path d="M2 12l6 6V6l-6 6z"></path>
                                <path d="M12 22l6-6H6l6 6z"></path>
                            </svg>
                        </div>
                        <span className="logo-text">Sky Registry</span>
                    </div>

                    {/* Navigation Menu */}
                    <div className="header-nav">
                        <div className="nav-item">
                            <div
                                onClick={() =>
                                    this.handleLinkTo("registration")
                                }>
                                <i className="fa-solid fa-file-alt"></i>
                                <span>
                                    <FormattedMessage id="header.registration" />
                                </span>
                            </div>
                        </div>

                        <div className="nav-item">
                            <div
                                onClick={() => this.handleLinkTo("flightpath")}>
                                <i className="fa-solid fa-route"></i>
                                <span>
                                    <FormattedMessage id="header.flight-path" />
                                </span>
                            </div>
                        </div>

                        <div className="nav-item">
                            <div
                                onClick={() => this.handleLinkTo("create-uav")}>
                                <i className="fa-solid fa-route"></i>
                                <span>
                                    <FormattedMessage id="header.flight-path" />
                                </span>
                            </div>
                        </div>

                        <div className="nav-item">
                            <div
                                onClick={() =>
                                    this.handleLinkTo("live-tracking")
                                }>
                                <i className="fa-solid fa-map-marker-alt"></i>
                                <span>
                                    <FormattedMessage id="header.live-tracking" />
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* User Actions */}
                    <div className="header-actions">
                        <button
                            className="btn-logout"
                            onClick={this.props.handleLogoutRedux}>
                            <i className="fa-solid fa-right-from-bracket"></i>
                            <span>
                                <FormattedMessage id="header.logout" />
                            </span>
                        </button>
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

export default withNavigate(
    connect(mapStateToProps, mapDispatchToProps)(Header)
);
