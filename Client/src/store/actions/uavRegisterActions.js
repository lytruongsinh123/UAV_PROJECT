import actionTypes from "./actionTypes";
import { toast } from "react-toastify";
import { statusFlightPath } from "../../utils/constants";
import notificationService from "../../service/notificationService";
import {
    registerNewUav,
    getAllUavsRegisterByOwner,
    updateUav,
    handleChangeStatus,
    getUavByStatusAndOwner,
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
            } else if (action === "LAUNCH") {
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

                // 🎉 Thông báo đăng ký thành công
                notificationService.uavAction(
                    "REGISTER",
                    data.droneId || "New UAV",
                    "has been registered successfully",
                    { duration: 4000 }
                );

                toast.success("UAV registered successfully!");
            } else {
                dispatch(registerUavFail(res));

                // 🚨 Thông báo lỗi đăng ký
                notificationService.error(
                    "Registration Failed",
                    `Failed to register UAV: ${res.message}`,
                    { duration: 6000 }
                );

                toast.error("Failed to register UAV: " + res.message);
            }
        } catch (error) {
            dispatch(registerUavFail(error));

            // 🚨 Thông báo lỗi
            notificationService.error(
                "Registration Error",
                `Error registering UAV: ${error.message}`,
                { duration: 6000 }
            );

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

                // 🎉 Thông báo cập nhật thành công
                notificationService.uavAction(
                    "EDIT",
                    data.droneId || "UAV",
                    "has been updated successfully",
                    { duration: 4000 }
                );

                toast.success("UAV updated successfully!");
            } else {
                dispatch(updateUavFail(res));

                // 🚨 Thông báo lỗi cập nhật
                notificationService.error(
                    "Update Failed",
                    `Failed to update UAV: ${res.message}`,
                    { duration: 6000 }
                );

                toast.error("Failed to update UAV: " + res.message);
            }
        } catch (error) {
            dispatch(updateUavFail(error));

            // 🚨 Thông báo lỗi
            notificationService.error(
                "Update Error",
                `Error updating UAV: ${error.message}`,
                { duration: 6000 }
            );

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

// Change UAV status action
export const changeUavStatus = (droneId, newStatus, oldStatus = null) => {
    return async (dispatch, getState) => {
        try {
            let res = await handleChangeStatus(droneId, newStatus);
            if (res && res.errCode === 0) {
                dispatch(changeStatusUavSuccess(res));

                // 🎉 Hiển thị thông báo thành công
                const statusNames = {
                    S0: "Pending",
                    S1: "Active",
                    S2: "Maintenance",
                    S3: "Completed",
                };

                notificationService.statusChange(
                    droneId,
                    oldStatus ? statusNames[oldStatus] : "Unknown",
                    statusNames[newStatus] || newStatus,
                    { duration: 4000 }
                );

                // Giữ lại toast cho backward compatibility
                toast.success(
                    "UAV status changed to " +
                        `${statusFlightPath[newStatus]}` +
                        " successfully!"
                );
            } else {
                dispatch(changeStatusUavFail(res));

                // 🚨 Hiển thị thông báo lỗi
                notificationService.error(
                    "Status Change Failed",
                    `Failed to change UAV ${droneId} status: ${res.message}`,
                    { duration: 6000 }
                );

                toast.error("Failed to change UAV status: " + res.message);
            }
        } catch (error) {
            dispatch(changeStatusUavFail(error));

            // 🚨 Hiển thị thông báo lỗi
            notificationService.error(
                "Status Change Error",
                `Error changing UAV ${droneId} status: ${error.message}`,
                { duration: 6000 }
            );

            toast.error("Error changing UAV status: " + error.message);
        }
    };
};
export const changeStatusUavSuccess = (res) => ({
    type: actionTypes.CHANGE_STATUS_UAV_SUCCESS,
    payload: res.message,
});
export const changeStatusUavFail = (error) => ({
    type: actionTypes.CHANGE_STATUS_UAV_FAIL,
    payload: error,
});

// Batch change UAV status action
export const batchChangeUavStatus = (statusChanges) => {
    return async (dispatch, getState) => {
        const results = {
            success: [],
            failed: [],
        };

        // 📢 Thông báo bắt đầu batch update
        notificationService.info(
            "Batch Status Update",
            `Starting batch update for ${statusChanges.length} UAV(s)...`,
            { duration: 3000 }
        );

        for (const change of statusChanges) {
            try {
                let res = await handleChangeStatus(
                    change.droneId,
                    change.newStatus
                );
                if (res && res.errCode === 0) {
                    results.success.push(change);
                    dispatch(changeStatusUavSuccess(res));
                } else {
                    results.failed.push({ ...change, error: res.message });
                    dispatch(changeStatusUavFail(res));
                }
            } catch (error) {
                results.failed.push({ ...change, error: error.message });
                dispatch(changeStatusUavFail(error));
            }
        }

        // 📊 Thông báo kết quả batch update
        if (results.success.length > 0) {
            notificationService.success(
                "Batch Update Complete",
                `Successfully updated ${results.success.length} UAV(s) status`,
                { duration: 5000 }
            );
        }

        if (results.failed.length > 0) {
            notificationService.error(
                "Batch Update Errors",
                `Failed to update ${results.failed.length} UAV(s) status`,
                { duration: 7000 }
            );
        }

        return results;
    };
};

// Fetach UAVs by status and owner action
export const fetchUavsByStatusAndOwner = (status, ownerId) => {
    return async (dispatch, getState) => {
        try {
            let res = await getUavByStatusAndOwner(status, ownerId);
            if (res && res.errCode === 0) {
                dispatch(fetchUavsByStatusAndOwnerSuccess(res.uavs));
                toast.success("Fetched UAVs by status and owner successfully!");
            } else {
                dispatch(fetchUavsByStatusAndOwnerFail(res));
            }
        } catch (error) {
            dispatch(fetchUavsByStatusAndOwnerFail(error));
            toast.error(
                "Error fetching UAVs by status and owner: " + error.message
            );
        }
    };
};
export const fetchUavsByStatusAndOwnerSuccess = (uavs) => ({
    type: actionTypes.FETCH_UAVS_BY_STATUS_AND_OWNER_SUCCESS,
    uavsByStatus: uavs,
    payload: uavs.message,
});
export const fetchUavsByStatusAndOwnerFail = (error) => ({
    type: actionTypes.FETCH_UAVS_BY_STATUS_AND_OWNER_FAIL,
    payload: error,
    uavsByStatus: [], // Ensure this is an empty array to avoid undefined issues
});
