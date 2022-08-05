const express = require("express");
const authentication = require("./validations/authentication");
const fake_userController = require("./fake_user.controller");
const s3 = require("../../s3");
const router = express.Router();

// router.route("/signUp").post(authentication.signUp);

// router.route("/login").post(authentication.logIn);

// router.use(authentication.checkPassport);

// router.route("/signUp").post();

router.route("/list").get(fake_userController.getUsers);
router.route("/list/:id").get(fake_userController.getUsersByPagination);
router.route("/latest/:id").get(fake_userController.getLatestUsers);
router.route("/scroll/").get(fake_userController.getUsersByScrolling);

router.route("/create/:id").post(fake_userController.createfakeUser);

router
  .route("/:userId")
  .get(fake_userController.getUser)
  .delete(fake_userController.deleteUser);

router.route("/:userId/edit").patch(fake_userController.updateUser);
router.route("/:userId/review").get(fake_userController.getReviews);


router.use(s3.upload.single("photo"));

router.route("/:userId/uploadPhoto").post(fake_userController.uploadPhoto);
router.route("/:userId/getPhoto/").get(fake_userController.getPhoto);

module.exports = router;
