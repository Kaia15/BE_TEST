const express = require("express");
// const authentication = require("../User/validations/authentication");
const router = express.Router();
const fake_taskControllers = require("./fake_task.controller");
const s3 = require("../../s3");

// router.use(authentication.checkPassport);
router.route("/").get(fake_taskControllers.getTasks);
router.route("/list/:id").get(fake_taskControllers.getTasksByPagination);
router.route("/latest/:id").get(fake_taskControllers.getLatestTasks);
router.route("/scroll/").get(fake_taskControllers.getTasksByScrolling);
router.route("/create").post(fake_taskControllers.createTask);
router.route("/create/:id").post(fake_taskControllers.createfakeTask);

router
  .route("/:id")
  .get(fake_taskControllers.getTaskById)
  .delete(fake_taskControllers.deleteTask)
  .patch(fake_taskControllers.updateTask);

router
  .route("/:id/comment")
  .get(fake_taskControllers.getComments)
  .patch(fake_taskControllers.commentOnTask);

router
  .route("/:id/bid")
  .get(fake_taskControllers.getBid)
  .post(fake_taskControllers.bidTask);

router.use(s3.upload.single("photo"));
router.route("/:id/uploadPhoto").post(fake_taskControllers.uploadPhoto)
router.route("/:id/getPhoto/:photoKey").get(fake_taskControllers.getPhoto)

module.exports = router;
