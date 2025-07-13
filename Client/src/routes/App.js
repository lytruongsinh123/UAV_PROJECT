import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
    Routes,
    Route,
    BrowserRouter as Router,
    Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import {
    userIsAuthenticated,
    userIsNotAuthenticated,
} from "../hoc/Authentication";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "../containers/HomePage";
import Login from "../pages/User/Login/Login";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bootstrApped: false,
        };
    }

    handlePersistorState = () => {
        const { persistor } = this.props;
        if (persistor) {
            let { bootstrApped } = persistor.getState();
            if (bootstrApped) {
                if (this.props.onBeforeLift) {
                    Promise.resolve(this.props.onBeforeLift())
                        .then(() => this.setState({ bootstrApped: true }))
                        .catch(() => this.setState({ bootstrApped: true }));
                } else {
                    this.setState({ bootstrApped: true });
                }
            }
        } else {
            this.setState({ bootstrApped: true });
        }
    };

    componentDidMount() {
        this.handlePersistorState();
    }

    render() {
        return (
            <Fragment>
                <Router>
                    <div className="main-container">
                        <div className="content-container">
                            <Routes>
                                <Route
                                    path={"/login"}
                                    Component={userIsNotAuthenticated(Login)}
                                />
                                <Route
                                    path={"/home"}
                                    Component={userIsAuthenticated(HomePage)}
                                />
                                <Route
                                    path="/"
                                    element={<Navigate to="/login" replace />}
                                />
                            </Routes>
                        </div>
                        <ToastContainer
                            position="bottom-right"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                        />
                    </div>
                </Router>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        // started: state.app.started,
        // isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
