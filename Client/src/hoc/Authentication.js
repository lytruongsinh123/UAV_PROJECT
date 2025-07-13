import React, { Component } from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";

// HOC cho trang yêu cầu đăng nhập
const userIsAuthenticated = (WrappedComponent) => {
    class AuthenticatedComponent extends Component {
        render() {
            const { isLoggedIn } = this.props;

            if (isLoggedIn) {
                return <WrappedComponent {...this.props} />;
            } else {
                return <Navigate to="/login" replace />;
            }
        }
    }

    const mapStateToProps = (state) => {
        return {
            isLoggedIn: state.user.isLoggedIn,
            userInfo: state.user.userInfo,
        };
    };

    return connect(mapStateToProps)(AuthenticatedComponent);
};

// HOC cho trang không yêu cầu đăng nhập (như login page)
const userIsNotAuthenticated = (WrappedComponent) => {
    class NotAuthenticatedComponent extends Component {
        render() {
            const { isLoggedIn } = this.props;

            if (!isLoggedIn) {
                return <WrappedComponent {...this.props} />;
            } else {
                return <Navigate to="/home" replace />;
            }
        }
    }

    const mapStateToProps = (state) => {
        return {
            isLoggedIn: state.user.isLoggedIn,
            userInfo: state.user.userInfo,
        };
    };

    return connect(mapStateToProps)(NotAuthenticatedComponent);
};

export { userIsAuthenticated, userIsNotAuthenticated };
