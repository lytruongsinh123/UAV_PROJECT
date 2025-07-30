import db from "../models/index";
import MapService from "./MapService";
import { Buffer } from "buffer";
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
                    // Lấy khoảng cách, kiểm tra null
                    let startCoords = await MapService.getCoordinates(
                        data.startPoint
                    );
                    let endCoords = await MapService.getCoordinates(
                        data.endPoint
                    );
                    let distance = null;
                    try {
                        distance = await MapService.getDistance(
                            startCoords,
                            endCoords
                        );
                    } catch (err) {
                        console.error(
                            "Lỗi lấy khoảng cách OpenRouteService:",
                            err
                        );
                        distance = null;
                    }
                    // Nếu không lấy được khoảng cách, thử OSRM
                    if (distance === null) {
                        try {
                            if (startCoords && endCoords) {
                                distance = await MapService.getDistanceOSRM(
                                    startCoords,
                                    endCoords
                                );
                            }
                        } catch (err) {
                            console.error("Lỗi lấy khoảng cách OSRM:", err);
                            distance = null;
                        }
                    }
                    // Nếu vẫn không lấy được khoảng cách, trả về lỗi cho client
                    if (distance === null) {
                        return resolve({
                            errCode: 3,
                            message:
                                "Không lấy được khoảng cách giữa hai điểm. Vui lòng kiểm tra lại địa chỉ hoặc thử lại sau!",
                        });
                    }
                    await db.RegisterUav.create({
                        ownerId: data.ownerId,
                        droneId: data.droneId,
                        droneName: data.droneName,
                        startPoint: data.startPoint,
                        endPoint: data.endPoint,
                        heightFly: data.heightFly,
                        speed: data.speed,
                        status: "S0",
                        distance: distance,
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
                let startCoords = await MapService.getCoordinates(
                    data.startPoint
                );
                let endCoords = await MapService.getCoordinates(data.endPoint);
                let distance = null;
                try {
                    distance = await MapService.getDistance(
                        startCoords,
                        endCoords
                    );
                } catch (err) {
                    console.error(
                        "Lỗi cập nhật khoảng cách OpenRouteService:",
                        err
                    );
                    distance = null;
                }
                if (distance === null) {
                    try {
                        if (startCoords && endCoords) {
                            distance = await MapService.getDistanceOSRM(
                                startCoords,
                                endCoords
                            );
                        }
                    } catch (err) {
                        console.error("Lỗi cập nhật khoảng cách OSRM:", err);
                        distance = null;
                    }
                }
                uav.distance = distance;
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
                include: [
                    {
                        model: db.Uav,
                        as: "uavData",
                        attributes: ["image"],
                    },
                ],
            });

            // Chuyển trường image từ Buffer sang link base64 dùng Buffer.from
            let uavsWithImageLink = uavs.map((uav) => {
                if (uav.uavData && uav.uavData.image) {
                    uav.uavData.image = Buffer.from(
                        uav.uavData.image,
                        "base64"
                    ).toString("binary");
                }
                return uav;
            });
            resolve({
                errCode: 0,
                message: "OK",
                uavs: uavsWithImageLink,
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

let getUavsRegiteredRecently = async (ownerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let uavs = await db.RegisterUav.findAll({
                where: { ownerId: ownerId },
                order: [["createdAt", "DESC"]], // Sắp xếp theo thời gian tạo mới nhất
                limit: 5,
            });
            resolve({
                errCode: 0,
                message: "OK",
                uavs: uavs,
            });
        } catch (error) {
            reject(error);
        }
    });
};
let getUavsUpdatedRecently = async (ownerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let uavs = await db.RegisterUav.findAll({
                where: { ownerId: ownerId },
                order: [["updatedAt", "DESC"]], // Sắp xếp theo thời gian cập nhật mới nhất
                limit: 5,
            });
            resolve({
                errCode: 0,
                message: "OK",
                uavs: uavs,
            });
        } catch (error) {
            console.error("Error fetching recently updated UAVs:", error);
            reject(error);
        }
    });
};
// lấy uav hoàn thành gần nhất để hiện thị thời gian ago
let getUavCompletedRecently = async (ownerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let uavs = await db.RegisterUav.findAll({
                where: { ownerId: ownerId, status: "S3" },
                order: [["updatedAt", "DESC"]],
                limit: 1,
            });
            resolve({
                errCode: 0,
                message: "OK",
                uavs: uavs,
            });
        } catch (error) {
            console.error("Error fetching recently completed UAVs:", error);
            reject(error);
        }
    });
};
let saveFlightPath = async (droneId, flightPathFile) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!droneId) {
                resolve({
                    errCode: 1,
                    message: `Missing required parameters ${droneId}`,
                });
            }
            let uav = await db.RegisterUav.findOne({
                where: { droneId: droneId },
            });
            if (uav) {
                uav.flightPathFile = Buffer.from(flightPathFile,"base64").toString("binary");
                await uav.save();
                resolve({
                    errCode: 0,
                    message: "Flight path saved successfully",
                });
            } else {
                resolve({
                    errCode: 2,
                    message: "UAV not found",
                });
            }
        } catch (error) {
            reject(error);
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
    getUavsRegiteredRecently,
    getUavsUpdatedRecently,
    getUavCompletedRecently,
    saveFlightPath,
};
