const { updateComment, removeComment } = require("../models/comments.model");

exports.patchComment = (req, res, next) => {
  const {
    body: { inc_votes },
  } = req;

  const { comment_id } = req.params;

  updateComment(comment_id, inc_votes).then((comment) => {
    res.status(200).send({ comment });
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
