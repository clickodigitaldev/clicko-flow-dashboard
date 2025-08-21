const express = require('express');
const moment = require('moment');
const ForecastService = require('../services/forecastService');
const Settings = require('../models/Settings');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// @desc    Generate 24-month forecast
// @route   GET /api/forecast/24-month
// @access  Private
router.get('/24-month', async (req, res) => {
  try {
    const forecastService = new ForecastService();
    const forecast = await forecastService.generateForecast(req.user._id);

    res.json({
      success: true,
      data: forecast
    });
  } catch (error) {
    console.error('Generate forecast error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// @desc    Get cash flow projection
// @route   GET /api/forecast/cash-flow
// @access  Private
router.get('/cash-flow', async (req, res) => {
  try {
    const forecastService = new ForecastService();
    const projection = await forecastService.getCashFlowProjection(req.user._id);

    res.json({
      success: true,
      data: projection
    });
  } catch (error) {
    console.error('Get cash flow error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// @desc    Get profitability analysis
// @route   GET /api/forecast/profitability
// @access  Private
router.get('/profitability', async (req, res) => {
  try {
    const forecastService = new ForecastService();
    const analysis = await forecastService.getProfitabilityAnalysis(req.user._id);

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Get profitability analysis error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// @desc    Get monthly forecast
// @route   GET /api/forecast/monthly/:month
// @access  Private
router.get('/monthly/:month', async (req, res) => {
  try {
    const { month } = req.params; // Format: "2025-01" or "January 2025"
    
    const forecastService = new ForecastService();
    const settings = await Settings.findOne({ userId: req.user._id });
    const projects = await Project.find({ userId: req.user._id });

    if (!settings) {
      return res.status(404).json({ error: 'Settings not found' });
    }

    let targetMonth;
    if (month.includes('-')) {
      // Format: "2025-01"
      targetMonth = moment(month, 'YYYY-MM');
    } else {
      // Format: "January 2025"
      targetMonth = moment(month, 'MMMM YYYY');
    }

    if (!targetMonth.isValid()) {
      return res.status(400).json({ error: 'Invalid month format' });
    }

    const monthForecast = await forecastService.calculateMonthForecast(
      targetMonth,
      projects,
      settings
    );

    res.json({
      success: true,
      data: {
        month: targetMonth.format('MMMM YYYY'),
        date: targetMonth.toDate(),
        ...monthForecast
      }
    });
  } catch (error) {
    console.error('Get monthly forecast error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// @desc    Get forecast summary
// @route   GET /api/forecast/summary
// @access  Private
router.get('/summary', async (req, res) => {
  try {
    const forecastService = new ForecastService();
    const forecast = await forecastService.generateForecast(req.user._id);

    res.json({
      success: true,
      data: forecast.summary
    });
  } catch (error) {
    console.error('Get forecast summary error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// @desc    Get forecast comparison
// @route   GET /api/forecast/comparison
// @access  Private
router.get('/comparison', async (req, res) => {
  try {
    const { months = 6 } = req.query;
    const forecastService = new ForecastService();
    const forecast = await forecastService.generateForecast(req.user._id);

    // Get the specified number of months
    const comparisonData = forecast.months.slice(0, parseInt(months));

    const comparison = {
      months: comparisonData,
      summary: {
        totalRevenue: comparisonData.reduce((sum, m) => sum + m.revenue, 0),
        totalExpenses: comparisonData.reduce((sum, m) => sum + m.expenses, 0),
        totalProfit: comparisonData.reduce((sum, m) => sum + m.profit, 0),
        averageRevenue: comparisonData.reduce((sum, m) => sum + m.revenue, 0) / comparisonData.length,
        averageExpenses: comparisonData.reduce((sum, m) => sum + m.expenses, 0) / comparisonData.length,
        averageProfit: comparisonData.reduce((sum, m) => sum + m.profit, 0) / comparisonData.length,
        profitableMonths: comparisonData.filter(m => m.profit > 0).length
      }
    };

    res.json({
      success: true,
      data: comparison
    });
  } catch (error) {
    console.error('Get forecast comparison error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

module.exports = router;
