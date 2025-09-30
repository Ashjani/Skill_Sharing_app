// routes/serviceRoutes.js
const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const { protect } = require("../middleware/authMiddleware");
const Service = require("../models/service");

// 🔎 quick ping to prove this router is mounted
router.get("/__ping", (_req, res) => res.send("services router OK"));

// List (renders page)
router.get("/", serviceController.getServices);

// Create (API from form submit; protect if needed)
router.post("/", protect, serviceController.createService);

// Edit form
router.get("/:id/edit", protect, async (req, res) => {

  try {
    console.log("EDIT ROUTE HIT:", req.params.id); // <--- ADD THIS

    const service = await Service.findById(req.params.id).lean();

    if (!service) return res.status(404).send("Service not found");
    return res.render("services/edit", {
      service,
      title: `Edit: ${service.title}`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error loading service");
  }
});

// Update (simple form POST)
router.post("/:id", protect, async (req, res) => {

  try {
    const { title, description, category, status, price, imageUrl } = req.body;
    await Service.findByIdAndUpdate(
      req.params.id,
      { title, description, category, status, price, imageUrl },
      { new: true }
    );

    return res.redirect(`/services/${req.params.id}`);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error updating service");
  }
});

// Delete (form POST)
router.post("/:id/delete", protect, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    return res.redirect("/my-services");

  } catch (err) {
    console.error(err);
    return res.status(500).send("Error deleting service");
  }
});

// Detail (must be AFTER edit/delete form routes)
router.get("/:id", serviceController.getServiceById);

// Optional REST-style endpoints
router.put("/:id", protect, serviceController.updateService);
router.delete("/:id", protect, serviceController.deleteService);


module.exports = router;
