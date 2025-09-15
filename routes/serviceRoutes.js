// routes/serviceRoutes.js
const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");

// Create
router.post("/", serviceController.createService);

// Read all
router.get("/", serviceController.getServices);

// Read one by ID
router.get("/:id", serviceController.getServiceById);

// Update
router.put("/:id", serviceController.updateService);

// Delete
router.delete("/:id", serviceController.deleteService);

module.exports = router;
