const { removeComment } = require("../models/comments.model");

exports.deleteComment = (req, res, next) => {
  // handle request
  const { comment_id } = req.params;
  // invoke model
  removeComment(comment_id).then(() => {
    // send response
    res.status(204).send();
  });
};
