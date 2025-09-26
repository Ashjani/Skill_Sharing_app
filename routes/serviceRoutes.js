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

<<<<<<< Updated upstream


// Render edit service form
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
=======
// GET /api/services/me  -> services created by the logged-in user
router.get("/me/mine", protect, serviceController.getMyServices);

//Ratings
// GET /api/services/:id/ratings
router.get("/:id/ratings", serviceController.getRatingsForService);

// POST /api/services/:id/ratings  (body: { rating:1-5, comment })
router.post("/:id/ratings", protect, serviceController.addRating);

// CRUD (owners/admin)
router.post("/", protect, serviceController.createService);
router.put("/:id", protect, serviceController.updateService);
router.delete("/:id", protect, serviceController.deleteService);

module.exports = router;
>>>>>>> Stashed changes
