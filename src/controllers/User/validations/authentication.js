const userService = require("../../../services/user.service");
const jsonwebtoken = require("jsonwebtoken");
const catchAsync = require("../../../utils/catchAsync");
const ApiError = require("../../../utils/ApiError");
const httpStatus = require("http-status");

const checkNullInput = (input, requireField) => {
  for (const field of requireField) {
    if (!(field in input)) {
      throw new ApiError(404, `${field} does not exist`);
    }
  }
};

const signUp = catchAsync(async (req, res, next) => {
  checkNullInput(req.body, ["email", "password", "username", "name"]);
  const { email, password, username, name, color, shortId } = req.body;
  if (await userService.fieldExist({ email })) {
    throw new ApiError(404, "email taken");
  }
  if (await userService.fieldExist({ username })) {
    throw new ApiError(404, "username taken");
  }
  const user = await userService.createUser(req.body);
  const token = jsonwebtoken.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION_DAYS,
  });
  user.token = token;
  await user.save();
  res.status(202).send({token:token, status: "Success"});
});

const logIn = catchAsync(async (req, res, next) => {
  checkNullInput(req.body, ["email", "password"]);
  const { email, password } = req.body;
  const user = await userService.getUserByField({ email });
  if (!user) {
    throw new ApiError(404, "no user with this emails found");
  }
  if (!(await user.isPasswordMatch(req.body.password))) {
    throw new ApiError(404, "Invalid Password");
  }
  const token = jsonwebtoken.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION_DAYS + "d",
  });
  res.status(202).json({ status: "Success", token });
});

// passport middleware, put this before any route that needs protection
const checkPassport = catchAsync(async (req, res, next) => {
  const tokenString = req.headers.authorization;
  if (!tokenString) throw new ApiError(404, "no token found");
  const token = tokenString.split(" ")[1];
  const credential = jsonwebtoken.verify(token, process.env.JWT_SECRET);
  if (!credential) throw new ApiError(404, `${token} is invalid`);
  const user = await userService.getUserById(credential.id);
  req.user = user;
  next();
});

module.exports = {
  signUp,
  logIn,
  checkPassport,
};
