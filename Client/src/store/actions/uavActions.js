import actionTypes from "./actionTypes";
import { toast } from 'react-toastify';

import { createNewUav } from "../../service/uavService";
// Create UAV action
export const createUavStart = (data) => { 
    return async (dispatch, getState) => { 
        try {
            let res = await createNewUav(data);
            if (res && res.errCode === 0) {
                dispatch(createUavSuccess(res));
                toast.success("UAV created successfully!");
            } else {
                dispatch(createUavFail(res));
                toast.error("Failed to create UAV: " + res.message);
            }
        } catch (error) {
            dispatch(createUavFail(error));
            toast.error("Error creating UAV: " + error.message);
        }
    }
}
export const createUavSuccess = (res) => ({
    type: actionTypes.CREATE_UAV_SUCCESS,
    payload: res,
})

export const createUavFail = (error) => ({
    type: actionTypes.CREATE_UAV_FAIL,
    payload: error,
})