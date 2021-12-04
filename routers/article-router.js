const articleRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  patchArticle,
  getArticleComments,
  postComment,
} = require("../controllers/articles.controller");

articleRouter.route("/").get(getArticles);
articleRouter.route("/:article_id").get(getArticleById).patch(patchArticle);
articleRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postComment);

module.exports = articleRouter;
