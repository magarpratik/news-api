const apiRouter = require("express").Router();
const topicRouter = require("./topic-router");
const articleRouter = require("./article-router");
const commentRouter = require("./comment-router");

apiRouter.use("/topics", topicRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentRouter);

module.exports = apiRouter;
