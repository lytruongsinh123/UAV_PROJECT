import axios from "../axios";
const registerNewUav = (data) => {
    return axios.post("/api/register-new-uav", data);
}
const getAllUavs = () => { 
    return axios.get("/api/get-all-uavs");
}
const getAllUavsRegisterByOwner = (ownerId) => {
    return axios.get(`/api/get-all-uavs-register-by-owner/${ownerId}`);
}
const updateUav = (data) => { 
    return axios.post("/api/update-uav", data);
}
const getUavsByDroneId = (droneId) => {
    return axios.get(`/api/get-uavs-by-droneId/${droneId}`);
}
export {
    registerNewUav,
    getAllUavs,
    getAllUavsRegisterByOwner,
    updateUav,
    getUavsByDroneId
}