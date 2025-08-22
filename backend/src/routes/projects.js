const express = require('express');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// @desc    Get all projects for user
// @route   GET /api/projects
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { status, priority, search, sortBy = 'expectedCompletion', sortOrder = 'asc' } = req.query;

    let query = { userId: req.user._id };

    // Apply filters
    if (status && status !== 'All') {
      query.status = status;
    }

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    if (search) {
      query.$or = [
        { projectName: { $regex: search, $options: 'i' } },
        { clientName: { $regex: search, $options: 'i' } },
        { projectId: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    let sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const projects = await Project.find(query).sort(sort);

    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
router.post('/', async (req, res) => {
  try {
    const {
      projectId,
      projectName,
      clientName,
      totalAmount,
      depositPaid = 0,
      expectedStartDate,
      expectedCompletion,
      status = 'Pending',
      priority = 'Medium',
      description,
      tags,
      notes,
      salesmateDealId,
      salesmateDealValue,
      salesmateDealStage
    } = req.body;

    // Check if project ID already exists
    const existingProject = await Project.findOne({ projectId, userId: req.user._id });
    if (existingProject) {
      return res.status(400).json({ error: 'Project ID already exists' });
    }

    // Calculate month of payment
    const completionDate = new Date(expectedCompletion);
    const monthOfPayment = completionDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });

    const project = await Project.create({
      userId: req.user._id,
      projectId,
      projectName,
      clientName,
      totalAmount,
      depositPaid,
      depositDate: depositPaid > 0 ? new Date() : null,
      expectedStartDate,
      expectedCompletion,
      status,
      priority,
      monthOfPayment,
      description,
      tags,
      notes,
      salesmateDealId,
      salesmateDealValue,
      salesmateDealStage
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'userId' && key !== '_id') {
        project[key] = req.body[key];
      }
    });

    // Recalculate month of payment if completion date changed
    if (req.body.expectedCompletion) {
      const completionDate = new Date(req.body.expectedCompletion);
      project.monthOfPayment = completionDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
    }

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    console.error('Update project error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await project.remove();
    res.json({ message: 'Project removed' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Update project status
// @route   PATCH /api/projects/:id/status
// @access  Private
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    project.status = status;
    const updatedProject = await project.save();

    res.json(updatedProject);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Add payment to project
// @route   POST /api/projects/:id/payments
// @access  Private
router.post('/:id/payments', async (req, res) => {
  try {
    const { amount, type, description } = req.body;

    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Add payment to history
    project.paymentHistory.push({
      amount,
      date: new Date(),
      type,
      description
    });

    // Update deposit paid if it's a deposit payment
    if (type === 'deposit') {
      project.depositPaid += amount;
      if (!project.depositDate) {
        project.depositDate = new Date();
      }
    }

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    console.error('Add payment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Get project statistics
// @route   GET /api/projects/stats/overview
// @access  Private
router.get('/stats/overview', async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id });

    const stats = {
      total: projects.length,
      totalValue: projects.reduce((sum, p) => sum + p.totalAmount, 0),
      totalDeposits: projects.reduce((sum, p) => sum + p.depositPaid, 0),
      totalRemaining: projects.reduce((sum, p) => sum + (p.totalAmount - p.depositPaid), 0),
      byStatus: {},
      byPriority: {}
    };

    // Count by status
    projects.forEach(project => {
      stats.byStatus[project.status] = (stats.byStatus[project.status] || 0) + 1;
      stats.byPriority[project.priority] = (stats.byPriority[project.priority] || 0) + 1;
    });

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
