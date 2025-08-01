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
class LiveTrackingCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uavPosition: { lat: 21.0285, lng: 105.8542 }, // Hà Nội
            uavInfo: {
                id: "UAV001",
                name: "Drone A",
                status: "Đang hoạt động",
            },
            tracking: true,
        };
        this.trackingInterval = null;
        this.flightPathLogs = [];
    }
    componentDidMount = async () => {
        // Giả lập UAV di chuyển từ Hà Nội đến Hải Phòng
        const raw1 = await geocodeAddress(this.props.position1);
        const raw2 = await geocodeAddress(this.props.position2);
        const start = { lat: raw1.lat, lng: raw1.lng };
        const end = { lat: raw2.lat, lng: raw2.lng };
        const uavSpeed = this.props.uav.speed;
        const uavDistance = this.props.uav.distance;
        const travelTime = (uavDistance / uavSpeed) * 3600;
        this.setState({
            uavInfo: {
                id: this.props.uav.droneId,
                name: this.props.uav.droneName,
                image: this.props.uav.uavData.image,
                status: "Đang hoạt động",
            },
        });
        let step = 0;
        this.trackingInterval = setInterval(async () => {
            if (!this.state.tracking) return;
            step += 1;
            // Di chuyển tuyến tính
            const lat = start.lat + ((end.lat - start.lat) * step) / travelTime;
            const lng = start.lng + ((end.lng - start.lng) * step) / travelTime;
            this.setState({ uavPosition: { lat, lng } });
            this.flightPathLogs.push(
                `second: ${step}, lat: ${lat}, lng: ${lng}`
            );
            if (step >= travelTime) {
                clearInterval(this.trackingInterval);
                this.setState({
                    tracking: false,
                    uavInfo: { ...this.state.uavInfo, status: "Đã đến nơi" },
                });
                // Lưu log đường bay
                const flightPathText = this.flightPathLogs.join("\n");
                const flightPathBase64 = btoa(
                    unescape(encodeURIComponent(flightPathText))
                );
                try {
                    await saveFlightPath({
                        droneId: this.state.uavInfo.id,
                        flightPathFile: flightPathBase64,
                    });
                    alert("Đã lưu đường bay!");
                } catch (err) {
                    alert("Lỗi lưu đường bay!");
                }
            }
        }, 1000);
    };

    componentWillUnmount = () => {
        if (this.trackingInterval) clearInterval(this.trackingInterval);
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
                            onClick={() => {
                                this.setState({ tracking: !tracking });
                            }}>
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
    return {};
};

export default withNavigate(
    connect(mapStateToProps, mapDispatchToProps)(LiveTrackingCard)
);
