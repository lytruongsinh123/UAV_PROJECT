import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { toast } from "react-toastify";
import "./Login.css";
import * as actions from "../../../store/actions";
import { useNavigate } from "react-router-dom";
import { ReactComponent as DroneIcon } from "../../../assets/drone.svg";
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
        };
    }

    componentDidMount = async () => {};

    componentDidUpdate = async (prevProps, prevState, snapshot) => {};

    handleChangeInput = (event, id) => {
        let value = event.target.value;
        let copyState = { ...this.state };
        copyState[id] = value;
        this.setState({
            ...copyState,
        });
    };

    handleLogin = async () => {
        let res = await this.props.handleLoginRedux(this.state.email, this.state.password);
    };
    handleLogout = () => {
        this.props.handleLogoutRedux();
        toast.success("Logout successful!");
    };
    render() {
        return (
            <div className="login-container">
                {/* Floating Particles */}
                {Array.from({ length: 40 }).map((_, i) => (
                    <div
                        key={i}
                        className="floating-particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDuration: `${3 + Math.random() * 2}s`,
                            animationDelay: `${Math.random() * 6}s`,
                        }}
                    />
                ))}

                <div className="background-overlay" />

                <div className="main-content-login">
                    {/* Drone & Title */}
                    <div className="title-section">
                        <div className="title">UAV REGISTRY</div>
                        <div className="subtitle">
                            Real-Time Wireframe Visualization
                        </div>
                        {/* Full SVG Drone */}
                        <DroneIcon />
                    </div>

                    {/* Sign-in panel */}
                    <div className="signin-panel">
                        <div>
                            <div className="signin-title">Sign in</div>
                            <div className="signin-subtitle">
                                Sign in and start managing your candidates!
                            </div>
                        </div>
                        <div>
                            <label className="input-label">Email</label>
                            <input
                                type="text"
                                placeholder="Login"
                                value={this.state.email}
                                onChange={(e) =>
                                    this.handleChangeInput(e, "email")
                                }
                                className="input-field"
                            />
                            <label className="input-label">Password</label>
                            <input
                                type="password"
                                placeholder="Password"
                                value={this.state.password}
                                onChange={(e) =>
                                    this.handleChangeInput(e, "password")
                                }
                                className="input-field"
                            />
                            <div className="options-row">
                                <div>
                                    <input type="checkbox" id="remember" />
                                    <label
                                        htmlFor="remember"
                                        className="remember-label">
                                        Remember me
                                    </label>
                                </div>
                                <div className="forgot-link">
                                    Forgot password?
                                </div>
                            </div>
                            <span style={{ color: "red" }}>{this.props.message}</span>
                        </div>
                        <div>
                            <div className="login-button-container">
                                <button
                                    onClick={this.handleLogin}
                                    className="login-button">
                                    LOGIN
                                </button>
                            </div>
                            <div className="create-account">
                                New to UAV Registry?{" "}
                                <span className="create-link" onClick={() => this.props.navigate("/register")}>
                                    Create account
                                </span>
                            </div>
                        </div>
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
        message: state.user.message,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        handleLoginRedux: (email, password) => {
            dispatch(actions.HandleLoginStart(email, password));
        },
        handleLogoutRedux: () => {
            dispatch(actions.handleLogout());
        },
    };
};

export default withNavigate(
    connect(mapStateToProps, mapDispatchToProps)(Login)
);
