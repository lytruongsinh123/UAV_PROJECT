import axios from "../axios";
const sendEmail = (data) => {
    return axios.post(`/api/feedback/send`, data);
};
export { sendEmail };
