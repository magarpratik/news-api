const db = require("../db/connection");

exports.selectUsers = () => {
  return db
    .query(
      `SELECT username
        FROM users`
    )
    .then(({ rows }) => {
      return rows;
    });
};
