const ApiError = require("../../utils/ApiError");
const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const fake_userService = require("../../services/fake_user.service");
const s3 = require("../../s3");
const User = require('../../models/user.model');
const NodeCache = require('node-cache');
const mongoosePaginate = require('mongoose-paginate-v2');

const usersCache = new NodeCache({stdTTL: 1000})
usersCache.set("latestUsers", [])

//Get users
const getUsers = catchAsync(async (req, res, next) => {
  const users = await fake_userService.getAllUsers();
  if (!users) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send(users);
});

//Get User
const getUser = catchAsync(async (req, res, next) => {
  // console.log(req.params.id);
  const user = await fake_userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send(user);
});

const getUsersByPagination = catchAsync(async (req, res, next) => {
  const ofs = req.params.id;
  const users = await fake_userService.getUsersByPagination(ofs);
  if (!users) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send(users);
})

/*const myCache = new NodeCache();
  let obj = {my: "Special", variable: 42}
  let obj1 = {my: "Other special", variable: 1337}
  const success = myCache.mset([
    {key: "myKey",val: obj, ttl: 100},
    {key: "myKey2", val: obj1},
])

const anotherCache = new NodeCache();
*/


const getLatestUsers = catchAsync(async (req, res, next) => {
  const ofs = req.params.id;
  const sizePerPage = 20;

  let b = usersCache.get("latestUsers")
  let d = {}
  let pages;
  // console.log(b.length)
  // res.send(latest)

  if (ofs < b.length) {
    console.log("Getting data from caching")
    // console.log(usersCache.getStats())
    console.log(d['1'])
    res.send([])
    
  } else {
    const latest = await fake_userService.getlatestUsers(req.params.id);
    console.log("Getting data from MONGODB")
    usersCache.set("latestUsers", latest)
    pages = parseInt(req.params.id / sizePerPage)
    console.log(typeof pages)
    for (let p = 1; p < pages+1; p++) {
      let m = []
      m.push(...latest.slice((p-1)*sizePerPage,p*sizePerPage))
      d[p.toString()] = m
    }
    console.log(d['1'])
    res.send(latest)
    }
  }
  /*const a = latest.map((lu,index) => {
    return {key: index + 1, val: lu, ttl: 100};
  })

  const successSet = anotherCache.mset([...a])
  anotherCache.take("1")
  anotherVal = anotherCache.get('1')
  
  
  console.log(anotherCache.has("1"))

  /*value = myCache.get("myKey")
  if (value === undefined) console.log('error')
  else console.log(value)
  if (anotherVal === undefined) console.log('error')
  else console.log(anotherVal)
  */
  
  /*if (usersCache.has("latestUsers")) {
    let b = usersCache.get("latestUsers")
    console.log(b.length)
    if (ofs < b.length) {
      const c = usersCache.get("latestUsers").slice(0,ofs)
      console.log(c.length)
      console.log("Getting data from caching")
      res.send(c);
    }
    
  } else {
    
    console.log("Getting data from MONGODB")
    usersCache.set("latestUsers", latest)
    res.send(latest)
  }*/
  
  // res.send(latest);
)

const getUsersByScrolling = catchAsync(async(req, res, next) => {
  let page = parseInt(req.query.page)
  let sizePerPage = parseInt(req.query.size)
  const count = await User.count();

  const startIndex = (page - 1)*sizePerPage;

  const users = await User.find().skip(startIndex).limit(sizePerPage); 

  res.json(users)

})

//Update User
const updateUser = catchAsync(async (req, res, next) => {
  const user = await fake_userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

//Delete User
const deleteUser = catchAsync(async (req, res, next) => {
  const deletedUser = await fake_userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send(deletedUser);
});

const createfakeUser = catchAsync(async(req,res,next) => {
  await fake_userService.createfakeUser(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
})

const getReviews = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const user = await fake_userService.getUserById(userId);
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
  getUsersByPagination,
  getLatestUsers,
  getUsersByScrolling,
  getUser,
  updateUser,
  deleteUser,
  createfakeUser,
  getReviews,
  uploadPhoto,
  getPhoto,
};
