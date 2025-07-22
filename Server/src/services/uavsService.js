import db from "../models/index";
let handleCreateNewUav = (inputdata) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !inputdata.droneId ||
                !inputdata.droneName ||
                !inputdata.speedMax ||
                !inputdata.hightMax ||
                !inputdata.performance
            ) {
                resolve({
                    errCode: 2,
                    message: "Missing required fields",
                });
                return;
            }
            // Check if UAV with the same droneId already exists
            let existingUav = await db.Uav.findOne({
                where: { droneId: inputdata.droneId },
            });
            if (existingUav) {
                resolve({
                    errCode: 1,
                    message: "UAV with this droneId already exists",
                });
                return;
            }
            // Create new UAV

            let newUav = await db.Uav.create({
                droneId: inputdata.droneId,
                droneName: inputdata.droneName,
                speedMax: inputdata.speedMax,
                hightMax: inputdata.hightMax,
                performance: inputdata.performance,
                image: inputdata.image || "",
            });
            resolve({
                errCode: 0,
                message: "UAV created successfully",
                uav: newUav,
            });
        } catch (error) {
            reject(error);
        }
    });
};
let handleGetAllUavs = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let uavs = await db.Uav.findAll();
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
module.exports = {
    handleCreateNewUav,
    handleGetAllUavs,
};
