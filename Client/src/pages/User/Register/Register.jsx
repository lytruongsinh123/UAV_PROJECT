import React, { Component } from "react";
import { ReactComponent as DroneIcon } from "../../../assets/drone.svg";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { createNewUser } from "../../../service/userService";
import { toast } from "react-toastify";
import "./Register.css";
class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            address: "",
            gender: "male",
        };
    }
    // thực hiện một lần
    componentDidMount = async () => {};
    // thực hiện mỗi khi props hoặc state thay đổi
    componentDidUpdate = async (prevProps, prevState, snapshot) => {};
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };
    handleSubmit = async (e) => { 
        e.preventDefault();
        try {
            const response = await createNewUser(this.state);
            if (response && response.errCode === 0) {
                toast.success("Registration successful!");
                this.setState({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    address: "",
                    gender: "male",
                });
            }
            if(this.props.navigate) {
                this.props.navigate("/login");
            }
        } catch (error) {
            toast.error("Registration failed. Please try again.");
        }
    };
    render() {
        // Hàm tạo số random với seed cố định
        const seededRandom = (seed) => {
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };
        console.log("Register state: ", this.state);
        return (
            <div className="register-bg">
                {/* Floating particles - sử dụng seed cố định cho mỗi particle */}
                {Array.from({ length: 40 }).map((_, i) => (
                    <div
                        key={i}
                        className="floating-particle"
                        style={{
                            left: `${seededRandom(i * 12.34) * 100}%`,
                            top: `${seededRandom(i * 56.78) * 100}%`,
                            animationDuration: `${
                                3 + seededRandom(i * 9.87) * 2
                            }s`,
                            animationDelay: `${seededRandom(i * 43.21) * 6}s`,
                        }}
                    />
                ))}

                <div className="register-radial" />

                <div className="register-content">
                    {/* Left side - Title + Drone */}
                    <div className="register-title-block">
                        <div className="register-drone-img">
                            <DroneIcon className="drone-svg" />
                        </div>
                        <div className="register-title">UAV REGISTRY</div>
                        <div className="register-subtitle">
                            Real-Time Wireframe Visualization
                        </div>
                        <div className="register-desc">Create Your Account</div>
                        <div className="register-join">
                            Join the future of drone management
                        </div>
                    </div>

                    {/* Right side - Register panel */}
                    <div className="register-panel-block">
                        <div className="register-panel">
                            <div>
                                <div className="register-panel-title">
                                    Register
                                </div>
                                <div className="register-panel-subtitle">
                                    Register a new account!
                                </div>
                            </div>
                            <div>
                                <label className="register-label">
                                    Last Name:
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={this.state.lastName}
                                    onChange={this.handleChange}
                                    required
                                    className="register-input"
                                />
                                <label className="register-label">
                                    First Name:
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={this.state.firstName}
                                    onChange={this.handleChange}
                                    required
                                    className="register-input"
                                />
                                <label className="register-label">Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={this.state.email}
                                    onChange={this.handleChange}
                                    required
                                    className="register-input"
                                />
                                <label className="register-label">
                                    Password:
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                    required
                                    className="register-input"
                                />
                                <label className="register-label">
                                    Address:
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={this.state.address}
                                    onChange={this.handleChange}
                                    required
                                    className="register-input"
                                />
                                <label className="register-label">
                                    Gender:
                                </label>
                                <select
                                    name="gender"
                                    value={this.state.gender}
                                    onChange={this.handleChange}
                                    className="register-select">
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <div className="register-btn-container">
                                    <button
                                        type="submit"
                                        onClick={this.handleSubmit}
                                        className="register-btn">
                                        REGISTER
                                    </button>
                                </div>
                                <div className="register-signin">
                                    Already have an account?{" "}
                                    <span className="register-signin-link" onClick={() => this.props.navigate("/login")}>
                                        Sign in
                                    </span>
                                </div>
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default withNavigate(connect(mapStateToProps, mapDispatchToProps)(Register));
