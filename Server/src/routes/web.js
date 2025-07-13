import express from "express";
import userController from "../controllers/userController";

let router = express.Router();
let initWebRouters = (app) => {
    // API USER
    router.post("/api/login", userController.handleLogin);
    router.get("/api/get-all-users", userController.handleGetAllUsers);
    router.post("/api/create-new-user", userController.handleCreateNewUser);
    router.put("/api/edit-user", userController.handleEditUser);
    router.delete("/api/delete-user", userController.handleDeleteUser);
    router.get("/api/allcode", userController.getAllCode);

    return app.use("/", router);
};
module.exports = initWebRouters;
