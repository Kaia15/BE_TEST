const mongoose = require("mongoose");
const User = require("./user.model");
const responseSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    content:{
        type: String,
        minlength: 5,
        maxlength: 200
    } 
}, {timestamps: true})


module.exports = responseSchema;