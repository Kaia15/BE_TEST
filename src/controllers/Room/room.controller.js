const catchAsync = require("../../utils/catchAsync");
const Room = require("../../models/room.model");
const ApiError = require("../../utils/ApiError");
const User = require("../../models/user.model")

/*
const createRoom = async (user, task) => {
  try {
    const room = await Room.create({task: task, owner: user});
    if (!room) throw new ApiError(404, "no room found");
    return room;
  } catch (error) {
    console.log(error);
  }
};*/
// Add user to the room with corresponding id
 
const joinRoom = async (room_id, user) => {
  try {
    if (!room_id) {
      throw new ApiError(404, "room not found");
    }
    const room = await Room.findById(room_id);
    if (!room) {
      throw new ApiError(404, "room not found");
    }
    if(room.participant !== user & room.owner !== user){
      room.participant = user;
      await room.save();  
    }
    return room;
  } catch (error) {
    console.log(error);
  }
};

const sendMessage = async (sender,room_id,message) => {
  const room = await Room.findById(room_id);
  const sender_id = await User.findOne({username: sender},"_id")
  if (!room) {
    throw new ApiError(404, "no room with a valid id found");
  }
  if (!sender_id){
    throw new ApiError(404,"user not found")
  }
  room.messages.push({from: sender_id, content: message });
  await room.save();
  return room;
};

module.exports = {
  joinRoom,
  sendMessage,
};
