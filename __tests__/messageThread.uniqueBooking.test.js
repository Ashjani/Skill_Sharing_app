const { expect } = require("chai");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const MessageThread = require("../models/messageThread");

describe("MessageThread unique booking index", function () {
  this.timeout(15000); // allow enough time for in-memory server

  let mongoServer;
  before(async () => {
    await mongoose.disconnect();
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  after(async () => {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
  });

  it("prevents creating two threads with the same booking id", async () => {
    const bookingId = new mongoose.Types.ObjectId();

    await MessageThread.create({
      booking: bookingId,
      participants: [],
      messages: [],
    });

    let err;
    try {
      await MessageThread.create({
        booking: bookingId,
        participants: [],
        messages: [],
      });
    } catch (e) {
      err = e;
    }

    expect(err).to.exist;
    expect((err && err.code) || 0).to.equal(11000); // duplicate key
  });
});
