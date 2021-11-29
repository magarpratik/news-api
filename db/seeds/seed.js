const db = require("../connection");

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;

  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles;`).then(() => {
        return Promise.all([
          db.query(`DROP TABLE IF EXISTS users`),
          db.query(`DROP TABLE IF EXISTS topics`),
        ]);
      });
    })
    .then(() => {
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
      db.query(`
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
      db.query(`
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        author VARCHAR(255) REFERENCES users(username),
        article_id INT REFERENCES articles(article_id),
        votes INT DEFAULT 0,
        body TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )`);
    });

  // 2. insert data
};

module.exports = seed;
