const request = require("supertest");
const app = require("../app");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  it("status 200: return an array of topic objects, each with properties: slug, description", () => {
    // act
    // arrange
    // assert
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });

  it("status 404: path not found for misspelled path", () => {
    return request(app)
      .get("/api/invalid_path")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Path not found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  it("status 200: return the specified article object with the appropriate properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: expect.any(String),
          votes: 100,
          comment_count: 11,
        });
      });
  });

  it("status 400: article does not exist in the database", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Article 9999 does not exist");
      });
  });

  it("status 400: handle invalid data type (String) for article_id", () => {
    return request(app)
      .get("/api/articles/invalid_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid_id is an invalid article ID");
      });
  });

  it("status 400: handle invalid data type (Float) for article_id", () => {
    return request(app)
      .get("/api/articles/2.5")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("2.5 is an invalid article ID");
      });
  });

  it("status 400: handle invalid data type (negative numbers) for article_id", () => {
    return request(app)
      .get("/api/articles/-1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("-1 is an invalid article ID");
      });
  });
});
