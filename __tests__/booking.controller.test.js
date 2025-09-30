const request = require('supertest');
const sinon = require('sinon');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { expect } = require('chai');

const { app, server } = require('../server');
const User = require('../models/user');
const Service = require('../models/service');
const Booking = require('../models/booking');
const MessageThread = require('../models/messageThread');

// helper: matches your controller's single .populate("a b c") usage
function populateResolves(doc) {
  return {
    populate: () => Promise.resolve(doc), // await Booking.findById(...).populate("x y")
  };
}

describe('Booking API', () => {
  const meId = new mongoose.Types.ObjectId();
  const otherId = new mongoose.Types.ObjectId();
  const bookingId = new mongoose.Types.ObjectId();
  const serviceId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    // protect(): jwt + user lookup
    sinon.stub(jwt, 'verify').returns({ id: meId.toString() });
    sinon.stub(User, 'findById').returns({
      select: sinon.stub().resolves({ _id: meId, credits: 999, role: 'Member' }),
    });
  });

  afterEach(() => sinon.restore());

  after(async () => {
    await new Promise((r) => server.close(r));
    await mongoose.disconnect();
  });

  describe('POST /api/bookings/request/:serviceId', () => {
    it('creates a booking when requester != provider and credits OK', async () => {
      sinon.stub(Service, 'findById').resolves({ _id: serviceId, user: otherId, credits: 5 });
      sinon.stub(Booking, 'create').resolves({ _id: bookingId, status: 'Pending' });

      const res = await request(app)
        .post(`/api/bookings/request/${serviceId}`)
        .set('Authorization', 'Bearer test');

      expect(res.status).to.equal(201);
      expect(res.body.message).to.match(/success/i);
    });

    it('rejects when trying to book your own service', async () => {
      sinon.stub(Service, 'findById').resolves({ _id: serviceId, user: meId });

      const res = await request(app)
        .post(`/api/bookings/request/${serviceId}`)
        .set('Authorization', 'Bearer test');

      expect(res.status).to.equal(400);
      expect(res.body.message).to.match(/cannot book your own/i);
    });

    it('rejects when credits are insufficient', async () => {
      sinon.restore();
      sinon.stub(jwt, 'verify').returns({ id: meId.toString() });
      sinon.stub(User, 'findById').returns({
        select: sinon.stub().resolves({ _id: meId, credits: 1, role: 'Member' }),
      });
      sinon.stub(Service, 'findById').resolves({ _id: serviceId, user: otherId, credits: 5 });

      const res = await request(app)
        .post(`/api/bookings/request/${serviceId}`)
        .set('Authorization', 'Bearer test');

      expect(res.status).to.equal(400);
      expect(res.body.message).to.match(/enough credits/i);
    });
  });

  describe('POST /api/bookings/:id/accept', () => {
    it('allows provider to accept and seeds thread', async () => {
      const bookingDoc = {
        _id: bookingId,
        status: 'Pending',
        requester: { _id: otherId, credits: 10, save: sinon.stub().resolves() },
        provider: { _id: meId },
        service: { _id: serviceId, title: 'Web design', credits: 2 },
        save: sinon.stub().resolves(),
      };
      sinon.stub(Booking, 'findById').returns(populateResolves(bookingDoc));
      const mtFU = sinon.stub(MessageThread, 'findOneAndUpdate').resolves({ _id: new mongoose.Types.ObjectId() });

      const res = await request(app)
        .post(`/api/bookings/${bookingId}/accept`)
        .set('Authorization', 'Bearer test');

      expect(res.status).to.equal(200);
      expect(res.body.message).to.match(/accepted/i);
      expect(mtFU.calledOnce).to.be.true;
    });

    it('forbids non-provider', async () => {
      const bookingDoc = {
        _id: bookingId,
        requester: { _id: otherId },
        provider: { _id: otherId }, // not me
        service: { _id: serviceId, title: 'X' },
      };
      sinon.stub(Booking, 'findById').returns(populateResolves(bookingDoc));

      const res = await request(app)
        .post(`/api/bookings/${bookingId}/accept`)
        .set('Authorization', 'Bearer test');

      expect(res.status).to.equal(403);
      expect(res.body.message).to.match(/forbidden/i);
    });
  });

  describe('POST /api/bookings/:id/decline', () => {
    it('allows provider to decline', async () => {
      const save = sinon.stub().resolves();
      const bookingDoc = { _id: bookingId, provider: { _id: meId }, status: 'Pending', save };
      // your decline path does ".populate('provider')" only (also a single call)
      sinon.stub(Booking, 'findById').returns({ populate: () => Promise.resolve(bookingDoc) });

      const res = await request(app)
        .post(`/api/bookings/${bookingId}/decline`)
        .set('Authorization', 'Bearer test');

      expect(res.status).to.equal(200);
      expect(res.body.message).to.match(/declined/i);
      expect(save.calledOnce).to.be.true;
    });
  });

  describe('POST /api/bookings/:id/message', () => {
    it('upserts thread by booking and appends message', async () => {
      const bookingDoc = { _id: bookingId, requester: { _id: otherId }, provider: { _id: meId } };
      // controller does one call: .populate("requester provider")
      sinon.stub(Booking, 'findById').returns(populateResolves(bookingDoc));

      const mtFU = sinon.stub(MessageThread, 'findOneAndUpdate').resolves({ _id: new mongoose.Types.ObjectId() });

      const res = await request(app)
        .post(`/api/bookings/${bookingId}/message`)
        .set('Authorization', 'Bearer test')
        .send({ text: 'hello' });

      expect(res.status).to.equal(201);
      expect(res.body.message).to.match(/sent/i);
      expect(mtFU.calledOnce).to.be.true;
    });
  });
});
