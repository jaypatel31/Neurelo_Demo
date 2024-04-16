const express = require("express");

const userRoute = require("./user.js");
const categoryRoute = require("./category.js");

const app = express();

// Needed to Be Changed

//User Route
app.use("/users", userRoute);

//Category Route
app.use("/category", categoryRoute);

module.exports = app;
