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
const createNewUser = (userData) => { 
    return axios.post("/api/create-new-user", userData);
};
export { handleLogin, handleUpdateUser, getUserById, createNewUser };
