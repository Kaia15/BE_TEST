const express = require("express");
const configControllers = require("./config.controller")
const router = express.Router();

router.route('/version').get(configControllers.getVersion);
router.route('/banner').get(configControllers.getBanner);



module.exports = router; 