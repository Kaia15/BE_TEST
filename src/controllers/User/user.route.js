const express = require("express");
const authentication = require("../User/validations/authentication");
const userController = require("./user.controller");
const s3 = require("../../s3");
const router = express.Router();

router.route("/signUp").post(authentication.signUp);

router.route("/login").post(authentication.logIn);

router.use(authentication.checkPassport);

// router.route("/signUp").post();

router.route("/list").get(userController.getUsers);

router
  .route("/:userId")
  .get(userController.getUser)
  .delete(userController.deleteUser);

router.route("/:userId/edit").patch(userController.updateUser);
router.route("/:userId/review").get(userController.getReviews);


router.use(s3.upload.single("photo"));

router.route("/:userId/uploadPhoto").post(userController.uploadPhoto);
router.route("/:userId/getPhoto/").get(userController.getPhoto);

module.exports = router;
