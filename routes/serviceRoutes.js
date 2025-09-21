// routes/serviceRoutes.js
const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const { protect } = require('../middleware/authMiddleware');



// Read all
router.get("/", serviceController.getServices);
// Read one by ID
router.get("/:id", serviceController.getServiceById);


// Create
router.post("/", protect, serviceController.createService);

// Update
router.put("/:id", protect, serviceController.updateService);

// Delete
router.delete("/:id", protect,  serviceController.deleteService);

module.exports = router;
