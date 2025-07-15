import actionTypes from "../actions/actionTypes";
const initialState = {
    uavs: [],
    message: "",
};
const uavReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CREATE_UAV_SUCCESS:
            return {
                ...state,
                message: "UAV created successfully!",
            };
        case actionTypes.CREATE_UAV_FAIL:
            return {
                ...state,
                message: "Failed to create UAV: " + action.payload,
            };
        default:
            return state;
    }
};
export default uavReducer;
