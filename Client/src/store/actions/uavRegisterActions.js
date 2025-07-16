import actionTypes from "./actionTypes";
import { toast } from "react-toastify";

import {
    registerNewUav,
    getAllUavsRegisterByOwner,
    updateUav,
    getUavsByDroneId
} from "../../service/uavRegisterService";

export const ActionUavRegister = (action) => {
    return async (dispatch, getState) => {
        try {
            if (action === "CREATE") {
                dispatch({
                    type: actionTypes.CHANGE_ACTION_SUCCESS,
                    actiont: "CREATE",
                });
            } else if (action === "EDIT") {
                dispatch({
                    type: actionTypes.CHANGE_ACTION_SUCCESS,
                    actiont: "EDIT",
                });
            } else if (action === "DELETE") {
                dispatch({
                    type: actionTypes.CHANGE_ACTION_SUCCESS,
                    actiont: "DELETE",
                });
            }
            else if (action === "LAUNCH") {
                dispatch({
                    type: actionTypes.CHANGE_ACTION_SUCCESS,
                    actiont: "LAUNCH",
                });
            }
        } catch (error) {
            dispatch(changeActionFail(error));
        }
    };
};
export const changeActionFail = (error) => ({
    type: actionTypes.CHANGE_ACTION_FAIL,
    payload: error,
});
// Create UAV action
export const registerUav = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await registerNewUav(data);
            if (res && res.errCode === 0) {
                dispatch(registerUavSuccess(res));
                toast.success("UAV registered successfully!");
            } else {
                dispatch(registerUavFail(res));
                toast.error("Failed to register UAV: " + res.message);
            }
        } catch (error) {
            dispatch(registerUavFail(error));
            toast.error("Error registering UAV: " + error.message);
        }
    };
};
export const registerUavSuccess = (res) => ({
    type: actionTypes.REGISTER_UAV_SUCCESS,
    payload: res,
});
export const registerUavFail = (error) => ({
    type: actionTypes.REGISTER_UAV_FAIL,
    payload: error,
});

// Fetch all UAVs by owner action
export const fetchAllUavsByOwner = (ownerId) => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllUavsRegisterByOwner(ownerId);
            if (res && res.errCode === 0) {
                dispatch(fetchAllUavsByOwnerSuccess(res.uavs));
            } else {
                console.log("API Error:", res.errMessage || res.message);
                dispatch(fetchAllUavsByOwnerFail(res));
            }
        } catch (error) {
            console.error("Catch Error:", error);
            dispatch(fetchAllUavsByOwnerFail(error));
        }
    };
};
export const fetchAllUavsByOwnerSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_UAVS_BY_OWNER_SUCCESS,
    payload: data.message,
    uavs: data.uavs,
});
export const fetchAllUavsByOwnerFail = (error) => ({
    type: actionTypes.FETCH_ALL_UAVS_BY_OWNER_FAIL,
    payload: error,
    uavs: [],
});

// Update UAV action
export const updateUavRedux = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await updateUav(data);
            if (res && res.errCode === 0) {
                dispatch(updateUavSuccess(res));
                toast.success("UAV updated successfully!");
            } else {
                dispatch(updateUavFail(res));
                toast.error("Failed to update UAV: " + res.message);
            }
        } catch (error) {
            dispatch(updateUavFail(error));
            toast.error("Error updating UAV: " + error.message);
        }
    };
};
export const updateUavSuccess = (res) => ({
    type: actionTypes.UPDATE_UAV_SUCCESS,
    payload: res.message,
});
export const updateUavFail = (error) => ({
    type: actionTypes.UPDATE_UAV_FAIL,
    payload: error,
});


