const express = require('express');
const router = express.Router();
const Freelancer = require('../models/Freelancer');

// Create or Update Freelancer Profile
router.post('/', async (req, res) => {
  try {
    const { userId } = req.body;
    let freelancer = await Freelancer.findOne({ userId });

    if (freelancer) {
      // Update existing profile
      freelancer = await Freelancer.findOneAndUpdate(
        { userId },
        req.body,
        { new: true }
      );
    } else {
      // Create new profile
      freelancer = new Freelancer(req.body);
      await freelancer.save();
    }

    res.json({ message: 'Freelancer profile saved successfully', freelancer });
  } catch (error) {
    res.status(500).json({ message: 'Error saving freelancer profile', error: error.message });
  }
});

// Get All Freelancers
router.get('/', async (req, res) => {
  try {
    const { skills, minRate, maxRate } = req.query;
    let filter = {};

    if (skills) filter.skills = { $in: skills.split(',') };
    if (minRate || maxRate) {
      filter.hourlyRate = {};
      if (minRate) filter.hourlyRate.$gte = Number(minRate);
      if (maxRate) filter.hourlyRate.$lte = Number(maxRate);
    }

    const freelancers = await Freelancer.find(filter)
      .populate('userId', 'username email profilePicture')
      .sort({ rating: -1 });
    
    res.json(freelancers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching freelancers', error: error.message });
  }
});

// Get Freelancer by User ID
router.get('/user/:userId', async (req, res) => {
  try {
    const freelancer = await Freelancer.findOne({ userId: req.params.userId })
      .populate('userId', 'username email profilePicture')
      .populate('applications')
      .populate('projects');
    
    if (!freelancer) {
      return res.status(404).json({ message: 'Freelancer profile not found' });
    }
    res.json(freelancer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching freelancer', error: error.message });
  }
});

// Get Freelancer by ID
router.get('/:freelancerId', async (req, res) => {
  try {
    const freelancer = await Freelancer.findById(req.params.freelancerId)
      .populate('userId', 'username email profilePicture');
    
    if (!freelancer) {
      return res.status(404).json({ message: 'Freelancer not found' });
    }
    res.json(freelancer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching freelancer', error: error.message });
  }
});

// Update Freelancer Profile
router.put('/:freelancerId', async (req, res) => {
  try {
    const freelancer = await Freelancer.findByIdAndUpdate(
      req.params.freelancerId,
      req.body,
      { new: true }
    );
    res.json({ message: 'Freelancer profile updated successfully', freelancer });
  } catch (error) {
    res.status(500).json({ message: 'Error updating freelancer', error: error.message });
  }
});

// Add Portfolio Item
router.post('/:freelancerId/portfolio', async (req, res) => {
  try {
    const freelancer = await Freelancer.findByIdAndUpdate(
      req.params.freelancerId,
      { $push: { portfolio: req.body } },
      { new: true }
    );
    res.json({ message: 'Portfolio item added', freelancer });
  } catch (error) {
    res.status(500).json({ message: 'Error adding portfolio', error: error.message });
  }
});

module.exports = router;