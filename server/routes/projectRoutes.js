const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Create Project
router.post('/', async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
});

// Get All Projects
router.get('/', async (req, res) => {
  try {
    const { status, skills, minBudget, maxBudget } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (skills) filter.skills = { $in: skills.split(',') };
    if (minBudget || maxBudget) {
      filter.budget = {};
      if (minBudget) filter.budget.$gte = Number(minBudget);
      if (maxBudget) filter.budget.$lte = Number(maxBudget);
    }

    const projects = await Project.find(filter)
      .populate('client', 'username email')
      .populate('freelancer', 'username email')
      .sort({ postedDate: -1 });
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
});

// Get Project by ID
router.get('/:projectId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate('client', 'username email')
      .populate('freelancer', 'username email')
      .populate('bids');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
});

// Update Project
router.put('/:projectId', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.projectId,
      req.body,
      { new: true }
    );
    res.json({ message: 'Project updated successfully', project });
  } catch (error) {
    res.status(500).json({ message: 'Error updating project', error: error.message });
  }
});

// Delete Project
router.delete('/:projectId', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.projectId);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
});

// Get Projects by Client
router.get('/client/:clientId', async (req, res) => {
  try {
    const projects = await Project.find({ client: req.params.clientId })
      .populate('freelancer', 'username email')
      .sort({ postedDate: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
});

// Get Projects by Freelancer
router.get('/freelancer/:freelancerId', async (req, res) => {
  try {
    const projects = await Project.find({ freelancer: req.params.freelancerId })
      .populate('client', 'username email')
      .sort({ postedDate: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
});

module.exports = router;