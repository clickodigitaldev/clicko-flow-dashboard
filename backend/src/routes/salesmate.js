const express = require('express');
const SalesmateService = require('../services/salesmateService');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// @desc    Test Salesmate API connection
// @route   POST /api/salesmate/test-connection
// @access  Private
router.post('/test-connection', async (req, res) => {
  try {
    const { apiKey, baseUrl } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    const salesmateService = new SalesmateService(apiKey, baseUrl);
    const result = await salesmateService.testConnection();

    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Connection successful',
        data: result.data 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        error: result.error 
      });
    }
  } catch (error) {
    console.error('Test connection error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Get deals from Salesmate
// @route   GET /api/salesmate/deals
// @access  Private
router.get('/deals', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user || !user.salesmateApiKey) {
      return res.status(400).json({ 
        error: 'Salesmate API key not configured. Please update your profile.' 
      });
    }

    const salesmateService = new SalesmateService(
      user.salesmateApiKey, 
      user.salesmateBaseUrl
    );

    const result = await salesmateService.getDeals();

    if (result.success) {
      res.json(result.data);
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Get deals error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Get won deals from Salesmate
// @route   GET /api/salesmate/won-deals
// @access  Private
router.get('/won-deals', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user || !user.salesmateApiKey) {
      return res.status(400).json({ 
        error: 'Salesmate API key not configured. Please update your profile.' 
      });
    }

    const salesmateService = new SalesmateService(
      user.salesmateApiKey, 
      user.salesmateBaseUrl
    );

    const result = await salesmateService.getWonDeals();

    if (result.success) {
      res.json(result.data);
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Get won deals error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Sync won deals and create projects
// @route   POST /api/salesmate/sync-won-deals
// @access  Private
router.post('/sync-won-deals', async (req, res) => {
  try {
    const result = await SalesmateService.prototype.syncWonDeals(req.user._id);

    if (result.success) {
      res.json({
        success: true,
        message: `Sync completed. ${result.data.totalCreated} projects created, ${result.data.totalErrors} errors.`,
        data: result.data
      });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Sync won deals error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Create project from specific deal
// @route   POST /api/salesmate/create-project/:dealId
// @access  Private
router.post('/create-project/:dealId', async (req, res) => {
  try {
    const { dealId } = req.params;
    const user = await User.findById(req.user._id);
    
    if (!user || !user.salesmateApiKey) {
      return res.status(400).json({ 
        error: 'Salesmate API key not configured. Please update your profile.' 
      });
    }

    const salesmateService = new SalesmateService(
      user.salesmateApiKey, 
      user.salesmateBaseUrl
    );

    // Get deal details
    const dealResult = await salesmateService.getDeal(dealId);
    
    if (!dealResult.success) {
      return res.status(400).json({ error: dealResult.error });
    }

    // Create project from deal
    const projectResult = await salesmateService.createProjectFromDeal(
      dealResult.data, 
      req.user._id
    );

    if (projectResult.success) {
      res.status(201).json({
        success: true,
        message: 'Project created successfully from deal',
        data: projectResult.data
      });
    } else {
      res.status(400).json({ error: projectResult.error });
    }
  } catch (error) {
    console.error('Create project from deal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Watch deal status changes
// @route   POST /api/salesmate/watch-deal/:dealId
// @access  Private
router.post('/watch-deal/:dealId', async (req, res) => {
  try {
    const { dealId } = req.params;
    const user = await User.findById(req.user._id);
    
    if (!user || !user.salesmateApiKey) {
      return res.status(400).json({ 
        error: 'Salesmate API key not configured. Please update your profile.' 
      });
    }

    const salesmateService = new SalesmateService(
      user.salesmateApiKey, 
      user.salesmateBaseUrl
    );

    const result = await salesmateService.watchDealStatus(dealId, req.user._id);

    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        data: result.data
      });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Watch deal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Get integration status
// @route   GET /api/salesmate/status
// @access  Private
router.get('/status', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const status = {
      isConfigured: !!(user && user.salesmateApiKey),
      hasApiKey: !!(user && user.salesmateApiKey),
      baseUrl: user?.salesmateBaseUrl || 'https://api.salesmate.io',
      lastSync: user?.settings?.salesmateSettings?.lastSync || null
    };

    res.json(status);
  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
