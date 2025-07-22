import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import "./CreateNewUav.css";

// droneId: DataTypes.STRING,
// droneName: DataTypes.STRING,
// speedMax: DataTypes.INTEGER,
// hightMax: DataTypes.INTEGER,
// performance: DataTypes.STRING,
// image: DataTypes.TEXT,

class CreateNewUav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            droneId: "",
            droneName: "",
            speedMax: "",
            hightMax: "",
            performance: "Good",
            image: null,
        };
    }

    // thực hiện một lần
    componentDidMount = async () => {};

    // thực hiện mỗi khi props hoặc state thay đổi
    componentDidUpdate = async (prevProps, prevState, snapshot) => {};

    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    handleFileChange = (e) => {
        this.setState({
            image: e.target.files[0],
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Xử lý logic lưu drone ở đây
        console.log("Form data:", this.state);
    };

    render() {
        const { droneId, droneName, speedMax, hightMax, performance } =
            this.state;

        return (
            <div className="create-drone-container">
                <div className="create-drone-header">
                    <h1>
                        <i className="fas fa-plus"></i>
                        Tạo Drone Mới
                    </h1>
                </div>

                <form onSubmit={this.handleSubmit} className="drone-form">
                    <div className="form-grid">
                        {/* Drone ID */}
                        <div className="form-group">
                            <label>
                                <i className="fas fa-tag"></i>
                                Drone ID *
                            </label>
                            <input
                                type="text"
                                name="droneId"
                                value={droneId}
                                onChange={this.handleInputChange}
                                placeholder="Nhập ID drone (VD: DRN-001)"
                                required
                            />
                        </div>

                        {/* Drone Name */}
                        <div className="form-group">
                            <label>
                                <i className="fas fa-drone"></i>
                                Tên Drone *
                            </label>
                            <input
                                type="text"
                                name="droneName"
                                value={droneName}
                                onChange={this.handleInputChange}
                                placeholder="Nhập tên drone"
                                required
                            />
                        </div>

                        {/* Speed Max */}
                        <div className="form-group">
                            <label>
                                <i className="fas fa-tachometer-alt"></i>
                                Tốc độ tối đa (km/h) *
                            </label>
                            <input
                                type="number"
                                name="speedMax"
                                value={speedMax}
                                onChange={this.handleInputChange}
                                placeholder="Nhập tốc độ tối đa"
                                min="1"
                                required
                            />
                        </div>

                        {/* Height Max */}
                        <div className="form-group">
                            <label>
                                <i className="fas fa-arrows-alt-v"></i>
                                Độ cao tối đa (m) *
                            </label>
                            <input
                                type="number"
                                name="hightMax"
                                value={hightMax}
                                onChange={this.handleInputChange}
                                placeholder="Nhập độ cao tối đa"
                                min="1"
                                required
                            />
                        </div>

                        {/* Performance */}
                        <div className="form-group">
                            <label>
                                <i className="fas fa-star"></i>
                                Hiệu suất
                            </label>
                            <select
                                name="performance"
                                value={performance}
                                onChange={this.handleInputChange}>
                                <option value="Excellent">Xuất sắc</option>
                                <option value="Good">Tốt</option>
                                <option value="Average">Trung bình</option>
                                <option value="Poor">Kém</option>
                            </select>
                        </div>

                        {/* Image Upload */}
                        <div className="form-group">
                            <label>
                                <i className="fas fa-image"></i>
                                Hình ảnh drone
                            </label>
                            <input
                                type="file"
                                name="image"
                                onChange={this.handleFileChange}
                                accept="image/*"
                                className="file-input"
                            />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="form-actions">
                        <button type="button" className="btn-cancel">
                            <i className="fas fa-times"></i>
                            Hủy
                        </button>
                        <button type="submit" className="btn-submit">
                            <i className="fas fa-save"></i>
                            Tạo Drone
                        </button>
                    </div>
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
        // language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default withNavigate(
    connect(mapStateToProps, mapDispatchToProps)(CreateNewUav)
);
