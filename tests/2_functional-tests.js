/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  suite("API ROUTING FOR /api/threads/:board", function() {
    test("POST", function(done) {
      chai
        .request(server)
        .post("/api/threads/apiTest/")
        .send({ text: "apiTest", delete_password: "apiTest" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.redirects[0], res.request.url);
          done();
        });
    });

    test("GET", function(done) {
      chai
        .request(server)
        .get("/api/threads/apiTest/")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isAbove(res.body.length, 0);
          assert.isObject(res.body[0]);
          assert.equal(res.body[0].board, "apitest");
          done();
        });
    });

    test("DELETE", function(done) {
      chai
        .request(server)
        .get("/api/threads/apiTest/")
        .end((err, res) => {
          const threadId = res.body[0]._id;
          const pass = "apiTest";

          chai
            .request(server)
            .delete("/api/threads/apiTest/")
            .send({ thread_id: threadId, delete_password: pass })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.res.body, "success");
              done();
            });
        });
    });

    test("PUT", function(done) {
      chai
        .request(server)
        .post("/api/threads/apiTest/")
        .send({ text: "apiTest", delete_password: "apiTest" })
        .end((err, res) => {
          chai
            .request(server)
            .get("/api/threads/apiTest/")
            .end((err, res) => {
              const threadId = res.body[0]._id;

              chai
                .request(server)
                .put("/api/threads/apiTest/")
                .send({ report_id: threadId })
                .end((err, res) => {
                  assert.equal(res.status, 200);
                  assert.equal(res.res.body, "reported");
                  done();
                });
            });
        });
    });
  });

  suite("API ROUTING FOR /api/replies/:board", function() {
    test("POST", function(done) {
      chai
        .request(server)
        .get("/api/threads/apiTest/")
        .end((err, res) => {
          const threadId = res.body[0]._id;

          chai
            .request(server)
            .post("/api/replies/apiTest/")
            .send({
              thread_id: threadId,
              text: "reply apiTest",
              delete_password: "replyApiTest"
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert(res.redirects[0], res.request.url);
              done();
            });
        });
    });

    test("GET", function(done) {
      chai
        .request(server)
        .get("/api/threads/apiTest/")
        .end((err, res) => {
          const threadId = res.body[0]._id;

          chai
            .request(server)
            .get(`/api/replies/apiTest/?thread_id=${threadId}`)
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body);
              assert.equal(res.body._id, threadId);
              assert.isAbove(res.body.replies.length, 0);
              done();
            });
        });
    });

    test("PUT", function(done) {
      chai
        .request(server)
        .get("/api/threads/apiTest/")
        .end((err, res) => {
          const threadId = res.body[0]._id;

          chai
            .request(server)
            .get(`/api/replies/apiTest/?thread_id=${threadId}`)
            .end((err, res) => {
              const replyId = res.body.replies[0]._id;

              chai
                .request(server)
                .put("/api/replies/apiTest/")
                .send(replyId)
                .end((err, res) => {
                  assert.equal(res.status, 200);
                  assert.equal(res.body, "reported");
                  done();
                });
            });
        });
    });

    test("DELETE", function(done) {
      chai
        .request(server)
        .get("/api/threads/apiTest/")
        .end((err, res) => {
          const threadId = res.body[0]._id;

          chai
            .request(server)
            .get(`/api/replies/apiTest/?thread_id=${threadId}`)
            .end((err, res) => {
              const replyId = res.body.replies[0]._id;
            
              chai
                .request(server)
                .delete("/api/replies/apiTest/")
                .send({
                  thread_id: threadId,
                  reply_id: replyId,
                  delete_password: "apiReplyTest"
                })
                .end((err, res) => {
                  console.log(res);
                  assert.equal(res.status, 200);
                  done();
                });
            });
        });
    });
  });
});
