const db = require("../db/connection");

exports.updateComment = (comment_id, inc_votes) => {
  if (Number(comment_id) < 1) {
    return Promise.reject({
      status: 400,
      msg: "Bad request",
    });
  }

  if (!inc_votes) {
    return db
      .query(
        `SELECT * FROM comments
        WHERE comment_id = $1`,
        [comment_id]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  }

  return db
    .query(
      `SELECT votes
      FROM comments
      WHERE comment_id = $1`,
      [comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Not found`,
        });
      }

      const newVotes = rows[0].votes + inc_votes;

      return db.query(
        `UPDATE comments
        SET votes = $1
        WHERE comment_id = $2
        RETURNING *`,
        [newVotes, comment_id]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

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
