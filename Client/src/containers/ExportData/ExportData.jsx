import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import { getUavByStatusAndOwner } from "../../service/uavRegisterService";
import themeUtils from "../../utils/ThemeUtils";
import "./ExportData.css";

class ExportData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listUavCompletetoExportData: [],
        };
    }

    componentDidMount = async () => {
        let status = "S3";
        let ownerId = this.props.user.id;
        let result = await getUavByStatusAndOwner(status, ownerId);
        if (result && result.errCode === 0) {
            this.setState({
                listUavCompletetoExportData: result.uavs,
            });
        }
    };

    handleExport = (uav) => {
        if (!uav.flightPathFile) {
            alert("Không có dữ liệu đường bay!");
            return;
        }
        let content = "";
        if (typeof uav.flightPathFile === "object" && uav.flightPathFile.data) {
            // Nếu lưu dạng base64, giải mã về text
            try {
                const base64 = btoa(
                    String.fromCharCode(
                        ...new Uint8Array(uav.flightPathFile.data)
                    )
                );
                content = decodeURIComponent(escape(atob(base64)));
            } catch {
                content = new TextDecoder().decode(
                    new Uint8Array(uav.flightPathFile.data)
                );
            }
        } else {
            content = uav.flightPathFile;
        }
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${uav.droneId}_flightpath.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    handleToggleTheme = () => {
        themeUtils.toggleTheme();
        this.forceUpdate(); // Để cập nhật lại giao diện nếu cần
    };

    render() {
        let { listUavCompletetoExportData } = this.state;
        // Không cần nút chuyển theme ở đây, chỉ tự động nhận theme từ themeUtils
        const isDark =
            themeUtils.getCurrentTheme() === themeUtils.THEME_VALUES.DARK;
        return (
            <div className={`export-data-container${isDark ? " dark" : ""}`}>
                <div className="export-header">
                    <h2>Danh sách UAV đã hoàn thành</h2>
                </div>
                <table className="export-data-table">
                    <thead>
                        <tr>
                            <th>Drone ID</th>
                            <th>Tên UAV</th>
                            <th>Thời gian hoàn thành</th>
                            <th>Export Flight Path</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listUavCompletetoExportData &&
                        listUavCompletetoExportData.length > 0 ? (
                            listUavCompletetoExportData.map((uav, idx) => (
                                <tr key={uav.id}>
                                    <td>{uav.droneId}</td>
                                    <td>{uav.droneName}</td>
                                    <td>{uav.updatedAt}</td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                this.handleExport(uav)
                                            }>
                                            Tải đường bay
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">
                                    Không có dữ liệu UAV hoàn thành
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
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
        user: state.user.userInfo,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {};
};

export default withNavigate(
    connect(mapStateToProps, mapDispatchToProps)(ExportData)
);
