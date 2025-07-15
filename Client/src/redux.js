import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // lưu vào localStorage
import { combineReducers } from "redux";
import userReducer from "./store/reducers/userReducer";
import uavReducer from "./store/reducers/uavReducer";
const persistConfig = {
    key: "root", // khóa gốc trong localStorage
    storage, // dùng localStorage
    whitelist: ["user"], // chỉ lưu phần state `user` (nếu muốn)
};


// Kết hợp các reducer khác nếu cần
const rootReducer = combineReducers({
    user: userReducer,
    uav: uavReducer, 
});

// Tạo reducer đã được persist
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Tạo store với persistedReducer
const reduxStore = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // bỏ qua kiểm tra tính tuần tự
        }),
});


export const persistor = persistStore(reduxStore); // tạo đối tượng persistor để quản lý trạng thái đã persist lưu trong localStorage
export default reduxStore; // xuất reduxStore để sử dụng trong ứng dụng lưu trữ trạng thái Redux