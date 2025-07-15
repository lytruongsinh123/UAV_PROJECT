import db from "../models/index";
let createNewUav = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.ownerId ||
                !data.droneId ||
                !data.droneName ||
                !data.startPoint ||
                !data.endPoint ||
                !data.heightFly ||
                !data.speed ||
                !data.status) {
                resolve({
                    errCode: 1,
                    message: "Missing required parameters",
                });
            } else {
                let uav = await db.Uav.create({
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
                    message: "Create new UAV successfully",
                    uav: uav,
                });
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
let getAllUavs = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let uavs = await db.Uav.findAll({
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
let getAllUavsByOwner = async (ownerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let uavs = await db.Uav.findAll({
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
module.exports = {
    createNewUav,
    getAllUavs,
    getAllUavsByOwner,
};
