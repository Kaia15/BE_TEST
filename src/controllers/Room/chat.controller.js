const Room = require("../../models/room.model");
const catchAsync = require("../../utils/catchAsync");
const ApiError = require("./../../utils/ApiError");

const chatList = catchAsync(async (req, res) => {
  const user = req.user;
  const startTime = req.startTime;
  /*
  const totalTime = process.hrtime(startTime);
  const totalTimeInMs = totalTime[0] * 1000 + totalTime[1] / 1000000; */
  const totalTimeInMs = Date.now() - startTime;
  if (!user) return new ApiError(404, "User not found");
    const rooms = await Room.find({
    $or: [{ participant: user._id }, { owner: user._id }],
  });
  res.status(202).send({
    status: "Sucess",
    result: rooms,
    totalTimeInMs: totalTimeInMs
  });
});

const chatInRoom = catchAsync(async (req, res, next) => {
  const room = await Room.findById(req.params.id);
  if(!room) throw new ApiError(404,"Room not found");
  
  res.status(202).send(room.messages);
});

const createChatRoom = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const taskId = req.body.taskId;
  const room = await Room.create({task: taskId, owner: userId});
  if(!room) throw new ApiError(403,"can not create room");
  res.status(202).send(room);
});


module.exports = {
  chatList,
  chatInRoom,
  createChatRoom,
};
