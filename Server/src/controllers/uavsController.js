import uavsService from "../services/uavsService";
let handleCreateNewUav = async (req, res) => {
    try {
        let result = await uavsService.handleCreateNewUav(req.body);
        return res.status(200).json(result);
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
        let result = await uavsService.handleGetAllUavs();
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server...",
        });
    }
};
module.exports = {
    handleCreateNewUav,
    handleGetAllUavs,
}
