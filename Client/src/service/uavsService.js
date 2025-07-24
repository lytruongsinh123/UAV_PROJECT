import axios from "../axios";
const creatNewUav = (data) => {
    return axios.post(`/api/create-new-uav`, data);
};
const getAllUavs = () => {
    return axios.get(`/api/get-all-uavs`);
}
export { creatNewUav, getAllUavs };
