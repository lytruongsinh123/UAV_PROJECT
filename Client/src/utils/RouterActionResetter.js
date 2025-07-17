import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { crud_actions } from "../utils/constants";
import * as actions from "../store/actions";

const RouteActionResetter = () => {
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        // Chỉ reset nếu không phải trang đăng ký
        if (location.pathname !== "/registration") {
            dispatch(actions.ActionUavRegister(crud_actions.CREATE));
        }
    }, [location.pathname, dispatch]);

    return null;
};

export default RouteActionResetter;
