import actionTypes from "./actionTypes";
import { toast } from "react-toastify";

import { handleLogin, handleUpdateUser } from "../../service/userService";

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
    };
};
export const handleLoginSuccess = (res) => ({
    type: actionTypes.LOGIN_SUCCESS,
    payload: res.message,
    userInfo: {
        id: res.user.id,
        email: res.user.email,
        password: res.user.password,
        firstName: res.user.firstName,
        lastName: res.user.lastName,
        address: res.user.address,
        positionId: res.user.positionId,
    },
});
export const handleLoginFail = (res) => ({
    type: actionTypes.LOGIN_FAIL,
    payload: res.message,
    userInfo: {},
});

// Edit user action
export const handleEditUser = (userData) => {
    return async (dispatch, getState) => {
        try {
            let res = await handleUpdateUser(userData);
            if (res && res.errCode === 0) {
                dispatch(handleEditUserSuccess(res));
                toast.success("User updated successfully!");
            } else {
                dispatch(handleEditUserFail(res));
                toast.error("Update failed: " + res.message);
            }
        } catch (error) {
            dispatch(handleEditUserFail(error));
            toast.error("Update failed: " + error.message);
        }
    };
};
export const handleEditUserSuccess = (res) => ({
    type: actionTypes.EDIT_USER_SUCCESS,
    payload: res.message,
    userInfo: {
        id: res.user.id,
        email: res.user.email,
        firstName: res.user.firstName,
        lastName: res.user.lastName,
        address: res.user.address,
        positionId: res.user.positionId,
    },
});
export const handleEditUserFail = (res) => ({
    type: actionTypes.EDIT_USER_FAIL,
    payload: res.message,
    userInfo: {},
});

// Logout action
export const handleLogout = () => ({
    type: actionTypes.LOGOUT,
});
