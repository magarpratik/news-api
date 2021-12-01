const articleRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  patchArticleById,
} = require("../controllers/articles.controller");

articleRouter.route("/").get(getArticles);
articleRouter.route("/:article_id").get(getArticleById).patch(patchArticleById);

module.exports = articleRouter;
