const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Project = require('../models/Project');

// Create Application
router.post('/', async (req, res) => {
  try {
    const application = new Application(req.body);
    await application.save();

    // Add application to project bids
    await Project.findByIdAndUpdate(
      req.body.projectId,
      { $push: { bids: application._id } }
    );

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting application', error: error.message });
  }
});

// Get All Applications
router.get('/', async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('projectId', 'title budget')
      .populate('freelancer', 'username email')
      .populate('client', 'username email')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
});

// Get Applications by Project
router.get('/project/:projectId', async (req, res) => {
  try {
    const applications = await Application.find({ projectId: req.params.projectId })
      .populate('freelancer', 'username email')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
});

// Get Applications by Freelancer
router.get('/freelancer/:freelancerId', async (req, res) => {
  try {
    const applications = await Application.find({ freelancer: req.params.freelancerId })
      .populate('projectId', 'title budget deadline')
      .populate('client', 'username email')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
});

// Update Application Status
router.put('/:applicationId', async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.applicationId,
      { status },
      { new: true }
    );

    // If accepted, update project with freelancer
    if (status === 'accepted') {
      await Project.findByIdAndUpdate(
        application.projectId,
        { 
          freelancer: application.freelancer,
          status: 'in-progress'
        }
      );
    }

    res.json({ message: 'Application status updated', application });
  } catch (error) {
    res.status(500).json({ message: 'Error updating application', error: error.message });
  }
});

// Delete Application
router.delete('/:applicationId', async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.applicationId);
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting application', error: error.message });
  }
});

module.exports = router;