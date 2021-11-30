const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");

exports.selectArticleById = (article_id) => {
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
    // add comment_count key-value pair to the article object    
    article.rows[0].comment_count = parseInt(comment_count.rows[0].count);

    return article.rows[0];
  });
};
