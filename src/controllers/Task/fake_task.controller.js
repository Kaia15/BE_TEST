const Task = require("../../services/fake_task.service");
const ApiError = require("../../utils/ApiError");
const catchAsync = require("../../utils/catchAsync");
const s3 = require("../../s3");
const httpStatus = require("http-status");
const TaskModel = require("../../models/task.model");
const NodeCache = require('node-cache');

const throwIfNull = (id, message) => {
  if (!id) {
    throw new ApiError(404, message);
  }
}

const getTasks = catchAsync(async (req, res, next) => {
  const query = req.query;
  if(!query) throw new ApiError(404,"no query found");
  const tasks = await Task.getTaskByField(query); 
  if(!tasks) throw new ApiError(404,"no tasks found");
  res.status(202).send(tasks);
})

const getTasksByPagination = catchAsync(async (req, res, next) => {
  const ofs = req.params.id;
  const tasks = await Task.getTasks(ofs);
  if(!tasks) throw new ApiError(404,"no tasks found");
  res.status(202).send(tasks);
})

const tasksCache = new NodeCache({stdTTL: 10000});
tasksCache.set("latestTasks", [])

const getLatestTasks = catchAsync(async (req, res, next) => {
  /*const ofs = req.params.id;

  let b = tasksCache.get("latestTasks")
  console.log(b.length)
  // res.send(latest)

  if (ofs < b.length) {
    console.log("Getting data from caching")
    res.send(b.splice(0,ofs))
  } else {
    const latest = await Task.getlatestTasks(req.params.id);
    console.log("Getting data from MONGODB")
    tasksCache.set("latestTasks", latest)
    res.send(latest)
    }
  }*/
  const id = req.params.id;
  
  let m = tasksCache.get("latestTasks");
  console.log(m)
  console.log(id)
  const latest = await Task.getlatestTasks(id);
  success = tasksCache.set("latestTasks", );
  console.log(success)
  // const tasks = await Task.getlatestTasks(id);
  // res.json(tasks)
  
  
  // if(!tasks) throw new ApiError(404,"no tasks found");
  //res.status(202).send(tasks);
  // res.json(tasks);
})

// xử lí current page > totalPages => trả về []
// count of tasks, users tối ưu thời gian
// cache data (tìm hiểu), memory (ping a hiếu)
const getTasksByScrolling = catchAsync(async(req, res, next) => {
  let page = parseInt(req.query.page)
  let sizePerPage = parseInt(req.query.size)
  const count = await TaskModel.count();

  const startIndex = (page - 1)*sizePerPage;

  const tasks = await TaskModel.find().skip(startIndex).limit(sizePerPage); 

  /*res.json({
    totalPages: Math.ceil(count / sizePerPage),
    currentPage: page,
    tasks
  })*/
  res.json(tasks);

})

// Will need to get current user id to create task
const createTask = catchAsync(async (req, res, next) => {
  const fields = req.body;
  const user = req.user._id;
  const newTask = await Task.createTask({...fields,createdBy: user});
  throwIfNull(newTask, "new task not found");
  res.status(200).send(newTask);
})

const createfakeTask = catchAsync(async(req,res,next) => {
  // console.log(req.params.id);
  await Task.createfakeTask(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
})

const getComments = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  throwIfNull(id, "no id found");
  const retrievedTask = await Task.getTask(id);
  throwIfNull(retrievedTask, "retrieved task not found");
  res.status(202).send(retrievedTask.comments);
})

const getTaskById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  throwIfNull(id, "no id found");
  const retrievedTask = await Task.getTask(id);
  throwIfNull(retrievedTask, "retrieved task not found");
  res.status(202).send(retrievedTask);
})

const deleteTask = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  throwIfNull(id, "no id found");
  const deletedTask = await Task.deleteTask(id);
  throwIfNull(deletedTask, "deleted task not found");
  res.status(202).send(deletedTask);
})

const updateTask = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  throwIfNull(id, "no id found");
  const field = req.body;
  const updatedTask = await Task.updateTask(id, field);
  throwIfNull(updatedTask, "new task not found");
  res.status(202).send(updatedTask);
})

const bidTask = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  throwIfNull(id, "no if found");
  const task = await Task.getTask(id);
  let bidBy = task.bidBy;
  bidBy.push({bidder: req.user._id, price: req.body.price });
  await task.save();
  res.status(202).send(task);
})

const getBid = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const retrievedTask = await Task.getTask(id);
  throwIfNull(retrievedTask, "retrieved task not found");
  res.status(202).send(retrievedTask.bidBy);
})

const commentOnTask = catchAsync(async(req,res,next) => {
  const comment = req.body.comment;
  const id = req.params.id;
  const user = req.user._id;
  const task = await Task.getTask(id);
  task.comments.push({author: user, content: comment});
  await task.save();
  res.status(202).send(task)
})

const uploadPhoto = catchAsync(async(req,res) => {
  const imageBuffer = req.file.buffer;
  const task = await Task.getTask(req.params.id);
  if(!task) throw new ApiError(404,"No task with given id found, please reupload")
  if (!imageBuffer) throw new ApiError(404,"No photos found, please reupload")
  if (!req.body.name) throw new ApiError(404,"No photos name found, please give your photo a name")
  const resizedImageStream = await s3.resizedImage(imageBuffer);
  const imageInfo = await s3.uploadImage(resizedImageStream,req.body.name);
  task.backgroundImage.push(imageInfo.Key);
  await task.save();
  res.send({ message: "Image uploaded", key:imageInfo.Key});
});

const getPhoto = catchAsync(async (req, res,next) => {
  const key = req.params.photoKey;
  const task = await Task.getTask(req.params.id);
  if(!task) throw new ApiError(404,"No task with given id found, please reupload")
  if (!key) throw new ApiError(404,"Image does not exist")
  const blob_image = await s3.getImage(key);
  blob_image.stream().pipe(res);
});


module.exports = {
  getTasks,
  createTask,
  createfakeTask,
  getTaskById,
  getTasksByPagination,
  getLatestTasks,
  getTasksByScrolling,
  deleteTask,
  updateTask,
  getBid,
  getComments,
  commentOnTask,
  bidTask,
  uploadPhoto,
  getPhoto
};

