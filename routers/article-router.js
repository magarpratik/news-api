const articleRouter = require("express").Router();
const { getArticleById } = require("../controllers/articles.controller");

articleRouter.route("/:article_id").get(getArticleById);

module.exports = articleRouter;
