const { updateComment, removeComment } = require("../models/comments.model");

exports.patchComment = (req, res, next) => {
  const {
    body: { inc_votes },
  } = req;

  if (Object.keys(req.body).length > 1) {
    res.status(400).send({ msg: "Bad request" });
  }

  const { comment_id } = req.params;

  updateComment(comment_id, inc_votes)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  removeComment(comment_id)
    .then(({ rows }) => {
      if (rows[0]) res.status(204).send();
      res.status(404).send({ msg: "Not found" });
    })
    .catch((err) => {
      next(err);
    });
};
