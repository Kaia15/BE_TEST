const mongoose = require("mongoose");
const { User } = require(".");
const bidSchema = require("./bid.model");
const responseSchema = require("./response.model");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A task must have a title"],
      minlengthL: 5,
      maxlength: 50,
    },
    deadline: {type: Date},
    timeofTask: {type: Date},
    finalPrice: {type: Number},
    initialPrice: {type: Number},
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    takeCareBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    takeCareAt: {
      type: Date,
      default: Date.now,
    },
    bidBy: [bidSchema], // array of bid subdocuments
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    location: {
      type: {
        type: "String",
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    progress: {
      type: String,
      enum: ["Looking", "Biding", "In progress", "Done!", "Cancel"],
      required: [true, "A task must have progress"],
      default: "Looking",
    },
    category: {
      type: String,
      required: [true, "A task must have a category"],
      minlength: 5,
      maxlength: 50,
    },
    description: {
      type: String,
      required: [true, "A task must have a description"],
      minlength: 50,
      maxlength: 200,
    },
    comments: [responseSchema],
    payment: {
      type: String,
      enum: ["Online", "Externally"],
      requied: [true, "A task must have payment method"], 
      default: "Online",
    },
    // backgroundImage:,
    report: {
      type: String,
      min: 2,
      max: 100,
    },
    imageURL: {
      type: String
    }
    // Rooms: [RoomId]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
