const express = require("express");
const app = express();
app.use(express.json());

const apiRouter = require("./routers/api-router");

const { handlePathErrors } = require("./errors/errors");

// handle requests
app.use("/api", apiRouter);

// handle errors
app.all("/*", handlePathErrors);

module.exports = app;
