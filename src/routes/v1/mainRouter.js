const express = require('express');

//const authRoute = require('../../controllers/Auth/auth.route');
const userRoute = require('../../controllers/User/user.route');
const taskRoute = require('../../controllers/Task/task.router');
const fake_userRoute = require('../../controllers/User/fake_user.route');
const fake_taskRoute = require('../../controllers/Task/fake_task.route');
const configRoute = require('../../controllers/Config/config.router');
const chatRoute = require('../../controllers/Room/chat.router')
const router = express.Router();

//router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/tasks', taskRoute);
router.use('/config',configRoute);
router.use('/chats',chatRoute);

// fake routes
router.use('/fake_users', fake_userRoute);
router.use('/fake_tasks', fake_taskRoute);

module.exports = router;


