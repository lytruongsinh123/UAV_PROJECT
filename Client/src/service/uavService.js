import axios from "../axios";
const createNewUav = (data) => {
    return axios.post("/api/create-new-uav", data);
}
const getAllUavs = () => { 
    return axios.get("/api/get-all-uavs");
}
const getAllUavsByOwner = (ownerId) => { 
    return axios.get(`/api/get-all-uavs-by-owner/${ownerId}`);
}
export {
    createNewUav,
    getAllUavs,
    getAllUavsByOwner
}