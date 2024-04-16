const express = require("express");
const { authenticationMiddleware } = require("../middlewares/auth.js");
const { createCategory, getAllCategory } = require("../controller/category.js");

const router = express.Router();

router.route("/new").post(authenticationMiddleware, createCategory);

router.route("/all").get(authenticationMiddleware, getAllCategory);

module.exports = router;