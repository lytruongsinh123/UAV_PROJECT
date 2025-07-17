import React, { Component } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import geocodeAddress from "../../../utils/getCoordinate";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

class FlightPath extends Component {
    constructor(props) {
        super(props);
        this.map = null;
        this.state = {
            position1: null,
            position2: null,
        };
    }

    async componentDidMount() {
        try {
            const raw1 = await geocodeAddress("Hà Nội");
            const raw2 = await geocodeAddress("Hải Phòng");

            const position1 = { lat: raw1.lat, lng: raw1.lng };
            const position2 = { lat: raw2.lat, lng: raw2.lng };

            this.setState({ position1, position2 });

            const pointA = L.latLng(position1.lat, position1.lng);
            const pointB = L.latLng(position2.lat, position2.lng);
            const distance = pointA.distanceTo(pointB);
            console.log(`Khoảng cách chim bay: ${distance.toFixed(2)} mét`);

            setTimeout(() => {
                if (this.map && L.Routing) {
                    L.Routing.control({
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

    render() {
        const { position1, position2 } = this.state;

        if (!position1 || !position2) {
            return <div>Đang tải bản đồ...</div>;
        }

        return (
            <div style={{ height: "100vh", width: "100%" }}>
                <MapContainer
                    center={position1}
                    zoom={10}
                    style={{ height: "100%", width: "100%" }}
                    whenCreated={(mapInstance) => {
                        this.map = mapInstance;
                    }}
                >
                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position1} />
                    <Marker position={position2} />
                </MapContainer>
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
        uavs: state.uavRegister.uavs,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default withNavigate(
    connect(mapStateToProps, mapDispatchToProps)(FlightPath)
);
