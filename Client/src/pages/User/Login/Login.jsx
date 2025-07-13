import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { toast } from "react-toastify";
import "./Login.scss";
import * as actions from "../../../store/actions";

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

    handleLogin = () => {
        this.props.handleLoginRedux(this.state.email, this.state.password);
    };
    handleLogout = () => {
        this.props.handleLogoutRedux();
        toast.success("Logout successful!");
    };
    render() {
        console.log("check state", this.state);
        return (
            <div className="login-background">
                <div className="title-login">
                    <div className="title">Login</div>
                    <div className="sub-title">
                        Please enter your credentials
                    </div>
                </div>
                <div className="body-login">
                    <div className="email-login">
                        <label>Email</label>
                        <input
                            type="text"
                            value={this.state.email}
                            className="form-group"
                            onChange={(event) =>
                                this.handleChangeInput(event, "email")
                            }
                        />
                    </div>
                    <div className="password-login">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-group"
                            value={this.state.password}
                            onChange={(event) =>
                                this.handleChangeInput(event, "password")
                            }
                        />
                    </div>
                </div>
                <div className="btn-login">
                    <button onClick={() => this.handleLogin()}>Login</button>
                    <button onClick={() => this.handleLogout()}>Logout</button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        // language: state.app.language,
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
