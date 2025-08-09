import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import geocodeAddress from "../../utils/getCoordinate";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./LiveTrackingCard.css";
import { saveFlightPath } from "../../service/uavRegisterService";
import * as actions from "../../store/actions";
import { statusUav } from "../../utils/constants";
class LiveTrackingCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uavPosition: { lat: 21.0285, lng: 105.8542 },
            uavInfo: {
                id: "UAV001",
                name: "Drone A",
                status: "Đang hoạt động",
            },
            tracking: true,
            step: 0,
            start: null,
            end: null,
        };
        this.trackingInterval = null;
        this.flightPathLogs = [];
    }

    async componentDidMount() {
        // Lấy vị trí start/end từ geocode và lưu vào state
        const raw1 = await geocodeAddress(this.props.position1);
        const raw2 = await geocodeAddress(this.props.position2);
        const start = { lat: raw1.lat, lng: raw1.lng };
        const end = { lat: raw2.lat, lng: raw2.lng };
        this.setState({ start, end });

        const uavSpeed = this.props.uav.speed;
        const uavDistance = this.props.uav.distance;
        const travelTime = parseFloat((uavDistance / uavSpeed) * 3600);

        this.setState({
            uavInfo: {
                id: this.props.uav.droneId,
                name: this.props.uav.droneName,
                image: this.props.uav.uavData.image,
                status: "Đang hoạt động",
            },
        });

        // Lấy lại log nếu có từ localStorage
        const savedLogs = localStorage.getItem(
            `flightPath_${this.props.uav.droneId}`
        );
        let initialStep = 0;
        if (savedLogs) {
            this.flightPathLogs = JSON.parse(savedLogs);
            if (this.flightPathLogs.length > 0) {
                const lastLog =
                    this.flightPathLogs[this.flightPathLogs.length - 1];
                const match = lastLog.match(/second: (\d+)/);
                if (match) {
                    initialStep = parseInt(match[1], 10);
                }
            }
        } else {
            this.flightPathLogs = [];
        }
        this.setState({ step: initialStep });

        this.trackingInterval = setInterval(() => {
            if (!this.state.tracking) return;
            this.setState(
                (prevState) => ({ step: prevState.step + 1 }),
                () => {
                    const { step, start, end } = this.state;
                    if (!start || !end) return;
                    const lat =
                        start.lat + ((end.lat - start.lat) * step) / travelTime;
                    const lng =
                        start.lng + ((end.lng - start.lng) * step) / travelTime;
                    if (isNaN(lat) || isNaN(lng)) return;
                    this.setState({ uavPosition: { lat, lng } });
                    this.flightPathLogs.push(
                        `second: ${step}, lat: ${lat}, lng: ${lng}`
                    );
                    localStorage.setItem(
                        `flightPath_${this.state.uavInfo.id}`,
                        JSON.stringify(this.flightPathLogs)
                    );
                    if (step >= travelTime) {
                        clearInterval(this.trackingInterval);
                        this.setState({
                            tracking: false,
                            uavInfo: {
                                ...this.state.uavInfo,
                                status: "Đã đến nơi",
                            },
                        });
                        this.saveFlightPathAndNavigate();
                    }
                }
            );
        }, 1000);
    }

    componentWillUnmount = () => {
        if (this.trackingInterval) clearInterval(this.trackingInterval);

        // Lưu dữ liệu flight path khi chuyển trang
        if (this.flightPathLogs.length > 0) {
            const flightPathText = this.flightPathLogs.join("\n");
            const flightPathBase64 = btoa(
                unescape(encodeURIComponent(flightPathText))
            );
            saveFlightPath({
                droneId: this.state.uavInfo.id,
                flightPathFile: flightPathBase64,
            })
                .then(() => {
                    alert("Đã lưu đường bay khi chuyển trang!");
                    // KHÔNG xóa localStorage ở đây để có thể tiếp tục khi quay lại
                })
                .catch(() => {
                    alert("Lỗi lưu đường bay khi chuyển trang!");
                });
        }
    };

    handleStopTracking = async () => {
        if (this.state.tracking) {
            // Dừng tracking
            this.setState({ tracking: false });
            if (this.trackingInterval) clearInterval(this.trackingInterval);

            const flightPathText = this.flightPathLogs.join("\n");
            const flightPathBase64 = btoa(
                unescape(encodeURIComponent(flightPathText))
            );
            try {
                await saveFlightPath({
                    droneId: this.state.uavInfo.id,
                    flightPathFile: flightPathBase64,
                });
                localStorage.removeItem(`flightPath_${this.state.uavInfo.id}`);
                alert("Đã lưu đường bay đến vị trí hiện tại!");
            } catch (err) {
                alert("Lỗi lưu đường bay!");
            }
        } else {
            // Tiếp tục tracking
            this.setState({ tracking: true }, () => {
                this.trackingInterval = setInterval(() => {
                    if (!this.state.tracking) return;
                    this.setState(
                        (prevState) => ({ step: prevState.step + 1 }),
                        () => {
                            const { step, start, end } = this.state;
                            const uavSpeed = this.props.uav.speed;
                            const uavDistance = this.props.uav.distance;
                            const travelTime = parseFloat(
                                (uavDistance / uavSpeed) * 3600
                            );
                            if (!start || !end) return;
                            const lat =
                                start.lat +
                                ((end.lat - start.lat) * step) / travelTime;
                            const lng =
                                start.lng +
                                ((end.lng - start.lng) * step) / travelTime;
                            if (isNaN(lat) || isNaN(lng)) return;
                            this.setState({ uavPosition: { lat, lng } });
                            this.flightPathLogs.push(
                                `second: ${step}, lat: ${lat}, lng: ${lng}`
                            );
                            localStorage.setItem(
                                `flightPath_${this.state.uavInfo.id}`,
                                JSON.stringify(this.flightPathLogs)
                            );
                            if (step >= travelTime) {
                                clearInterval(this.trackingInterval);
                                this.setState({
                                    tracking: false,
                                    uavInfo: {
                                        ...this.state.uavInfo,
                                        status: "Đã đến nơi",
                                    },
                                });
                                this.saveFlightPathAndNavigate();
                            }
                        }
                    );
                }, 1000);
            });
        }
    };

    saveFlightPathAndNavigate = async () => {
        const flightPathText = this.flightPathLogs.join("\n");
        const flightPathBase64 = btoa(
            unescape(encodeURIComponent(flightPathText))
        );
        try {
            await saveFlightPath({
                droneId: this.state.uavInfo.id,
                flightPathFile: flightPathBase64,
            });
            localStorage.removeItem(`flightPath_${this.state.uavInfo.id}`);
            alert("Đã lưu đường bay!");
            this.props.navigate("/live-tracking");
        } catch (err) {
            alert("Lỗi lưu đường bay!");
        }
    };

    render() {
        const { uavPosition, uavInfo, tracking } = this.state;
        return (
            <div className="map-livetracking-container">
                <div className="map-sidebar">
                    <div className="map-avatar">
                        {uavInfo.image ? (
                            <img src={uavInfo.image} alt="UAV" />
                        ) : (
                            <div className="avatar-placeholder">No Image</div>
                        )}
                    </div>
                    <div className="map-main">
                        <h2>{uavInfo.name}</h2>
                        <div>ID: {uavInfo.id}</div>
                        <div>
                            <FormattedMessage id="live-tracking.card.status" />:{" "}
                            <b
                                className={
                                    tracking ? "map-tracking" : "map-completed"
                                }>
                                {uavInfo.status}
                            </b>
                        </div>
                    </div>
                    <div className="map-sub">
                        <button
                            className={tracking ? "map-stop" : ""}
                            onClick={this.handleStopTracking}>
                            {tracking ? "Dừng theo dõi" : "Tiếp tục"}
                        </button>
                    </div>
                </div>
                <div className="map-area">
                    <MapContainer
                        center={uavPosition}
                        zoom={9}
                        style={{ height: "100vh", width: "100%" }}>
                        <TileLayer
                            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={uavPosition}>
                            <Popup>
                                <div>
                                    <b>{uavInfo.name}</b>
                                    <br />
                                    Vị trí: {uavPosition.lat.toFixed(4)},{" "}
                                    {uavPosition.lng.toFixed(4)}
                                    <br />
                                    Trạng thái: {uavInfo.status}
                                </div>
                            </Popup>
                        </Marker>
                    </MapContainer>
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
    return {
        HandleChangeStatus: (droneId, status, oldStatus) =>
            dispatch(actions.changeUavStatus(droneId, status, oldStatus)),
    };
};

export default withNavigate(
    connect(mapStateToProps, mapDispatchToProps)(LiveTrackingCard)
);
