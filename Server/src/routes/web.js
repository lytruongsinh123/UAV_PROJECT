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
    router.get("/api/get-user-by-id", userController.getUserById);

    // API UAV REGISTER
    router.post("/api/register-new-uav", registerUavController.handleRegisterNewUav);
    router.get("/api/get-all-uavs", registerUavController.handleGetAllUavs);
    router.get("/api/get-all-uavs-register-by-owner/:ownerId", registerUavController.handleGetAllUavsRegisterByOwner);
    router.post("/api/update-uav", registerUavController.handleUpdateUav);
    router.get("/api/get-uavs-by-droneId/:droneId", registerUavController.handleGetUavsByDroneId);
    router.post("/api/change-uav-status", registerUavController.handleChangeUavStatus);
    router.get("/api/get-uav-by-status", registerUavController.handleGetUavByStatus);
    router.delete("/api/delete-uav", registerUavController.handleDeleteUav);
    router.get("/api/get-uavs-registered-recently", registerUavController.getUavsRegiteredRecently);
    router.get("/api/get-uavs-updated-recently", registerUavController.getUavsUpdatedRecently);
    router.get("/api/get-uav-completed-recently", registerUavController.getUavCompletedRecently);

    return app.use("/", router);
};
module.exports = initWebRouters;
