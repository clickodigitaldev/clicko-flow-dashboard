const express = require('express');
const moment = require('moment');
const MonthlyPlanningService = require('../services/monthlyPlanningService');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Temporarily disable auth for testing - uncomment when ready
// router.use(protect);

// Initialize service
const monthlyPlanningService = new MonthlyPlanningService();

// @desc    Get all monthly planning data for a user
// @route   GET /api/monthly-planning
// @access  Private
router.get('/', async (req, res) => {
  try {
    // Use default user ID for now
    const userId = req.user?._id || '68a79730091b06b0654ec04a';
    const monthlyData = await monthlyPlanningService.getAllMonthlyPlanning(userId);

    res.json({
      success: true,
      data: monthlyData
    });
  } catch (error) {
    console.error('Get monthly planning error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// @desc    Get monthly planning by month
// @route   GET /api/monthly-planning/:month
// @access  Private
router.get('/:month', async (req, res) => {
  try {
    const { month } = req.params;
    
    // Use default user ID for now
    const userId = req.user?._id || '68a79730091b06b0654ec04a';
    const monthData = await monthlyPlanningService.getMonthlyPlanningByMonth(userId, month);
    
    if (!monthData) {
      return res.status(404).json({ error: 'Monthly planning data not found' });
    }

    res.json({
      success: true,
      data: monthData
    });
  } catch (error) {
    console.error('Get monthly planning by month error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// @desc    Create or update monthly planning
// @route   POST /api/monthly-planning
// @access  Private
router.post('/', async (req, res) => {
  try {
    // Use default user ID for now
    const userId = req.user?._id || '68a79730091b06b0654ec04a';
    const monthlyPlanning = await monthlyPlanningService.saveMonthlyPlanning(userId, req.body);

    res.json({
      success: true,
      data: monthlyPlanning,
      message: 'Monthly planning saved successfully'
    });
  } catch (error) {
    console.error('Create/update monthly planning error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// @desc    Update monthly planning
// @route   PUT /api/monthly-planning/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    // Use default user ID for now
    const userId = req.user?._id || '68a79730091b06b0654ec04a';
    const monthlyPlanning = await monthlyPlanningService.updateMonthlyPlanningFields(
      userId, 
      req.params.id, 
      req.body
    );

    res.json({
      success: true,
      data: monthlyPlanning,
      message: 'Monthly planning updated successfully'
    });
  } catch (error) {
    console.error('Update monthly planning error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// @desc    Delete monthly planning
// @route   DELETE /api/monthly-planning/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const result = await monthlyPlanningService.deleteMonthlyPlanning(req.user._id, req.params.id);

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Delete monthly planning error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// @desc    Initialize 24 months of monthly planning data
// @route   POST /api/monthly-planning/initialize
// @access  Private
router.post('/initialize', async (req, res) => {
  try {
    const result = await monthlyPlanningService.initializeMonthlyPlanning(req.user._id);

    res.json({
      success: true,
      message: result.message,
      data: result
    });
  } catch (error) {
    console.error('Initialize monthly planning error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// @desc    Get monthly planning summary
// @route   GET /api/monthly-planning/summary
// @access  Private
router.get('/summary', async (req, res) => {
  try {
    const summary = await monthlyPlanningService.getMonthlyPlanningSummary(req.user._id);

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Get monthly planning summary error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

module.exports = router;
