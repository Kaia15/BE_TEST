const mongoose = require("mongoose");
const User = require("./user.model");
const configSchema = new mongoose.Schema({
    version: Number,
    banner: String
},{timestamps: true})


const configModel = mongoose.model('Config',configSchema);



module.exports = configModel;