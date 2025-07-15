import express from "express";
import userController from "../controllers/userController";
import uavController from "../controllers/uavController";

let router = express.Router();
let initWebRouters = (app) => {
    // API USER
    router.post("/api/login", userController.handleLogin);
    router.get("/api/get-all-users", userController.handleGetAllUsers);
    router.post("/api/create-new-user", userController.handleCreateNewUser);
    router.put("/api/edit-user", userController.handleEditUser);
    router.delete("/api/delete-user", userController.handleDeleteUser);
    router.get("/api/allcode", userController.getAllCode);

    // API UAV
    router.post("/api/create-new-uav", uavController.handleCreateNewUav);
    router.get("/api/get-all-uavs", uavController.handleGetAllUavs);
    router.get("/api/get-all-uavs-by-owner/:ownerId", uavController.handleGetAllUavsByOwner);


    return app.use("/", router);
};
module.exports = initWebRouters;
