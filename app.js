const express = require("express");
const app = express();
app.use(express.json());

const apiRouter = require("./routers/api-router");

const {
  handlePathErrors,
  handlePsql400Errors,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors/errors");

// handle requests
app.use("/api", apiRouter);
app.use("/", (req, res) => {
  res.status(200).send({ msg: "Welcome to North News!" });
});

// handle path errors
app.all("/*", handlePathErrors);

// Error handlers
app.use(handlePsql400Errors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
