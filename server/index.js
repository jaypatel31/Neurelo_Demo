const express = require("express");
require('dotenv').config();
require("express-async-errors");
const cors = require("cors");

const globalErrorHandler = require("./middlewares/errorMiddleware");
const router = require("./routes/main");


const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", router);

app.use(globalErrorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});