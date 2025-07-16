import actionTypes from "./actionTypes";
import { toast } from 'react-toastify';

import { handleLogin } from "../../service/userService";


// Login action
export const HandleLoginStart = (email, password) => { 
    return async (dispatch, getState) => { 
        try {
            let res = await handleLogin(email, password);
            if (res && res.errCode === 0) {
                dispatch(handleLoginSuccess(res));
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
export const handleLoginSuccess = (res) => ({
    type: actionTypes.LOGIN_SUCCESS,
    payload: res.message,
    userInfo: {
        id: res.user.id,
        email: res.user.email,
        password: res.user.password,
        firstName: res.user.firstName,
        lastName: res.user.lastName,
        positionId: res.user.positionId,
    },
})
export const handleLoginFail = (res) => ({
    type: actionTypes.LOGIN_FAIL,
    payload: res.message,
    userInfo: {},
})

// Logout action
export const handleLogout = () => ({
    type: actionTypes.LOGOUT,
})