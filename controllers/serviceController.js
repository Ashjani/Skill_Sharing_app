// controllers/serviceController.js
const mongoose = require("mongoose");
const Service = require("../models/service");

// Create
exports.createService = async (req, res) => {
  try {
    const service = new Service({
      ...req.body,
      user: req.user.id,
      // user: req.user?.id, // tolerate unauth in dev
    });
    await service.save();

    // minimal UX: go to details
    return res.redirect(`/services/${service._id}`);

  } catch (err) {
    console.error(err);
    return res.status(400).render("errors/404", { message: err.message });
  }
};

// List (render page to match your index.ejs)
exports.getServices = async (req, res) => {
  try {

    const services = await Service.find()
      .populate("user", "firstName lastName")
      .lean();
    return res.render("services", { services, title: "Services" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .render("errors/404", { message: "Failed to load services" });
  }
};

// Detail (render page)
exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
    return res.status(404).send("Invalid service ID");
  }
    //   return res
    //     .status(404)
    //     .render("errors/404", { message: "Invalid service id" });
    // }
    const service = await Service.findById(id)
      .populate("user", "firstName lastName")
      .lean();

    if (!service) {
    return res
    .status(404)
    .render("errors/404", { message: "Service not found" });
  } 
    //   return res
    //     .status(404)
    //     .render("errors/404", { message: "Service not found" });
    // }

    // IMPORTANT: render path is relative to /views, do not prefix with "views/"
    return res.render("serviceDetails", {
    // return res.render("services/serviceDetails", {
      service,
      title: service.title,
      user: req.user || null,
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .render("errors/404", { message: "Something went wrong" });
  }
};
// List only the services created by the logged-in user
exports.getMyServices = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect("/auth/login");
    }

    const services = await Service.find({ user: req.user.id }).lean();
    return res.render("myServices", { services, title: "My Services" });
  } catch (err) {
    console.error(err);
    return res.status(500).render("errors/404", { message: "Failed to load your services" });
  }
};

// --- Optional REST APIs (unchanged logic) ---
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    if (
      req.user &&
      service.user.toString() !== req.user.id &&
      req.user.role !== "Admin"
    ) {
      return res.status(401).json({ message: "User not authorized" });
    }
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ error: err.message });

  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    if (
      req.user &&
      service.user.toString() !== req.user.id &&
      req.user.role !== "Admin"
    ) {
      return res.status(401).json({ message: "User not authorized" });
    }
    await service.deleteOne();
    return res.json({ message: "Service deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// (You can keep your ratings methods as they were.)

// Get ratings for a service (with rater details)
exports.getRatingsForService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .select("ratings averageRating ratingsCount")
      .populate("ratings.user", "firstName lastName avatar email"); // adjust fields as you like

    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json({
      ratings: service.ratings,
      averageRating: service.averageRating,
      ratingsCount: service.ratingsCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add or update a rating for a service
const assert1to5 = (n) => Number.isFinite(n) && n >= 1 && n <= 5;
exports.addRating = async (req, res) => {
  try {
    const { stars, comment = "" } = req.body;

    if (!assert1to5(stars)) {
      return res
        .status(400)
        .json({ message: "Stars must be between 1 and 5." });
    }

    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    // Prevent rating your own service
    if (service.user.toString() === req.user.id) {
      return res
        .status(400)
        .json({ message: "You cannot rate your own service." });
    }

    // If the user already rated, update that rating. Otherwise push a new one.
    const existing = service.ratings.find(
      (r) => r.user.toString() === req.user.id
    );
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
    await service.populate("ratings.user", "firstName lastName avatar email");

    res.status(201).json({
      message: "Rating saved",
      ratings: service.ratings,
      averageRating: service.averageRating,
      ratingsCount: service.ratingsCount,
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
    if (!service) return res.status(404).json({ message: "Service not found" });

    const rating = service.ratings.id(ratingId);
    if (!rating) return res.status(404).json({ message: "Rating not found" });

    if (rating.user.toString() !== req.user.id && req.user.role !== "Admin") {
      return res.status(401).json({ message: "User not authorized" });
    }

    rating.remove();
    service.recalculateRating();
    await service.save();

    res.json({
      message: "Rating removed",
      averageRating: service.averageRating,
      ratingsCount: service.ratingsCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
