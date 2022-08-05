const Config =  require("../../models/config.model");
const catchAsync = require("../../utils/catchAsync");
const ApiError = require("../../utils/ApiError");



const getVersion = catchAsync(async(req,res) => {
    const config = await Config.find();
    if(!config){
        throw new ApiError(404,'config not found');
    }
    if(!config.version){
        throw new ApiError(404,'version not found');
    }
    res.send(config.version);
})
const getBanner = catchAsync(async (req,res) => {
    const config = await Config.find();
    if(!config){
        throw new ApiError(404,'config not found');
    }
    if(!config.banner){
        throw new ApiError(404,'banner not found');
    }
    res.send(config.banner);
})

module.exports = {
    getBanner,
    getVersion
}


