// routes/serviceRoutes.js
const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const { protect } = require('../middleware/authMiddleware');
const Service = require('../models/service');

//debug for test routes
router.get('/test', (req, res) => {
  res.send("Service routes are working!");
});

// Read all
router.get("/", serviceController.getServices);
// Read one by ID
router.get("/:id", serviceController.getServiceById);


// Create
router.post("/", protect, serviceController.createService);

// Update
router.put("/:id",serviceController.updateService);// removed protect for testing

// Delete
router.delete("/:id", protect,  serviceController.deleteService);



// Render edit service form
router.get('/:id/edit', async (req, res) => {
  try {
    console.log("DEBUG Edit route hit. ID:", req.params.id);

    const service = await Service.findById(req.params.id).lean();
    console.log("DEBUG Service result:", service);

    if (!service) {
      console.log("DEBUG No service found for this ID");
      return res.status(404).send('Service not found');
    }

    res.render('editService', { service });
  } catch (err) {
    console.error("DEBUG Error in edit route:", err);
    res.status(500).send('Error loading service');
  }
});

// Handle service update
router.post('/:id', async (req, res) => {
  try {
    const { title, description, category, status } = req.body;

    await Service.findByIdAndUpdate(
      req.params.id,
      { title, description, category, status },
      { new: true }
    );

    // After update, redirect back to the services list
    res.redirect('/services');
  } catch (err) {
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
