import express from "express";
import userController from "../controllers/userController";
import registerUavController from "../controllers/registerUavController";

let router = express.Router();
let initWebRouters = (app) => {
    // API USER
    router.post("/api/login", userController.handleLogin);
    router.get("/api/get-all-users", userController.handleGetAllUsers);
    router.post("/api/create-new-user", userController.handleCreateNewUser);
    router.put("/api/edit-user", userController.handleEditUser);
    router.delete("/api/delete-user", userController.handleDeleteUser);
    router.get("/api/allcode", userController.getAllCode);

    // API UAV REGISTER
    router.post("/api/register-new-uav", registerUavController.handleRegisterNewUav);
    router.get("/api/get-all-uavs", registerUavController.handleGetAllUavs);
    router.get("/api/get-all-uavs-register-by-owner/:ownerId", registerUavController.handleGetAllUavsRegisterByOwner);
    router.post("/api/update-uav", registerUavController.handleUpdateUav);
    router.get("/api/get-uavs-by-droneId/:droneId", registerUavController.handleGetUavsByDroneId);
    
    return app.use("/", router);
};
module.exports = initWebRouters;
