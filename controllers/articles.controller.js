const {
  selectArticleById,
  updateArticleById,
} = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
  // handle request
  const { article_id } = req.params;

  // invoke model
  selectArticleById(article_id)
    .then((article) => {
      // send response
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  // handle request
  const {
    body: { inc_votes },
  } = req;

  if (Object.keys(req.body).length > 1) {
    res.status(400).send({ msg: "Bad request" });
  }

  const { article_id } = req.params;

  // invoke model
  updateArticleById(article_id, inc_votes)
    .then((article) => {
      // send response
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
