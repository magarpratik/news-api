const { selectArticleById } = require("../models/articles.model");

exports.getArticleById = (req, res) => {
  // handle request
  const { article_id } = req.params;

  // invoke model
  selectArticleById(article_id).then((article) => {
    // send response
    res.status(200).send({ article });
  });
};
