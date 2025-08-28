const express = require('express');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');
const currencyService = require('../services/currencyService');

const router = express.Router();

// Temporarily disable auth for testing - uncomment when ready
// router.use(protect);

// @desc    Get all projects for user
// @route   GET /api/projects
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { status, priority, search, sortBy = 'expectedCompletion', sortOrder = 'asc' } = req.query;

    // Temporarily get all projects instead of filtering by userId
    let query = {};
    
    // Apply filters if provided
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { projectName: { $regex: search, $options: 'i' } },
        { clientName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Get projects with sorting
    const projects = await Project.find(query).sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 });

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
      userId: '68a79730091b06b0654ec04a'
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
      totalAmountCurrency = 'AED',
      depositPaid = 0,
      depositPaidCurrency = 'AED',
      expectedStartDate,
      expectedCompletion,
      status = 'Pending',
      priority = 'Medium',
      description,
      tags,
      notes
    } = req.body;

    // Validate currency codes
    if (!currencyService.isValidCurrency(totalAmountCurrency)) {
      return res.status(400).json({ error: 'Invalid total amount currency' });
    }
    if (!currencyService.isValidCurrency(depositPaidCurrency)) {
      return res.status(400).json({ error: 'Invalid deposit paid currency' });
    }

    // Convert amounts to base currency (AED)
    const totalAmountInBase = currencyService.convertToBase(totalAmount, totalAmountCurrency);
    const depositPaidInBase = currencyService.convertToBase(depositPaid, depositPaidCurrency);

    // Generate CL format project ID if not provided
    let finalProjectId = projectId;
    if (!finalProjectId) {
      // Find the highest existing CL number and increment
      const allCLProjects = await Project.find(
        { projectId: { $regex: /^CL\d{4}$/ } }
      ).sort({ projectId: 1 });
      
      let nextNumber = 1;
      if (allCLProjects && allCLProjects.length > 0) {
        // Convert all CL numbers to integers and find the highest
        // Ignore anomalously high numbers (above 2000) as they seem to be errors
        const clNumbers = allCLProjects
          .map(p => parseInt(p.projectId.substring(2)))
          .filter(num => num <= 2000); // Only consider reasonable numbers
        
        if (clNumbers.length > 0) {
          const highestNumber = Math.max(...clNumbers);
          nextNumber = highestNumber + 1;
          console.log(`🔍 Found ${clNumbers.length} reasonable CL projects, highest number: ${highestNumber}, next will be: ${nextNumber}`);
        } else {
          console.log(`🔍 No reasonable CL numbers found, starting from 1`);
        }
      }
      
      finalProjectId = `CL${nextNumber.toString().padStart(4, '0')}`;
      console.log(`🚀 Generated new project ID: ${finalProjectId}`);
    }

    // Check if project ID already exists
    const existingProject = await Project.findOne({ projectId: finalProjectId, userId: '68a79730091b06b0654ec04a' });
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
      userId: '68a79730091b06b0654ec04a',
      projectId: finalProjectId,
      projectName,
      clientName,
      totalAmount,
      totalAmountCurrency,
      totalAmountInBase,
      depositPaid,
      depositPaidCurrency,
      depositPaidInBase,
      depositDate: depositPaid > 0 ? new Date() : null,
      expectedStartDate,
      expectedCompletion,
      status,
      priority,
      monthOfPayment,
      description,
      tags,
      notes
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
    // First try to find project with the hardcoded userId
    let project = await Project.findOne({
      _id: req.params.id,
      userId: '68a79730091b06b0654ec04a'
    });

    // If not found, try to find project without userId filter (for old projects)
    if (!project) {
      project = await Project.findById(req.params.id);
    }

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Handle currency conversions for updated amounts
    if (req.body.totalAmount !== undefined && req.body.totalAmountCurrency) {
      if (!currencyService.isValidCurrency(req.body.totalAmountCurrency)) {
        return res.status(400).json({ error: 'Invalid total amount currency' });
      }
      req.body.totalAmountInBase = currencyService.convertToBase(req.body.totalAmount, req.body.totalAmountCurrency);
    }

    if (req.body.depositPaid !== undefined && req.body.depositPaidCurrency) {
      if (!currencyService.isValidCurrency(req.body.depositPaidCurrency)) {
        return res.status(400).json({ error: 'Invalid deposit paid currency' });
      }
      req.body.depositPaidInBase = currencyService.convertToBase(req.body.depositPaid, req.body.depositPaidCurrency);
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'userId' && key !== '_id') {
        project[key] = req.body[key];
      }
    });

    // Set userId if it's null (for old projects)
    if (!project.userId) {
      project.userId = '68a79730091b06b0654ec04a';
    }

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
      userId: '68a79730091b06b0654ec04a'
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await Project.findByIdAndDelete(req.params.id);
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
      userId: '68a79730091b06b0654ec04a'
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
    const { amount, type, description, amountCurrency = 'AED' } = req.body;

    // Validate currency code
    if (!currencyService.isValidCurrency(amountCurrency)) {
      return res.status(400).json({ error: 'Invalid amount currency' });
    }

    const project = await Project.findOne({
      _id: req.params.id,
      userId: '68a79730091b06b0654ec04a'
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Convert amount to base currency (AED)
    const amountInBase = currencyService.convertToBase(amount, amountCurrency);

    // Add payment to history
    project.paymentHistory.push({
      amount,
      amountCurrency,
      amountInBase,
      date: req.body.date ? new Date(req.body.date) : new Date(),
      type,
      description
    });

    // Update deposit paid if it's a deposit payment
    if (type === 'deposit') {
      project.depositPaid += amount;
      project.depositPaidInBase += amountInBase;
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
    const projects = await Project.find({ userId: '68a79730091b06b0654ec04a' });

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
