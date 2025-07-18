import actionTypes from "../actions/actionTypes";
const initialState = {
    isLoggedIn: false,
    message: "",
    userInfo: {},
};
const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                userInfo: action.userInfo,
                message: action.payload,
            };
        case actionTypes.LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                userInfo: {},
                message: action.payload,
            };
        case actionTypes.EDIT_USER_SUCCESS:
            return {
                ...state,
                userInfo: action.userInfo,
                message: action.payload,
            };
        case actionTypes.EDIT_USER_FAIL:
            return {
                ...state,
                userInfo: {},
                message: action.payload,
            };
        case actionTypes.LOGOUT:
            // Return một object mới hoàn toàn, không dùng spread
            return {
                isLoggedIn: false,
                message: "",
                userInfo: {},
            };
        default:
            return state;
    }
};
export default userReducer;
