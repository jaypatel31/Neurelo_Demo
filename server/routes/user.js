const express = require("express");
const { createUser, loginUser, getAllTask, createTask, updateTask, deleteTask } = require("../controller/user.js");
const { authenticationMiddleware } = require("../middlewares/auth.js");

const router = express.Router();

router.route("/dummyuser").get(createUser);

router.route("/login").post(loginUser);

router.route("/tasks").get(authenticationMiddleware, getAllTask);

router.route("/newtask").post(authenticationMiddleware, createTask);

router.route("/updatetask").put(authenticationMiddleware, updateTask);

router.route("/deletetask/:id").delete(authenticationMiddleware, deleteTask);

module.exports = router;