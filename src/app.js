const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require("express-rate-limit");
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
//const passport = require('passport');
const httpStatus = require('http-status');
//const { jwtStrategy } = require('./config/passport');
const config = require("./config/config");
const jwt = require("jsonwebtoken");
const path = require("path");
const logger = require("morgan");
const mongoose = require("mongoose");
const fs = require("fs");
const gateRoute = require('./routes/v1/mainRouter');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const responseTime = require("./respond-time");



/*
const multerStorage = multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null,"src/public/img");
  },
  filename: (req,file,cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null,`image-${1000}.${ext}`)
  }

})
const multerFilter = (req,file,cb) => {
  if(file.mimetype.startsWith('image')){
    cb(null,true);
  }else{
    console.log("Not image bro");
  }
}
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});*/

const app = express();

// set limited request
/*const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // limit each IP to 200 requests per window/Ms
  });*/

// set security HTTP headers
app.use(helmet());
if (process.env.NODE_ENV === "production") {
    app.use(limiter);
    app.use(
      logger("common", {
        stream: fs.createWriteStream("./access.log", { flags: "a" }),
      })
    );
  } else {
    app.use(logger("dev"));
}


// enable cors
app.use(
  cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.options(
  '*',
  cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// jwt authentication
//app.use(passport.initialize());
//passport.use('jwt', jwtStrategy);
app.use(responseTime);
// v1 api routes
app.use('/api/v1', gateRoute);

 

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);


module.exports = {
  app,
  config
}