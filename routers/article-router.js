const articleRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  patchArticleById,
  getArticleComments,
  postComment,
} = require("../controllers/articles.controller");

articleRouter.route("/").get(getArticles);
articleRouter.route("/:article_id").get(getArticleById).patch(patchArticleById);
articleRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postComment);

module.exports = articleRouter;
