const apiRouter = require("express").Router();
const topicRouter = require("./topic-router");
const articleRouter = require("./article-router");

apiRouter.use("/topics", topicRouter);
apiRouter.use("/articles", articleRouter);

module.exports = apiRouter;
