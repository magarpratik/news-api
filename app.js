const express = require("express");
const app = express();
app.use(express.json());

const cors = require("cors");

const whitelist = ["https://northnews.netlify.app"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

const {
  handlePathErrors,
  handlePsql400Errors,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors/errors");

const apiRouter = require("./routers/api-router");

// handle requests
app.use("/api", apiRouter);
app.use("/ping", (req, res) => res.send("pong"));
app.use("/", (req, res) => {
  res.send({ msg: "Welcome to North News!" });
});

// handle path errors
app.all("/*", handlePathErrors);

// Error handlers
app.use(handlePsql400Errors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
