import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import { handleUpdateUser } from "../../service/userService";
import { getUserById } from "../../service/userService";
import * as actions from "../../store/actions/userActions";
import CommonUtils from "../../utils/CommonUtils";
import themeUtils from "../../utils/ThemeUtils";
import { Buffer } from "buffer";
import { toast } from "react-toastify";
import "./EditUser.css";

class EditUser extends Component {
    state = {
        firstName: "",
        lastName: "",
        address: "",
        positionId: "",
        gender: "",
        phoneNumber: "",
        currentTheme: themeUtils.getCurrentTheme(), // Chỉ thêm theme state
    };
    async componentDidMount() {
        // Chỉ thêm theme handling
        let res = await getUserById(this.props.userInfo.id);
        if (res && res.data) {
            let user = res.data;
            this.setState({
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address,
                positionId: user.positionId,
                gender: user.gender,
                phoneNumber: user.phoneNumber,
                previewImgUrl: user.image
                    ? new Buffer(user.image, "base64").toString("binary")
                    : "",
            });
        }
        this.handleThemeChange();
        if (themeUtils.addListener) {
            themeUtils.addListener(this.handleThemeChange);
        }
    }
    componentWillUnmount() {
        // Chỉ thêm cleanup theme listener
        if (themeUtils.removeListener) {
            themeUtils.removeListener(this.handleThemeChange);
        }
    }
    // Chỉ thêm theme handler
    handleThemeChange = () => {
        const newTheme = themeUtils.getCurrentTheme();
        this.setState({ currentTheme: newTheme });
        document.documentElement.setAttribute("data-theme", newTheme);
        document.body.className = `${newTheme}-theme`;
    };
    // Giữ nguyên tất cả hàm existing
    handleOnChangeInput = (event, id) => {
        let value = event.target.value;
        let stateCopy = { ...this.state };
        stateCopy[id] = value;
        this.setState({
            ...stateCopy,
        });
    };
    handleOnchangeImg = async (event) => {
        let data = event.target.files; // lấy ra file ảnh
        let file = data[0]; // lấy ra file đầu tiên
        let objectUrl = URL.createObjectURL(file); // tạo ra đường dẫn tạm thời
        if (file) {
            let base64 = await CommonUtils.toBase64(file); // chuyển đổi file sang base64
            this.setState({
                previewImgUrl: objectUrl,
                image: base64, // gán giá trị base64 vào state
            });
        }
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        let res = await handleUpdateUser({
            id: this.props.userInfo.id,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            address: this.state.address,
            positionId: this.state.positionId,
            gender: this.state.gender,
            phoneNumber: this.state.phoneNumber,
            image: this.state.image,
        });
        if (res && res.errCode === 0) {
            toast.success("Update user successfully!");
            if (this.props.navigate) {
                this.props.navigate(`/homeuav`);
            }
        } else {
            toast.error("Update user failed!");
        }
    };

    render() {
        const { currentTheme } = this.state; // Chỉ thêm theme destructuring
        const { language } = this.props; // Giữ nguyên language destructuring
        return (
            <div
                className={`edituser-container ${currentTheme}`} // Chỉ thêm theme class
                data-theme={currentTheme} // Chỉ thêm theme attribute
            >
                <form className="edituser-card" onSubmit={this.handleSubmit}>
                    <h2 className="edituser-title">
                        <FormattedMessage id="edit-user.title" />
                    </h2>
                    <div className="preview-img-container">
                        <img
                            src={this.state.previewImgUrl}
                            alt="Preview"
                            className="preview-img"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="firstName">
                            <FormattedMessage id="edit-user.first-name" />
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            value={this.state.firstName}
                            onChange={(event) =>
                                this.handleOnChangeInput(event, "firstName")
                            }
                            placeholder="Enter first name"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">
                            <FormattedMessage id="edit-user.last-name" />
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            value={this.state.lastName}
                            onChange={(event) =>
                                this.handleOnChangeInput(event, "lastName")
                            }
                            placeholder="Enter last name"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">
                            <FormattedMessage id="edit-user.address" />
                        </label>
                        <input
                            type="text"
                            id="address"
                            value={this.state.address}
                            onChange={(event) =>
                                this.handleOnChangeInput(event, "address")
                            }
                            placeholder="Enter address"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="positionId">
                            <FormattedMessage id="edit-user.position" />
                        </label>
                        <input
                            type="text"
                            id="positionId"
                            value={this.state.positionId}
                            onChange={(event) =>
                                this.handleOnChangeInput(event, "positionId")
                            }
                            placeholder="Enter position"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="gender">
                            <FormattedMessage id="edit-user.gender" />
                        </label>
                        <select
                            id="gender"
                            value={this.state.gender}
                            onChange={(event) =>
                                this.handleOnChangeInput(event, "gender")
                            }>
                            <option value="">
                                {language === "en"
                                    ? "Select Gender"
                                    : "Chọn giới tính"}
                            </option>
                            <option value="male">
                                {language === "en" ? "Male" : "Nam"}
                            </option>
                            <option value="female">
                                {language === "en" ? "Female" : "Nữ"}
                            </option>
                            <option value="other">
                                {language === "en" ? "Other" : "Khác"}
                            </option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="phoneNumber">
                            <FormattedMessage id="edit-user.phone-number" />
                        </label>
                        <input
                            type="text"
                            id="phoneNumber"
                            value={this.state.phoneNumber}
                            onChange={(event) =>
                                this.handleOnChangeInput(event, "phoneNumber")
                            }
                            placeholder="Enter phone number"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image">
                            <FormattedMessage id="edit-user.avatar" />
                        </label>
                        <input
                            type="file"
                            id="image"
                            onChange={(event) => this.handleOnchangeImg(event)}
                            accept="image/*"
                        />
                        {this.state.previewImgUrl && (
                            <img
                                src={this.state.previewImgUrl}
                                alt="Preview"
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 12,
                                    marginTop: 10,
                                    objectFit: "cover",
                                    boxShadow: "0 2px 8px rgba(78,84,200,0.10)",
                                }}
                            />
                        )}
                    </div>
                    <button className="edituser-btn" type="submit">
                        <FormattedMessage id="edit-user.update" />
                    </button>
                </form>
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
        language: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleUpdateUser: (userData) =>
            dispatch(actions.handleEditUser(userData)),
    };
};

export default withNavigate(
    connect(mapStateToProps, mapDispatchToProps)(EditUser)
);
