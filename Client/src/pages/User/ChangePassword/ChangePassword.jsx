import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../../../service/userService";
import { toast } from "react-toastify";
import "./ChangePassword.css";

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: "",
            confirmPassword: "",
            loading: false,
            error: "",
            message: "",
        };
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
            error: "",
            message: "",
        });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { password, confirmPassword } = this.state;
        if (!password || !confirmPassword) {
            this.setState({ error: "Please fill in all fields." });
            return;
        }
        if (password !== confirmPassword) {
            this.setState({ error: "Passwords do not match." });
            return;
        }
        this.setState({ loading: true, error: "", message: "" });

        // Lấy token từ query string (?resetToken=...)
        const params = new URLSearchParams(this.props.location.search);
        const token = params.get("resetToken");

        try {
            const res = await resetPassword({ token, password });
            if (res && res.errCode === 0) {
                toast.success("Password updated successfully!");
                this.setState({ message: res.message, loading: false });
                setTimeout(() => {
                    this.props.navigate("/login");
                }, 1500);
            } else {
                this.setState({
                    error: res?.message || "Error",
                    loading: false,
                });
            }
        } catch (err) {
            this.setState({
                error: "Server error. Please try again.",
                loading: false,
            });
        }
    };

    render() {
        const { password, confirmPassword, loading, error, message } =
            this.state;
        return (
            <div className="change-password-container">
                <h2>
                    <FormattedMessage
                        id="changepassword.title"
                        defaultMessage="Set New Password"
                    />
                </h2>
                <form
                    className="change-password-form"
                    onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="password">
                            <FormattedMessage
                                id="changepassword.new"
                                defaultMessage="New Password"
                            />
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={this.handleChange}
                            required
                            placeholder="Enter new password"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">
                            <FormattedMessage
                                id="changepassword.confirm"
                                defaultMessage="Confirm Password"
                            />
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={this.handleChange}
                            required
                            placeholder="Confirm new password"
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? (
                            <FormattedMessage
                                id="changepassword.saving"
                                defaultMessage="Saving..."
                            />
                        ) : (
                            <FormattedMessage
                                id="changepassword.submit"
                                defaultMessage="Update Password"
                            />
                        )}
                    </button>
                    {message && (
                        <div className="success-message">{message}</div>
                    )}
                    {error && <div className="error-message">{error}</div>}
                </form>
            </div>
        );
    }
}

const withNavigate = (Component) => {
    return (props) => {
        const navigate = useNavigate();
        const location = useLocation();
        return <Component {...props} navigate={navigate} location={location} />;
    };
};
const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default withNavigate(
    connect(mapStateToProps, mapDispatchToProps)(ChangePassword)
);
