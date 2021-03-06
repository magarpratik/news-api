const request = require("supertest");
const app = require("../app");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("ERROR 404: path not found", () => {
  it("non-existent url path", () => {
    return request(app)
      .get("/api/invalid_path")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Path not found");
      });
  });
});

describe("GET /api/topics", () => {
  it("status 200: return an array of topic objects, each with properties: slug, description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(Array.isArray(topics)).toBe(true);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
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

  it("status 404: article not found", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article 9999 not found");
      });
  });

  it("status 400: handle invalid data type (String)", () => {
    return request(app)
      .get("/api/articles/invalid_id")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  it("status 400: handle invalid data type (Float)", () => {
    return request(app)
      .get("/api/articles/2.5")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  it("status 400: handle invalid input (negative numbers)", () => {
    return request(app)
      .get("/api/articles/-1")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  it("status 200: update the specified article and return it", () => {
    // act
    const newVote = { inc_votes: 10 };
    // arrange
    // assert
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: expect.any(String),
          votes: 110,
        });
      });
  });

  it("status 200: handle missing inc_votes", () => {
    const newVote = { test: "test" };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
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
        });
      });
  });

  it("status 400: handle invalid data type (String)", () => {
    const newVote = { inc_votes: "invalid_value" };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  it("status 400: handle invalid data type (Float)", () => {
    const newVote = { inc_votes: 5.5 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  it("status 400: handle invalid data type (negative numbers)", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/-1")
      .send(newVote)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  it("status 400: other property present on request body", () => {
    const newVote = {
      inc_votes: 1,
      extra_property: "extra value",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  it("status 404: article not found", () => {
    const newVote = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/999")
      .send(newVote)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article 999 not found");
      });
  });
});

describe("GET /api/articles", () => {
  it("status 200: return a sorted array (by date in descending order) of article objects with the appropriate properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toHaveLength(12);
        expect(articles).toBeSorted({ key: "created_at", descending: true });
        articles.forEach((article) => {
          expect(article).toEqual({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });

  it("status 200: accept valid sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSorted({ key: "title", descending: true });
      });
  });

  it("status 200: accept valid order query", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSorted({ key: "created_at" });
      });
  });

  it("status 200: accept valid topic query", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(1);
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });

  it("status 400: handle invalid sort_by query (non-existent column)", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid_query")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  it("status 400: handle invalid (non-existent) order query", () => {
    return request(app)
      .get("/api/articles?order=invalid_query")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  it("status 404: handle invalid (non-existent) topic query", () => {
    return request(app)
      .get("/api/articles?topic=invalid_query")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });

  it("status 200: handle topic query that does not have any articles associated with it", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toEqual([]);
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  it("status 200: return an array of comment objects for the given article, each with appropriate properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(Array.isArray(comments)).toBe(true);
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment).toEqual({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          });
        });
      });
  });

  it("status 400: handle invalid data type (String)", () => {
    return request(app)
      .get("/api/articles/invalid_id/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  it("status 400: handle invalid data type (Float)", () => {
    return request(app)
      .get("/api/articles/5.5/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  it("status 400: handle invalid input (negative numbers)", () => {
    return request(app)
      .get("/api/articles/-1/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  it("status 404: article not found", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article 999 not found");
      });
  });

  it("status 200: handle article_id that has no comments", () => {
    return request(app)
      .get("/api/articles/11/comments")
      .expect(200)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article 11 has no comments");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  it("status 201: post a new comment in the table", () => {
    const newComment = {
      username: "lurker",
      body: "test comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(() => {
        return db
          .query(
            `SELECT * FROM comments
            WHERE comment_id = 19`
          )
          .then(({ rows }) => {
            expect(rows[0]).toEqual({
              comment_id: 19,
              author: "lurker",
              article_id: 1,
              votes: 0,
              created_at: expect.any(Date),
              body: "test comment",
            });
          });
      });
  });

  it("status 201: respond with the newly posted comment", () => {
    const newComment = {
      username: "lurker",
      body: "test comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual({
          comment_id: 19,
          author: "lurker",
          article_id: 1,
          votes: 0,
          created_at: expect.any(String),
          body: "test comment",
        });
      });
  });

  it("status 400: handle invalid data type for article_id (String)", () => {
    const newComment = {
      username: "lurker",
      body: "test comment",
    };

    return request(app)
      .post("/api/articles/invalid_id/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  it("status 400: handle invalid data type for article_id (Float)", () => {
    const newComment = {
      username: "lurker",
      body: "test comment",
    };

    return request(app)
      .post("/api/articles/5.5/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  it("status 400: handle invalid input for article_id (negative numbers)", () => {
    const newComment = {
      username: "lurker",
      body: "test comment",
    };

    return request(app)
      .post("/api/articles/-1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  it("status 404: handle invalid input (non-existent article_id)", () => {
    const newComment = {
      username: "lurker",
      body: "test comment",
    };

    return request(app)
      .post("/api/articles/999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });

  it("status 400: handle missing required field", () => {
    const newComment = {
      username: "lurker",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  it("status 400: handle extra properties in the request body", () => {
    const newComment = {
      username: "lurker",
      body: "test comment",
      extra: "extra property",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  it("status 404: username in request body does not exist", () => {
    const newComment = {
      username: "invalid_username",
      body: "test comment",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  it("status 204: deletes the specified comment", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {
        return db
          .query(
            `SELECT comment_id
            FROM comments
            WHERE comment_id = 1`
          )
          .then(({ rows }) => {
            expect(rows).toEqual([]);
          });
      });
  });

  it("status 400: handle invalid data type (String)", () => {
    return request(app)
      .delete("/api/comments/invalid_id")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  it("status 400: handle invalid data type (Float)", () => {
    return request(app)
      .delete("/api/comments/5.5")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  it("status 400: handle invalid input (negative numbers)", () => {
    return request(app)
      .delete("/api/comments/-1")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  it("status 404: handle invalid input (non-existent comment_id)", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
});

describe("GET /api/users", () => {
  it("status 200: return an array of users, each with the property: username", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(Array.isArray(users)).toBe(true);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual({
            username: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/users/:username", () => {
  it("status 200: return the given user object", () => {
    return request(app)
      .get("/api/users/lurker")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toEqual({
          username: "lurker",
          name: "do_nothing",
          avatar_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        });
      });
  });

  it("status 404: return the given user object", () => {
    return request(app)
      .get("/api/users/invalid_username")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  // status 200: update the given comment_vote

  it("status 200: update the specified articled and return it", () => {
    const newVote = {
      inc_votes: 1,
    };

    return request(app)
      .patch("/api/comments/1")
      .send(newVote)
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual({
          comment_id: 1,
          author: "butter_bridge",
          article_id: 9,
          votes: 17,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          created_at: expect.any(String),
        });
      });
  });

  it("status 400: handle invalid data type (String)", () => {
    const newVote = { inc_votes: "invalid_value" };
    return request(app)
      .patch("/api/comments/1")
      .send(newVote)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  it("status 400: handle invalid data type (Float)", () => {
    const newVote = { inc_votes: 5.5 };
    return request(app)
      .patch("/api/comments/1")
      .send(newVote)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  it("status 400: handle invalid data type (negative numbers)", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/-1")
      .send(newVote)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  it("status 200: handle missing inc_votes", () => {
    const newVote = { test: "test" };
    return request(app)
      .patch("/api/comments/1")
      .send(newVote)
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual({
          comment_id: 1,
          author: "butter_bridge",
          article_id: 9,
          votes: 16,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          created_at: expect.any(String),
        });
      });
  });

  it("status 400: handle other properties present on request body", () => {
    const newVote = {
      inc_votes: 1,
      extra_property: "extra value",
    };
    return request(app)
      .patch("/api/comments/1")
      .send(newVote)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  
  it("status 404: comment not found", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/999")
      .send(newVote)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
});
