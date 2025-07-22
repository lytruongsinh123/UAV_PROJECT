import React, { Component } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import geocodeAddress from "../../utils/getCoordinate";
import { FormattedMessage } from "react-intl";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import "./CardFlyPath.css";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});
class CardFlightPath extends Component {
    constructor(props) {
        super(props);
        this.map = null;
        this.routingControl = null; // Thêm biến này
        this.state = {
            position1: null,
            position2: null,
        };
    }
    async componentDidMount() {
        try {
            const raw1 = await geocodeAddress(this.props.position1);
            const raw2 = await geocodeAddress(this.props.position2);
            const position1 = { lat: raw1.lat, lng: raw1.lng };
            const position2 = { lat: raw2.lat, lng: raw2.lng };
            this.setState({ position1, position2 });
            const pointA = L.latLng(position1.lat, position1.lng);
            const pointB = L.latLng(position2.lat, position2.lng);
            const distance = pointA.distanceTo(pointB);
            console.log(`Khoảng cách chim bay: ${distance.toFixed(2)} mét`);
            setTimeout(() => {
                if (this.map && L.Routing) {
                    // Nếu đã có routingControl thì remove trước
                    if (this.routingControl) {
                        try {
                            this.map.removeControl(this.routingControl);
                        } catch (err) {
                            // ignore nếu đã bị remove
                        }
                    }
                    this.routingControl = L.Routing.control({
                        waypoints: [pointA, pointB],
                        lineOptions: {
                            styles: [{ color: "blue", weight: 5 }],
                        },
                        show: false,
                        addWaypoints: false,
                        draggableWaypoints: false,
                        fitSelectedRoutes: true,
                        routeWhileDragging: false,
                        createMarker: () => null,
                    }).addTo(this.map);
                }
            }, 300);
        } catch (err) {
            console.error("Lỗi khi lấy tọa độ:", err);
        }
    }

    componentWillUnmount() {
        // Cleanup routing control khi unmount
        if (this.routingControl && this.map) {
            try {
                this.map.removeControl(this.routingControl);
            } catch (err) {
                // ignore nếu đã bị remove
            }
        }
    }

    render() {
        const { position1, position2 } = this.state;
        if (!position1 || !position2) {
            return (
                <div className="flightpath-card loading-card">
                    <i className="fas fa-spinner fa-spin fa-2x"></i>
                    <span>
                        <FormattedMessage id="flight-path.loading-map" />
                    </span>
                </div>
            );
        }

        return (
            <div className="flightpath-card">
                <div className="flightpath-header">
                    <div className="flightpath-icon">
                        <i className="fas fa-route"></i>
                    </div>
                    <div className="flightpath-title">
                        <h2>
                            <FormattedMessage id="flight-path.title" />
                        </h2>
                        <span>
                            <i className="fas fa-plane-departure"></i>
                            <FormattedMessage id="flight-path.start-point" />:{" "}
                            {this.props.position1}
                            {"  "}
                            <i className="fas fa-plane-arrival"></i>
                            <FormattedMessage id="flight-path.end-point" />:{" "}
                            {this.props.position2}
                        </span>
                    </div>
                </div>
                <div className="flightpath-info">
                    <div className="info-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>
                            <FormattedMessage id="flight-path.from" />:{" "}
                            <b>
                                {position1.lat.toFixed(4)},{" "}
                                {position1.lng.toFixed(4)}
                            </b>
                        </span>
                    </div>
                    <div className="info-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>
                            <FormattedMessage id="flight-path.to" />:{" "}
                            <b>
                                {position2.lat.toFixed(4)},{" "}
                                {position2.lng.toFixed(4)}
                            </b>
                        </span>
                    </div>
                </div>
                <div className="flightpath-map">
                    <MapContainer
                        center={position1}
                        zoom={10}
                        style={{
                            height: "300px",
                            width: "100%",
                            borderRadius: "12px",
                            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                        }}
                        whenCreated={(mapInstance) => {
                            this.map = mapInstance;
                        }}>
                        <TileLayer
                            attribution="&copy; OpenStreetMap contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={position1} />
                        <Marker position={position2} />
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
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default withNavigate(
    connect(mapStateToProps, mapDispatchToProps)(CardFlightPath)
);
