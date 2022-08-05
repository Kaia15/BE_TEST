const ApiError = require("../../utils/ApiError");
const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const { userService } = require("../../services");
const s3 = require("../../s3");


//Get users
const getUsers = catchAsync(async (req, res, next) => {
  const users = await userService.getAllUsers();
  if (!users) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send(users);
});

//Get User
const getUser = catchAsync(async (req, res, next) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send(user);
});

//Update User
const updateUser = catchAsync(async (req, res, next) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

//Delete User
const deleteUser = catchAsync(async (req, res, next) => {
  const deletedUser = await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send(deletedUser);
});

const createfakeUser = catchAsync(async(req,res,next) => {
  await userService.createfakeUser(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
})

const getReviews = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const user = await userService.getUserById(userId);
  res.send(user.reviews);
});


const uploadPhoto = catchAsync(async(req,res) => {
  const imageBuffer = req.file.buffer;
  if (!imageBuffer) throw new ApiError(404,"No photos found, please reupload")
  if (!req.body.name) throw new ApiError(404,"No photos name found, please give your photo a name")
  // resize image to 800x800, take in image in the form of buffer
  const resizedImage = await s3.resizedImage(imageBuffer);
  // upload image, take in image stream
  const imageInfo = await s3.uploadImage(resizedImage,req.body.name);
  req.user.avatar = imageInfo.Key;
  await req.user.save();
  res.send({ message: "Avatar uploaded", key:imageInfo.Key });
});


const getPhoto = catchAsync(async (req, res) => {
  const key = req.user.avatar;
  if (!key) throw new ApiError(404,"Image does not exist")
  const blob_image =  await s3.getImage(key);
  blob_image.stream().pipe(res);
});


module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  createfakeUser,
  getReviews,
  uploadPhoto,
  getPhoto,
};
