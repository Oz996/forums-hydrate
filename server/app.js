const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/users", require("./controllers/userController"));
app.use("/posts", require("./controllers/blogController"))

module.exports = app;
