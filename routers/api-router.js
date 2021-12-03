const apiRouter = require("express").Router();
const topicRouter = require("./topic-router");
const articleRouter = require("./article-router");
const commentRouter = require("./comment-router");
const endpoints = require("../endpoints.json");
const { handlePathErrors } = require("../errors/errors");

apiRouter.use("/topics", topicRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentRouter);

apiRouter.route("/").get((req, res) => {
  res.status(200).send(endpoints);
});

apiRouter.all("/*", handlePathErrors);

module.exports = apiRouter;
