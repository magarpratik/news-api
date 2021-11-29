const db = require("../connection");
const format = require("pg-format");

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;

  return db
    .query(`DROP TABLE IF EXISTS comments`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles`).then(() => {
        return Promise.all([
          db.query(`DROP TABLE IF EXISTS users`),
          db.query(`DROP TABLE IF EXISTS topics`),
        ]);
      });
    })
    .then(() => {
      // 1. create tables
      return Promise.all([
        db.query(`
        CREATE TABLE topics (
          slug VARCHAR(255) PRIMARY KEY,
          description TEXT
        )`),
        db.query(`
        CREATE TABLE users (
          username VARCHAR(255) PRIMARY KEY,
          avatar_url TEXT,
          name VARCHAR(255)
        )`),
      ]);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        body TEXT,
        votes INT DEFAULT 0,
        topic VARCHAR(255) REFERENCES topics(slug),
        author VARCHAR(255) REFERENCES users(username),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        author VARCHAR(255) REFERENCES users(username),
        article_id INT REFERENCES articles(article_id),
        votes INT DEFAULT 0,
        body TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )`);
    })
    .then(() => {
      // 2. insert data
      const formattedTopics = format(
        `INSERT INTO topics
          (slug, description)
          VALUES
          %L`,
        topicData.map((topic) => [topic.slug, topic.description])
      );
      const formattedUsers = format(
        `INSERT INTO users
          (username, avatar_url, name)
          VALUES
          %L`,
        userData.map((user) => [user.username, user.avatar_url, user.name])
      );
      return Promise.all([db.query(formattedTopics), db.query(formattedUsers)]);
    })
    .then(() => {
      const formattedArticles = format(
        `INSERT INTO articles
          (title, body, votes, topic, author, created_at)
          VALUES
          %L`,
        articleData.map((article) => [
          article.title,
          article.body,
          article.votes,
          article.topic,
          article.author,
          article.created_at,
        ])
      );
      return db.query(formattedArticles);
    })
    .then(() => {
      const formattedComments = format(
        `INSERT INTO comments
          (author, article_id, votes, created_at, body)
          VALUES
          %L`,
        commentData.map((comment) => [
          comment.author,
          comment.article_id,
          comment.votes,
          comment.created_at,
          comment.body,
        ])
      );
      return db.query(formattedComments);
    });
};

module.exports = seed;
