// controllers/serviceController.js
const Service = require("../models/service");

exports.createService = async (req, res) => {
  try {
    const service = new Service({
      ...req.body,
      user:  "68cf99d0f4f1e709bb21158c" // fortesting // req.user.id // back to logged-in user
    });

    await service.save();
    res.redirect('/services/my-services');
    //res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Get all services
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.render('myServices', { services }); // res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a service
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // --- Ownership check (optional, comment out if not using auth yet) ---
    // if (service.user.toString() !== req.user.id && req.user.role !== 'Admin') {
    //   return res.status(401).json({ message: 'User not authorized' });
    // }

    // Update service fields
    service.title = req.body.title;
    service.description = req.body.description;
    service.category = req.body.category;
    service.status = req.body.status;

    await service.save();

    // Redirect back to My Services page after updating
    res.redirect('/services/my-services');
  } catch (err) {
    console.error("Update error:", err.message);
    res.status(500).json({ error: "Error updating service" });
  }
};

// Delete a service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Ownership check (optional)
    if (service.user.toString() !== req.user.id && req.user.role !== "Admin") {
      return res.status(401).json({ message: "User not authorized" });
    }

    await service.remove();

    // Fetch updated services and re-render directly
    const services = await Service.find({ user: req.user.id }).sort("-createdAt");
    res.render("myServices", { services });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


// Get services created by the logged-in user
exports.getMyServices = async (req, res) => {
  try {
    const myServices = await Service.find({ user: req.user.id }).sort('-createdAt');
    // Render the EJS page with fresh data
    res.render('myServices', { services: myServices });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading services');
  }
};


// Get ratings for a service (with rater details)
exports.getRatingsForService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .select('ratings averageRating ratingsCount')
      .populate('ratings.user', 'firstName lastName avatar email'); // adjust fields as you like

    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({
      ratings: service.ratings,
      averageRating: service.averageRating,
      ratingsCount: service.ratingsCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add or update a rating for a service
const assert1to5 = (n) => Number.isFinite(n) && n >= 1 && n <= 5;
exports.addRating = async (req, res) => {
  try {
    const { stars, comment = '' } = req.body;

    if (!assert1to5(stars)) {
      return res.status(400).json({ message: 'Stars must be between 1 and 5.' });
    }

    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    // Prevent rating your own service
    if (service.user.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot rate your own service.' });
    }

    // If the user already rated, update that rating. Otherwise push a new one.
    const existing = service.ratings.find(r => r.user.toString() === req.user.id);
    if (existing) {
      existing.stars = stars;
      existing.comment = comment;
      existing.createdAt = new Date();
    } else {
      service.ratings.push({ user: req.user.id, stars, comment });
    }

    // Recompute average + count
    service.recalculateRating();
    await service.save();

    // Return fresh data with populated users
    await service.populate('ratings.user', 'firstName lastName avatar email');

    res.status(201).json({
      message: 'Rating saved',
      ratings: service.ratings,
      averageRating: service.averageRating,
      ratingsCount: service.ratingsCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// (Optional) delete your own rating (or admin)
exports.deleteRating = async (req, res) => {
  try {
    const { id, ratingId } = req.params; // serviceId + ratingId
    const service = await Service.findById(id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    const rating = service.ratings.id(ratingId);
    if (!rating) return res.status(404).json({ message: 'Rating not found' });

    if (rating.user.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({ message: 'User not authorized' });
    }

    rating.remove();
    service.recalculateRating();
    await service.save();

    res.json({
      message: 'Rating removed',
      averageRating: service.averageRating,
      ratingsCount: service.ratingsCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

