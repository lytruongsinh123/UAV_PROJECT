import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../../service/userService";
import { toast } from "react-toastify";
import "./ForgotPassword.css";
class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            message: "",
            error: "",
            loading: false,
        };
    }
    handleChange = (e) => {
        this.setState({ email: e.target.value, error: "", message: "" });
    };
    handleSubmit = async (e) => {
        e.preventDefault();
        this.setState({ loading: true, error: "", message: "" });
        const res = await forgotPassword({ email: this.state.email });
        if (res && res.errCode === 0) {
            toast.success("Reset link sent to your email!");
            this.setState({ message: res.message, loading: false });
        } else {
            toast.error(res?.message || "Error");
            this.setState({ loading: false });
        }
    };

    render() {
        const { email, message, error, loading } = this.state;
        return (
            <div className="forgot-password-bg">
                <div className="forgot-password-container">
                    <h2>
                        <FormattedMessage
                            id="forgotpassword.title"
                            defaultMessage="Forgot Password"
                        />
                    </h2>
                    <form
                        onSubmit={this.handleSubmit}
                        className="forgot-password-form">
                        <div className="form-group-email">
                            <label htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={this.handleChange}
                                required
                                placeholder="Enter your email"
                            />
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? (
                                <FormattedMessage
                                    id="forgotpassword.sending"
                                    defaultMessage="Sending..."
                                />
                            ) : (
                                <FormattedMessage
                                    id="forgotpassword.submit"
                                    defaultMessage="Send Reset Link"
                                />
                            )}
                        </button>
                        {message && (
                            <div className="success-message">{message}</div>
                        )}
                        {error && <div className="error-message">{error}</div>}
                    </form>
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
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default withNavigate(
    connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)
);
