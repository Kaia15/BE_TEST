const mongoose = require("mongoose");
const User = require("./user.model");
const bidSchema = new mongoose.Schema({
    bidder:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    price: {
        type: Number,
        required: [true, "User must bid"],
        min: 1
    }
    
},{timestamps: true});




module.exports = bidSchema;