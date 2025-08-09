import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import { createNewUav } from "../../../service/uavsService";
import { toast } from "react-toastify";
import CommonUtils from "../../../utils/CommonUtils";
import "./CreateNewUav.css";
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
            previewImgUrl: null, // Thêm preview URL
            isSubmitting: false, // Thêm loading state
        };
    }

    componentDidMount = async () => {
        // Không cần theme listener, CSS sẽ tự động handle
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

        // Validation
        if (
            !this.state.droneId ||
            !this.state.droneName ||
            !this.state.speedMax ||
            !this.state.hightMax
        ) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
            return;
        }

        this.setState({ isSubmitting: true });

        try {
            let res = await createNewUav({
                droneId: this.state.droneId,
                droneName: this.state.droneName,
                speedMax: parseInt(this.state.speedMax),
                hightMax: parseInt(this.state.hightMax),
                performance: this.state.performance,
                image: this.state.image,
            });

            if (res && res.errCode === 0) {
                toast.success("Tạo drone thành công!");
                // Reset form
                this.setState({
                    droneId: "",
                    droneName: "",
                    speedMax: "",
                    hightMax: "",
                    performance: "Good",
                    image: null,
                    previewImgUrl: null,
                });
            } else {
                toast.error(
                    "Tạo drone thất bại: " +
                        (res.errMessage || "Lỗi không xác định")
                );
            }
        } catch (error) {
            console.error("Error creating drone:", error);
            toast.error("Có lỗi xảy ra khi tạo drone!");
        } finally {
            this.setState({ isSubmitting: false });
        }
    };

    handleCancel = () => {
        // Reset form
        this.setState({
            droneId: "",
            droneName: "",
            speedMax: "",
            hightMax: "",
            performance: "Good",
            image: null,
            previewImgUrl: null,
        });
        toast.info("Đã hủy tạo drone!");
    };

    render() {
        const {
            droneId,
            droneName,
            speedMax,
            hightMax,
            performance,
            previewImgUrl,
            isSubmitting,
        } = this.state;

        return (
            <div className="create-drone-container">
                <div className="create-drone-header">
                    <h1>
                        <i className="fas fa-plus"></i>
                        <FormattedMessage id="create-uav.title" defaultMessage="Tạo Drone Mới" />
                    </h1>
                </div>

                <form onSubmit={this.handleSubmit} className="drone-form">
                    <div className="form-grid">
                        {/* Drone ID */}
                        <div className="form-group">
                            <label>
                                <i className="fas fa-tag"></i>
                                <FormattedMessage id="create-uav.drone-id" defaultMessage="Drone ID *" />
                            </label>
                            <input
                                type="text"
                                name="droneId"
                                value={droneId}
                                onChange={(event) =>
                                    this.handleOnChangeInput(event, "droneId")
                                }
                                placeholder="Nhập ID drone (VD: DRN-001)"
                                required
                            />
                        </div>

                        {/* Drone Name */}
                        <div className="form-group">
                            <label>
                                <i className="fas fa-drone"></i>
                                <FormattedMessage id="create-uav.drone-name" defaultMessage="Tên Drone *" />
                            </label>
                            <input
                                type="text"
                                name="droneName"
                                value={droneName}
                                onChange={(event) =>
                                    this.handleOnChangeInput(event, "droneName")
                                }
                                placeholder="Nhập tên drone"
                                required
                            />
                        </div>

                        {/* Speed Max */}
                        <div className="form-group">
                            <label>
                                <i className="fas fa-tachometer-alt"></i>
                                <FormattedMessage id="create-uav.max-speed" defaultMessage="Tốc độ tối đa (km/h) *" />
                            </label>
                            <input
                                type="number"
                                name="speedMax"
                                value={speedMax}
                                onChange={(event) =>
                                    this.handleOnChangeInput(event, "speedMax")
                                }
                                placeholder="Nhập tốc độ tối đa"
                                min="1"
                                required
                            />
                        </div>

                        {/* Height Max */}
                        <div className="form-group">
                            <label>
                                <i className="fas fa-arrows-alt-v"></i>
                                <FormattedMessage id="create-uav.max-height" defaultMessage="Độ cao tối đa (m) *" />
                            </label>
                            <input
                                type="number"
                                name="hightMax"
                                value={hightMax}
                                onChange={(event) =>
                                    this.handleOnChangeInput(event, "hightMax")
                                }
                                placeholder="Nhập độ cao tối đa"
                                min="1"
                                required
                            />
                        </div>

                        {/* Performance */}
                        <div className="form-group">
                            <label>
                                <i className="fas fa-star"></i>
                                <FormattedMessage id="create-uav.performance" defaultMessage="Hiệu suất" />
                            </label>
                            <select
                                name="performance"
                                value={performance}
                                onChange={(event) =>
                                    this.handleOnChangeInput(
                                        event,
                                        "performance"
                                    )
                                }>
                                <option value="Excellent">
                                    { this.props.language === 'vi' ? 'Xuất sắc' : 'Excellent'   }
                                </option>
                                <option value="Good">
                                    { this.props.language === 'vi' ? 'Tốt' : 'Good' }
                                </option>
                                <option value="Average">
                                    { this.props.language === 'vi' ? 'Trung bình' : 'Average' }
                                </option>
                                <option value="Poor">
                                    { this.props.language === 'vi' ? 'Yếu' : 'Poor' }
                                </option>
                            </select>
                        </div>

                        {/* Image Upload with Preview */}
                        <div className="form-group">
                            <label>
                                <i className="fas fa-image"></i>
                                <FormattedMessage id="create-uav.drone-image" defaultMessage="Hình ảnh" />
                            </label>
                            <input
                                type="file"
                                name="image"
                                onChange={this.handleOnchangeImg}
                                accept="image/*"
                                className="file-input"
                            />
                            {previewImgUrl && (
                                <div className="image-preview">
                                    <img src={previewImgUrl} alt="Preview" />
                                    <button
                                        type="button"
                                        className="remove-image"
                                        onClick={() =>
                                            this.setState({
                                                image: null,
                                                previewImgUrl: null,
                                            })
                                        }>
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={this.handleCancel}
                            disabled={isSubmitting}>
                            <i className="fas fa-times"></i>
                            <FormattedMessage id="create-uav.cancel" defaultMessage="Hủy" />
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    <FormattedMessage id="create-uav.is-creating" defaultMessage="Đang tạo..." />
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save"></i>
                                    <FormattedMessage id="create-uav.create" defaultMessage="Tạo Drone" />
                                </>
                            )}
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
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default withNavigate(
    connect(mapStateToProps, mapDispatchToProps)(CreateNewUav)
);
