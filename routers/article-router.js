const articleRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById,
} = require("../controllers/articles.controller");

articleRouter.route("/:article_id").get(getArticleById).patch(patchArticleById);

module.exports = articleRouter;
