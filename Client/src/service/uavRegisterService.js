import axios from "../axios";
const registerNewUav = (data) => {
    return axios.post("/api/register-new-uav", data);
};
const getAllUavs = () => {
    return axios.get("/api/get-all-uavs");
};
const getAllUavsRegisterByOwner = (ownerId) => {
    return axios.get(`/api/get-all-uavs-register-by-owner/${ownerId}`);
};
const updateUav = (data) => {
    return axios.post("/api/update-uav", data);
};
const getUavsByDroneId = (droneId) => {
    return axios.get(`/api/get-uavs-by-droneId/${droneId}`);
};
const handleChangeStatus = (droneId, newStatus) => {
    return axios.post(
        `/api/change-uav-status?droneId=${droneId}&newStatus=${newStatus}`
    );
};
const getUavByStatusAndOwner = (status, ownerId) => {
    return axios.get(
        `/api/get-uav-by-status?status=${status}&ownerId=${ownerId}`
    );
};
const deleteUav = (droneId) => {
    return axios.delete(`/api/delete-uav?droneId=${droneId}`);
};
const getUavsRegisteredRecently = (ownerId) => {
    return axios.get(`/api/get-uavs-registered-recently?ownerId=${ownerId}`);
};
const getUavsUpdatedRecently = (ownerId) => {
    return axios.get(`/api/get-uavs-updated-recently?ownerId=${ownerId}`);
};
const getUavCompletedRecently = (ownerId) => {
    return axios.get(`/api/get-uav-completed-recently?ownerId=${ownerId}`);
};
const saveFlightPath = (data) => {
    return axios.post("/api/save-flight-path", data);
};
export {
    registerNewUav,
    getAllUavs,
    getAllUavsRegisterByOwner,
    updateUav,
    getUavsByDroneId,
    handleChangeStatus,
    getUavByStatusAndOwner,
    deleteUav,
    getUavsRegisteredRecently,
    getUavsUpdatedRecently,
    getUavCompletedRecently,
    saveFlightPath,
};
