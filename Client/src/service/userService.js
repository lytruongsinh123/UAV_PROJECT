import axios from "../axios";
const handleLogin = (email, password) => {
    return axios.post("/api/login", { email, password });
};
const handleUpdateUser = (userData) => {
    return axios.put(`/api/edit-user`, userData);
};
const getUserById = (id) => {
    return axios.get(`/api/get-user-by-id?id=${id}`);
};
export { handleLogin, handleUpdateUser, getUserById };
