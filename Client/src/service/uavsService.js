import axios from "../axios";
const createNewUav = (data) => {
    return axios.post(`/api/create-new-uav`, data);
};
const getAllUavs = () => {
    return axios.get(`/api/get-all-uavs`);
}
export { createNewUav, getAllUavs };
