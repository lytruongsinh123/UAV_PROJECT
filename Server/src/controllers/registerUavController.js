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
module.exports = {
    handleRegisterNewUav,
    handleGetAllUavs,
    handleGetAllUavsRegisterByOwner,
    handleUpdateUav,
    handleGetUavsByDroneId,
};
