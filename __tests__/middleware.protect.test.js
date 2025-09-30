// __tests__/middleware.protect.test.js
const request = require("supertest");
const { app } = require("../server");
const { expect } = require("chai");

describe("authMiddleware.protect", () => {
  it("returns JSON 401 on API routes without token", async () => {
    const res = await request(app).get("/api/bookings");
    expect(res.status).to.equal(401);
    expect(res.type).to.match(/json/);
    expect(res.body.message).to.match(/not authorized/i);
  });

  it("returns JSON 401 on page routes without token (current behavior)", async () => {
    const res = await request(app).get("/bookings").set("Accept", "text/html");
    expect(res.status).to.equal(401);
    expect(res.type).to.match(/json/);
    expect(res.body.message).to.match(/not authorized/i);
  });
});
