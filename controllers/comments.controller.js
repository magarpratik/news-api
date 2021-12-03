const { removeComment } = require("../models/comments.model");

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  
  removeComment(comment_id)
    .then(({ rows }) => {
      if (rows[0]) res.status(204).send();
      res.status(400).send({ msg: "Bad request" });
    })
    .catch((err) => {
      next(err);
    });
};
