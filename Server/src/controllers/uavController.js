import uavService from "../services/uavService";
let handleCreateNewUav = async (req, res) => {
    try {
        let message = await uavService.createNewUav(req.body);
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
        let uavs = await uavService.getAllUavs();
        return res.status(200).json({
            errCode: 0,
            message: "OK",
            uavs: uavs,
        })
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server...",
        });
    }
};
let handleGetAllUavsByOwner = async (req, res) => { 
    try {
        let ownerId = req.params.ownerId;
        let uavs = await uavService.getAllUavsByOwner(ownerId);
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
}
module.exports = {
    handleCreateNewUav,
    handleGetAllUavs,
    handleGetAllUavsByOwner,
};
