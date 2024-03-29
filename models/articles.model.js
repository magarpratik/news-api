const db = require("../db/connection");

exports.selectArticles = (sort_by = "created_at", order = "desc", topic) => {
  if (
    [
      "author",
      "title",
      "article_id",
      "topic",
      "created_at",
      "votes",
      "comment_count",
    ].includes(`${sort_by}`) &&
    ["asc", "desc"].includes(`${order}`)
  ) {
    let queryStr = `SELECT
        author, title, articles.article_id, topic,
        created_at, votes,
        count as comment_count
        FROM articles
        LEFT JOIN (
          SELECT articles.article_id AS article_id, count(comment_id)
          FROM articles
          JOIN comments
          ON articles.article_id = comments.article_id
          GROUP BY articles.article_id
          ) as foo
        ON articles.article_id = foo.article_id`;

    if (["cooking", "football", "coding"].includes(`${topic}`)) {
      queryStr += ` WHERE topic = '${topic}'`;
    } else if (topic) {
      return Promise.reject({
        status: 404,
        msg: "Not found",
      });
    }

    queryStr += ` ORDER BY ${sort_by} ${order}`;

    return db.query(queryStr).then(({ rows }) => {
      // change null value to 0
      rows.forEach((row) => {
        if (row.comment_count === null) row.comment_count = 0;
        else {
          // change String to int
          row.comment_count = parseInt(row.comment_count);
        }
      });

      return rows;
    });
  } else {
    return Promise.reject({
      status: 400,
      msg: "Bad request",
    });
  }
};

exports.selectArticleById = (article_id) => {
  // handle invalid inputs such as String, Float and negative numbers
  if (Number(article_id) < 1) {
    return Promise.reject({
      status: 400,
      msg: "Bad request",
    });
  }

  return Promise.all([
    db.query(
      `SELECT * FROM articles
      WHERE article_id = $1`,
      [article_id]
    ),
    db.query(
      `SELECT count
      FROM (
        SELECT articles.article_id AS article_id, count(comment_id)
        FROM articles
        JOIN comments
        ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
      ) AS foo
      WHERE article_id = $1`,
      [article_id]
    ),
  ]).then(([article, comment_count]) => {
    if (article.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `Article ${article_id} not found`,
      });
    }

    // add comment_count key-value pair to the article object
    article.rows[0].comment_count = parseInt(comment_count.rows[0].count);

    return article.rows[0];
  });
};

exports.updateArticle = (article_id, inc_votes) => {
  // reject negative article_id
  if (Number(article_id) < 1) {
    return Promise.reject({
      status: 400,
      msg: "Bad request",
    });
  }

  if (!inc_votes) {
    return db
      .query(
        `SELECT * FROM articles
        WHERE article_id = $1`,
        [article_id]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  }

  return db
    .query(
      `SELECT votes
      FROM articles
      WHERE article_id = $1`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Article ${article_id} not found`,
        });
      }

      const newVotes = rows[0].votes + inc_votes;

      return db.query(
        `UPDATE articles
        SET votes = $1
        WHERE article_id = $2
        RETURNING *`,
        [newVotes, article_id]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.selectArticleComments = (article_id) => {
  if (Number(article_id) < 1) {
    return Promise.reject({
      status: 400,
      msg: "Bad request",
    });
  }

  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body 
      FROM comments
      WHERE article_id = $1`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return db
          .query(
            `SELECT article_id
            FROM articles
            WHERE article_id = ${article_id}`
          )
          .then(({ rows }) => {
            if (rows.length === 0) {
              return Promise.reject({
                status: 404,
                msg: `Article ${article_id} not found`,
              });
            }
            return Promise.reject({
              status: 200,
              msg: `Article ${article_id} has no comments`,
            });
          });
      }

      return rows;
    });
};

exports.insertComment = (article_id, username, body) => {
  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: "Bad request",
    });
  }

  if (Number(article_id) < 1) {
    return Promise.reject({
      status: 400,
      msg: "Bad request",
    });
  }

  return db
    .query(
      `SELECT username FROM users
      WHERE username = $1`,
      [username]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not found",
        });
      }
    })
    .then(() => {
      return db
        .query(
          `SELECT article_id
          FROM articles
          WHERE article_id = $1`,
          [article_id]
        )
        .then(({ rows }) => {
          if (rows.length === 0) {
            return Promise.reject({
              status: 404,
              msg: "Not found",
            });
          }
        })
        .then(() => {
          return db
            .query(
              `INSERT INTO comments
              (article_id, author, body)
              VALUES
              ($1, $2, $3)
              RETURNING *`,
              [article_id, username, body]
            )
            .then(({ rows }) => {
              return rows[0];
            });
        });
    });
};
