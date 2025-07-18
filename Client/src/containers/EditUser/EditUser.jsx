import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import { handleUpdateUser } from "../../service/userService";
import { toast } from "react-toastify";
import * as actions from "../../store/actions/userActions";
import CommonUtils from "../../utils/CommonUtils";
import "./EditUser.css";
import { use } from "react";

class EditUser extends Component {
    state = {
        firstName: "",
        lastName: "",
        address: "",
        positionId: "",
        gender: "",
        phoneNumber: "",
    };

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
        // Call API to update user here
        // Example: this.props.updateUser(this.state);
        await this.props.handleUpdateUser({
            id: this.props.userInfo.id,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            address: this.state.address,
            positionId: this.state.positionId,
            gender: this.state.gender,
            phoneNumber: this.state.phoneNumber,
            image: this.state.image,
        });
    };

    render() {
        return (
            <div className="edituser-container">
                <form className="edituser-card" onSubmit={this.handleSubmit}>
                    <h2 className="edituser-title">Update User Information</h2>
                    <div className="preview-img-container">
                        <img
                            src={this.state.previewImgUrl}
                            alt="Preview"
                            className="preview-img"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
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
                        <label htmlFor="lastName">Last Name</label>
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
                        <label htmlFor="address">Address</label>
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
                        <label htmlFor="positionId">Position</label>
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
                        <label htmlFor="gender">Gender</label>
                        <select
                            id="gender"
                            value={this.state.gender}
                            onChange={(event) =>
                                this.handleOnChangeInput(event, "gender")
                            }>
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="phoneNumber">Phone Number</label>
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
                        <label htmlFor="image">Avatar</label>
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
                        Update
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
