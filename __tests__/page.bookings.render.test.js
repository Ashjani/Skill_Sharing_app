// test/page.bookings.render.test.js
const request = require("supertest");
const sinon = require("sinon");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { app } = require("../server");
const User = require("../models/user");
const Service = require("../models/service");
const Booking = require("../models/booking");
const { expect } = require("chai");

describe("GET /bookings page", () => {
  const meId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    sinon.stub(jwt, "verify").returns({ id: meId.toString() });
    sinon
      .stub(User, "findById")
      .returns({ select: sinon.stub().resolves({ _id: meId }) });
    sinon
      .stub(Service, "find")
      .returns({ select: sinon.stub().returns(Promise.resolve([])) });
    sinon.stub(Booking, "find").returns({
      populate: sinon.stub().returnsThis(),
      sort: sinon.stub().returns(Promise.resolve([])),
    });
  });

  afterEach(() => sinon.restore());

  it("renders the bookings page with 200 when authenticated", async () => {
    const res = await request(app)
      .get("/bookings")
      .set("Authorization", "Bearer test")
      .set("Accept", "text/html");

    expect(res.status).to.equal(200);
    expect(res.type).to.match(/html/);
    expect(res.text).to.include("Bookings");
  });
});
