const express = require("express");
const authentication = require("../User/validations/authentication");
const router = express.Router();
const taskControllers = require("./task.controller");
const s3 = require("../../s3");

router.use(authentication.checkPassport);
router.route("/").get(taskControllers.getTasks);
router.route("/create").post(taskControllers.createTask);
router.route("/create/:id").post(taskControllers.createfakeTask);

router
  .route("/:id")
  .get(taskControllers.getTaskById)
  .delete(taskControllers.deleteTask)
  .patch(taskControllers.updateTask);

router
  .route("/:id/comment")
  .get(taskControllers.getComments)
  .patch(taskControllers.commentOnTask);

router
  .route("/:id/bid")
  .get(taskControllers.getBid)
  .post(taskControllers.bidTask);

router.use(s3.upload.single("photo"));
router.route("/:id/uploadPhoto").post(taskControllers.uploadPhoto)
router.route("/:id/getPhoto/:photoKey").get(taskControllers.getPhoto)

module.exports = router;
