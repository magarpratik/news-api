const { removeComment } = require("../models/comments.model");

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
