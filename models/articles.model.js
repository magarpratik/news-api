const db = require("../db/connection");

exports.selectArticles = (sort_by = "created_at", order = "desc") => {
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
    return db
      .query(
        `SELECT
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
        ON articles.article_id = foo.article_id
        ORDER BY ${sort_by} ${order}`
      )
      .then(({ rows }) => {
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

exports.updateArticleById = (article_id, inc_votes) => {
  if (Number(article_id) < 1) {
    return Promise.reject({
      status: 400,
      msg: "Bad request",
    });
  }

  return db
    .query(
      `SELECT votes
      FROM articles
      WHERE article_id = $1`,
      [article_id]
    )
    .then(({ rows: [{ votes }] }) => {
      const newVotes = votes + inc_votes;

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
