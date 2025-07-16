import actionTypes from "../actions/actionTypes";
const initialState = {
    actions: "CREATE", // Default action
    uavs: [],
    message: "",
};
const uavRegisterReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CHANGE_ACTION_SUCCESS:
            return {
                ...state,
                actions: action.actiont,
            };
        case actionTypes.CHANGE_ACTION_FAIL:
            return {
                ...state,
                message: "Failed to change action: " + action.payload,
            };
        case actionTypes.REGISTER_UAV_SUCCESS:
            return {
                ...state,
                message: "UAV registered successfully!",
                uavs: action.uavs,
            };
        case actionTypes.REGISTER_UAV_FAIL:
            return {
                ...state,
                uavs: [],
                message: "Failed to register UAV: " + action.payload,
            };
        case actionTypes.FETCH_ALL_UAVS_BY_OWNER_SUCCESS:
            return {
                ...state,
                uavs: action.uavs,
                message: "Fetched UAVs successfully!",
            };
        case actionTypes.FETCH_ALL_UAVS_BY_OWNER_FAIL:
            return {
                ...state,
                message: "Failed to fetch UAVs: " + action.payload,
            };
        case actionTypes.UPDATE_UAV_SUCCESS:
            return {
                ...state,
                message: "UAV updated successfully!",
            };
        case actionTypes.UPDATE_UAV_FAIL:
            return {
                ...state,
                message: "Failed to update UAV: " + action.payload,
            };
        default:
            return state;
    }
};
export default uavRegisterReducer;
