const db = require("../db/connection");

exports.removeComment = (comment_id) => {
  if (Number(comment_id) < 1) {
    return Promise.reject({
      status: 400,
      msg: "Bad request",
    });
  }

  return db.query(
    `DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *`,
    [comment_id]
  );
};
