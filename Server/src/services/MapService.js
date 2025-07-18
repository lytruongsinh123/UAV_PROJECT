// Thêm dòng này ở đầu tiên
import fetch from "node-fetch";
global.fetch = fetch;

// Các import khác
import Openrouteservice from "openrouteservice-js";
require("dotenv").config();

const Directions = new Openrouteservice.Directions({
    api_key: process.env.API_KEY_MAP_OPENROUTES,
});

// Hàm lấy khoảng cách đường đi
async function getDistance(startCoords, endCoords) {
    // Kiểm tra đầu vào
    if (
        !Array.isArray(startCoords) ||
        !Array.isArray(endCoords) ||
        startCoords.length !== 2 ||
        endCoords.length !== 2
    ) {
        console.error("Tọa độ không hợp lệ:", startCoords, endCoords);
        return null;
    }
    try {
        const res = await Directions.calculate({
            coordinates: [startCoords, endCoords],
            profile: "driving-car", // đường bộ thực tế cho UAV
            format: "geojson",
        });

        // Kiểm tra kết quả trả về
        if (
            !res.features ||
            !res.features[0] ||
            !res.features[0].properties ||
            !res.features[0].properties.summary ||
            typeof res.features[0].properties.summary.distance !== "number"
        ) {
            console.error(
                "Không tìm thấy đường đi giữa hai điểm:",
                startCoords,
                endCoords
            );
            return null;
        }

        const meters = res.features[0].properties.summary.distance;
        const km = meters / 1000;
        return km.toFixed(2);
    } catch (error) {
        console.error("Lỗi lấy khoảng cách:", error);
        return null;
    }
}

const Geocode = new Openrouteservice.Geocode({
    api_key: process.env.API_KEY_MAP_OPENROUTES,
});

// Trả về [lng, lat] từ tên địa điểm
async function getCoordinates(placeName) {
    try {
        const res = await Geocode.geocode({
            text: placeName,
            size: 1,
        });

        const coords = res.features[0].geometry.coordinates; // [lng, lat]
        return coords;
    } catch (err) {
        console.error("Lỗi geocode:", err);
        return null;
    }
}

export default {
    getDistance,
    getCoordinates,
};
