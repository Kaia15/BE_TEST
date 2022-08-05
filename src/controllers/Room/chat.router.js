const express = require("express");
const authentication = require("../User/validations/authentication");
const router = express.Router();
const chatController = require("./chat.controller");


router.use(authentication.checkPassport);
router.route("/list").get(chatController.chatList);
router.route("/:id").get(chatController.chatInRoom);
router.route("/create").post(chatController.createChatRoom)








module.exports = router;