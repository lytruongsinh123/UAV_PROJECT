import actionTypes from "./actionTypes";
import { toast } from 'react-toastify';

import { handleLogin } from "../../service/userService";


// Login action
export const HandleLoginStart = (email, password) => { 
    return async (dispatch, getState) => { 
        try {
            let res = await handleLogin(email, password);
            if (res && res.errCode === 0) {
                dispatch(handleLoginSuccess(email, password, res));
                toast.success("Login successful!");
            } else {
                dispatch(handleLoginFail(res));
            }
        } catch (error) {
            dispatch(handleLoginFail(error));
            toast.error("Login failed: " + error.message);
        }
    }
}
export const handleLoginSuccess = (email, password, res) => ({
    type: actionTypes.LOGIN_SUCCESS,
    payload: res,
    userInfo: {
        email: email,
        password: password,
    },
})
export const handleLoginFail = (res) => ({
    type: actionTypes.LOGIN_FAIL,
    payload: res,
    userInfo: {},
})

// Logout action
export const handleLogout = () => ({
    type: actionTypes.LOGOUT,
})