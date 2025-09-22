// controllers/serviceController.js
const Service = require("../models/service");

exports.createService = async (req, res) => {
  try {
    const service = new Service({
      ...req.body,
      user: req.user.id // back to logged-in user
    });

    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



// Get all services
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
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

    // --- OWNERSHIP CHECK ---
    // A user can update if they are the owner OR if they are an admin.
    if (service.user.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedService);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // --- OWNERSHIP CHECK ---
    // A user can delete if they are the owner OR if they are an admin.
    if (service.user.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    await service.remove(); 
    res.json({ message: "Service deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
