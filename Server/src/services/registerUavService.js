import db from "../models/index";
import MapService from "./MapService";

let handleRegisterNewUav = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.ownerId ||
                !data.droneId ||
                !data.droneName ||
                !data.startPoint ||
                !data.endPoint ||
                !data.heightFly ||
                !data.speed
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
                        status: "S0",
                        distance: await MapService.getDistance(
                            await MapService.getCoordinates(data.startPoint),
                            await MapService.getCoordinates(data.endPoint)
                        ),
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
                uav.distance = await MapService.getDistance(
                    await MapService.getCoordinates(data.startPoint),
                    await MapService.getCoordinates(data.endPoint)
                );
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

let handleChangeUavStatus = async (droneId, newStatus) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!droneId || !newStatus) {
                return resolve({
                    errCode: 1,
                    message: "Missing required parameters",
                });
            }
            let uav = await db.RegisterUav.findOne({
                where: { droneId: droneId },
            });

            if (uav) {
                if (uav.status === "S0") {
                    // Nếu UAV đang chờ hoạt động
                    switch (newStatus) {
                        case "S1": // Chuyển sang hoạt động
                            uav.status = "S1";
                            await uav.save();
                            resolve({
                                errCode: 0,
                                message: "UAV status updated to active",
                            });
                            break;
                        case "S2": // Chuyển sang bảo trì
                            uav.status = "S2";
                            await uav.save();
                            resolve({
                                errCode: 0,
                                message: "UAV status updated to maintenance",
                            });
                            break;
                        default:
                            resolve({
                                errCode: 2,
                                message: "Not change or invalid status change",
                            });
                    }
                }
                if (uav.status === "S1") {
                    // Nếu UAV đang hoạt động
                    switch (newStatus) {
                        case "S3": // Chuyển sang hoàn thành lịch trình
                            uav.status = "S3";
                            await uav.save();
                            resolve({
                                errCode: 0,
                                message: "UAV status updated to completed",
                            });
                            break;
                        default:
                            resolve({
                                errCode: 2,
                                message: "Not change or invalid status change",
                            });
                    }
                }
                if (uav.status === "S2") {
                    // Nếu UAV đang bảo trì
                    resolve({
                        errCode: 2,
                        message:
                            "UAV is under maintenance, cannot change status",
                    });
                }
                if (uav.status === "S3") {
                    // Nếu UAV đã hoàn thành lịch trình
                    switch (newStatus) {
                        case "S0": // Chuyển sang chờ hoạt động
                            uav.status = "S0";
                            await uav.save();
                            resolve({
                                errCode: 0,
                                message: "UAV status updated to pending",
                            });
                            break;
                        default:
                            resolve({
                                errCode: 2,
                                message: "Invalid status change",
                            });
                    }
                }
            } else {
                resolve({
                    errCode: 1,
                    message: "UAV not found",
                });
            }
        } catch (error) {
            console.error("Error changing UAV status:", error);
            reject({
                errCode: -1,
                message: "Error from server...",
            });
        }
    });
};
let handleGetUavByStatus = async (status, ownerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let uavs = await db.RegisterUav.findAll({
                where: {
                    status: status,
                    ownerId: ownerId,
                },
            });
            resolve({
                errCode: 0,
                message: "OK",
                uavs: uavs,
            });
        } catch (error) {
            console.error("Error getting UAV by status:", error);
            reject({
                errCode: -1,
                message: "Error from server...",
            });
        }
    });
};
let handleDeleteUav = async (droneId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let uav = await db.RegisterUav.findOne({
                where: { droneId: droneId },
            });
            if (uav) {
                await uav.destroy();
                resolve({
                    errCode: 0,
                    message: "UAV deleted successfully",
                });
            } else {
                resolve({
                    errCode: 1,
                    message: "UAV not found",
                });
            }
        } catch (error) {
            console.error("Error deleting UAV:", error);
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
    handleChangeUavStatus,
    handleGetUavByStatus,
    handleDeleteUav,
};
