import registerUavService from "../services/registerUavService";
let handleRegisterNewUav = async (req, res) => {
    try {
        let message = await registerUavService.handleRegisterNewUav(req.body);
        return res.status(200).json(message);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server...",
        });
    }
};
let handleGetAllUavs = async (req, res) => {
    try {
        let uavs = await registerUavService.handleGetAllUavs();
        return res.status(200).json({
            errCode: 0,
            message: "OK",
            uavs: uavs,
        });
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server...",
        });
    }
};
let handleGetAllUavsRegisterByOwner = async (req, res) => {
    try {
        let ownerId = req.params.ownerId;
        let uavs = await registerUavService.handleGetAllUavsRegisterByOwner(
            ownerId
        );
        return res.status(200).json({
            errCode: 0,
            message: "OK",
            uavs: uavs,
        });
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server...",
        });
    }
};
let handleUpdateUav = async (req, res) => {
    try {
        let message = await registerUavService.handleUpdateUav(req.body);
        return res.status(200).json(message);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server...",
        });
    }
};
let handleGetUavsByDroneId = async (req, res) => {
    try {
        let droneId = req.params.droneId;
        let uavs = await registerUavService.handleGetUavsByDroneId(droneId);
        return res.status(200).json(uavs);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            message: "Error from server...",
        });
    }
};

let handleChangeUavStatus = async (req, res) => {
    try {
        let { droneId, newStatus } = req.query;
        let result = await registerUavService.handleChangeUavStatus(
            droneId,
            newStatus
        );
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            message: "Error from server...",
        });
    }
};
let handleGetUavByStatus = async (req, res) => {
    try {
        let status = req.query.status;
        let ownerId = req.query.ownerId;
        let result = await registerUavService.handleGetUavByStatus(
            status,
            ownerId
        );
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server...",
        });
    }
};
let handleDeleteUav = async (req, res) => {
    try {
        let droneId = req.query.droneId;
        let result = await registerUavService.handleDeleteUav(droneId);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            message: "Error from server...",
        });
    }
};

let getUavsRegiteredRecently = async (req, res) => {
    try {
        let ownerId = req.query.ownerId;
        let data = await registerUavService.getUavsRegiteredRecently(ownerId);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
let getUavsUpdatedRecently = async (req, res) => {
    try {
        let ownerId = req.query.ownerId;
        let data = await registerUavService.getUavsUpdatedRecently(ownerId);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
let getUavCompletedRecently = async (req, res) => {
    try {
        let ownerId = req.query.ownerId;
        let data = await registerUavService.getUavCompletedRecently(ownerId);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
let saveFlightPath = async (req, res) => {
    try {
        let { droneId, flightPathFile } = req.body;
        let result = await registerUavService.saveFlightPath(droneId, flightPathFile);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            message: "Error from server...",
        });
    }
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
    saveFlightPath
};
