// routes/serviceRoutes.js
const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const { protect } = require('../middleware/authMiddleware');
const Service = require("../models/service");

// Read all
router.get("/", serviceController.getServices);

// Show create service form
router.get("/new", (req, res) => {
  res.render("createService");  // make sure views/createService.ejs exists
});
// My Services page
router.get("/my-services", async (req, res) => {
  try {
    const services = await Service.find(); // show all for now
    console.log("SERVICES:", services);    // debug log
    res.render("myServices", { services });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading services");
  }
});


// Read one by ID (must come AFTER /new, otherwise "new" is treated as an ID)
router.get("/:id", serviceController.getServiceById);

// Create
router.post("/", serviceController.createService); //removed protec for testing

// Update
router.put("/:id", serviceController.updateService); //removed protect for test

// Delete
router.delete("/:id", protect,  serviceController.deleteService);

// edit service form
router.get('/:id/edit', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).lean();
    if (!service) {
      return res.status(404).send('Service not found');
    }
    res.render('editService', { service });
  } catch (err) {
    res.status(500).send('Error loading service');
  }
});

// Handle service update (using POST from form)
router.post('/:id', async (req, res) => {
  try {
    const { title, description, category, status } = req.body;

    await Service.findByIdAndUpdate(
      req.params.id,
      { title, description, category, status },
      { new: true }
    );

    // After update, go back to My Services
    res.redirect('/my-services');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating service');
  }
});


// Delete a service (POST method)
router.post('/services/:id/delete', async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.redirect('/my-services'); // After deleting, go back to list
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting service');
  }
});


module.exports = router;
