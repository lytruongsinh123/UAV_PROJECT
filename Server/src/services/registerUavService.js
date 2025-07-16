import db from "../models/index";
let handleRegisterNewUav = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("=== DEBUG: Input data ===");
            console.log("Data received:", data);
            console.log("DroneId:", data.droneId);
            console.log("Type of droneId:", typeof data.droneId);
            if (
                !data.ownerId ||
                !data.droneId ||
                !data.droneName ||
                !data.startPoint ||
                !data.endPoint ||
                !data.heightFly ||
                !data.speed ||
                !data.status
            ) {
                resolve({
                    errCode: 1,
                    message: "Missing required parameters",
                });
            } else {
                let uavRegistered = await db.RegisterUav.findOne({
                    where: {
                        droneId: data.droneId,
                    },
                });
                if (uavRegistered) {
                    resolve({
                        errCode: 2,
                        message: "Drone is already registered",
                    });
                } else {
                    await db.RegisterUav.create({
                        ownerId: data.ownerId,
                        droneId: data.droneId,
                        droneName: data.droneName,
                        startPoint: data.startPoint,
                        endPoint: data.endPoint,
                        heightFly: data.heightFly,
                        speed: data.speed,
                        status: data.status,
                    });
                    resolve({
                        errCode: 0,
                        message: "UAV registered successfully",
                    });
                }
            }
        } catch (error) {
            console.error("Error creating UAV:", error);
            reject({
                errCode: 1,
                message: "Failed to create UAV",
            });
        }
    });
};
let handleGetAllUavs = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let uavs = await db.RegisterUav.findAll({
                raw: true,
            });
            resolve({
                errCode: 0,
                message: "OK",
                uavs: uavs,
            });
        } catch (error) {
            console.error("Error fetching UAVs:", error);
            reject({
                errCode: -1,
                message: "Error from server...",
            });
        }
    });
};
let handleGetAllUavsRegisterByOwner = async (ownerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let uavs = await db.RegisterUav.findAll({
                where: { ownerId: ownerId },
                raw: true,
            });
            resolve({
                errCode: 0,
                message: "OK",
                uavs: uavs,
            });
        } catch (error) {
            console.error("Error fetching UAVs by owner:", error);
            reject({
                errCode: -1,
                message: "Error from server...",
            });
        }
    });
};
let handleUpdateUav = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let uav = await db.RegisterUav.findOne({
                where: { droneId: data.droneId },
            });
            if (uav) {
                uav.droneName = data.droneName;
                uav.startPoint = data.startPoint;
                uav.endPoint = data.endPoint;
                uav.heightFly = data.heightFly;
                uav.speed = data.speed;
                uav.status = data.status;
                await uav.save();
                resolve({
                    errCode: 0,
                    message: "UAV updated successfully",
                });
            } else {
                resolve({
                    errCode: 1,
                    message: "UAV not found",
                });
            }
        } catch (error) {
            console.error("Error updating UAV:", error);
            reject({
                errCode: -1,
                message: "Error from server...",
            });
        }
    });
};
let handleGetUavsByDroneId = async (droneId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let uavs = await db.RegisterUav.findOne({
                where: { droneId: droneId },
            });
            console.log("UAVs found:", uavs);
            resolve({
                errCode: 0,
                message: "OK",
                uavs: uavs,
            });
        } catch (error) {
            reject({
                errCode: -1,
                message: "Error from server...",
            });
        }
    });
};
module.exports = {
    handleRegisterNewUav,
    handleGetAllUavs,
    handleGetAllUavsRegisterByOwner,
    handleUpdateUav,
    handleGetUavsByDroneId,
};
