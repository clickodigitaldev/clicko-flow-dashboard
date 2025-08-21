const express = require('express');
const Settings = require('../models/Settings');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// @desc    Get user settings
// @route   GET /api/settings
// @access  Private
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne({ userId: req.user._id });

    if (!settings) {
      // Create default settings if none exist
      settings = await Settings.create({
        userId: req.user._id,
        monthlyTargets: new Map([
          ['January 2025', 100000],
          ['February 2025', 100000],
          ['March 2025', 100000]
        ]),
        breakEvenAmount: 50000
      });
    }

    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private
router.put('/', async (req, res) => {
  try {
    let settings = await Settings.findOne({ userId: req.user._id });

    if (!settings) {
      settings = new Settings({ userId: req.user._id });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'userId' && key !== '_id') {
        settings[key] = req.body[key];
      }
    });

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Update monthly targets
// @route   PUT /api/settings/monthly-targets
// @access  Private
router.put('/monthly-targets', async (req, res) => {
  try {
    const { monthlyTargets } = req.body;

    let settings = await Settings.findOne({ userId: req.user._id });

    if (!settings) {
      settings = new Settings({ userId: req.user._id });
    }

    settings.monthlyTargets = new Map(Object.entries(monthlyTargets));
    const updatedSettings = await settings.save();

    res.json(updatedSettings);
  } catch (error) {
    console.error('Update monthly targets error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Update break-even amount
// @route   PUT /api/settings/break-even
// @access  Private
router.put('/break-even', async (req, res) => {
  try {
    const { breakEvenAmount } = req.body;

    let settings = await Settings.findOne({ userId: req.user._id });

    if (!settings) {
      settings = new Settings({ userId: req.user._id });
    }

    settings.breakEvenAmount = breakEvenAmount;
    const updatedSettings = await settings.save();

    res.json(updatedSettings);
  } catch (error) {
    console.error('Update break-even error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Add overhead expense
// @route   POST /api/settings/overhead
// @access  Private
router.post('/overhead', async (req, res) => {
  try {
    const { positionName, salary, startDate } = req.body;

    let settings = await Settings.findOne({ userId: req.user._id });

    if (!settings) {
      settings = new Settings({ userId: req.user._id });
    }

    settings.overheadExpenses.push({
      positionName,
      salary,
      startDate: startDate || new Date()
    });

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    console.error('Add overhead error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Update overhead expense
// @route   PUT /api/settings/overhead/:id
// @access  Private
router.put('/overhead/:id', async (req, res) => {
  try {
    const { positionName, salary, isActive, endDate } = req.body;

    let settings = await Settings.findOne({ userId: req.user._id });

    if (!settings) {
      return res.status(404).json({ error: 'Settings not found' });
    }

    const overheadIndex = settings.overheadExpenses.findIndex(
      expense => expense._id.toString() === req.params.id
    );

    if (overheadIndex === -1) {
      return res.status(404).json({ error: 'Overhead expense not found' });
    }

    settings.overheadExpenses[overheadIndex] = {
      ...settings.overheadExpenses[overheadIndex],
      positionName: positionName || settings.overheadExpenses[overheadIndex].positionName,
      salary: salary || settings.overheadExpenses[overheadIndex].salary,
      isActive: isActive !== undefined ? isActive : settings.overheadExpenses[overheadIndex].isActive,
      endDate: endDate || settings.overheadExpenses[overheadIndex].endDate
    };

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    console.error('Update overhead error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Delete overhead expense
// @route   DELETE /api/settings/overhead/:id
// @access  Private
router.delete('/overhead/:id', async (req, res) => {
  try {
    let settings = await Settings.findOne({ userId: req.user._id });

    if (!settings) {
      return res.status(404).json({ error: 'Settings not found' });
    }

    settings.overheadExpenses = settings.overheadExpenses.filter(
      expense => expense._id.toString() !== req.params.id
    );

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    console.error('Delete overhead error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Add general expense
// @route   POST /api/settings/general-expenses
// @access  Private
router.post('/general-expenses', async (req, res) => {
  try {
    const { name, amount, category, frequency, startDate, notes } = req.body;

    let settings = await Settings.findOne({ userId: req.user._id });

    if (!settings) {
      settings = new Settings({ userId: req.user._id });
    }

    settings.generalExpenses.push({
      name,
      amount,
      category,
      frequency,
      startDate: startDate || new Date(),
      notes
    });

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    console.error('Add general expense error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Update general expense
// @route   PUT /api/settings/general-expenses/:id
// @access  Private
router.put('/general-expenses/:id', async (req, res) => {
  try {
    const { name, amount, category, frequency, isActive, endDate, notes } = req.body;

    let settings = await Settings.findOne({ userId: req.user._id });

    if (!settings) {
      return res.status(404).json({ error: 'Settings not found' });
    }

    const expenseIndex = settings.generalExpenses.findIndex(
      expense => expense._id.toString() === req.params.id
    );

    if (expenseIndex === -1) {
      return res.status(404).json({ error: 'General expense not found' });
    }

    settings.generalExpenses[expenseIndex] = {
      ...settings.generalExpenses[expenseIndex],
      name: name || settings.generalExpenses[expenseIndex].name,
      amount: amount || settings.generalExpenses[expenseIndex].amount,
      category: category || settings.generalExpenses[expenseIndex].category,
      frequency: frequency || settings.generalExpenses[expenseIndex].frequency,
      isActive: isActive !== undefined ? isActive : settings.generalExpenses[expenseIndex].isActive,
      endDate: endDate || settings.generalExpenses[expenseIndex].endDate,
      notes: notes || settings.generalExpenses[expenseIndex].notes
    };

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    console.error('Update general expense error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Delete general expense
// @route   DELETE /api/settings/general-expenses/:id
// @access  Private
router.delete('/general-expenses/:id', async (req, res) => {
  try {
    let settings = await Settings.findOne({ userId: req.user._id });

    if (!settings) {
      return res.status(404).json({ error: 'Settings not found' });
    }

    settings.generalExpenses = settings.generalExpenses.filter(
      expense => expense._id.toString() !== req.params.id
    );

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    console.error('Delete general expense error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Get expense summary
// @route   GET /api/settings/expense-summary
// @access  Private
router.get('/expense-summary', async (req, res) => {
  try {
    let settings = await Settings.findOne({ userId: req.user._id });

    if (!settings) {
      settings = new Settings({ userId: req.user._id });
    }

    const summary = {
      totalMonthlyOverhead: settings.getTotalMonthlyOverhead(),
      totalMonthlyGeneralExpenses: settings.getTotalMonthlyGeneralExpenses(),
      totalQuarterlyGeneralExpenses: settings.getTotalQuarterlyGeneralExpenses(),
      totalYearlyGeneralExpenses: settings.getTotalYearlyGeneralExpenses(),
      totalMonthlyExpenses: settings.getTotalMonthlyExpenses(),
      overheadExpenses: settings.overheadExpenses.filter(expense => expense.isActive),
      generalExpenses: settings.generalExpenses.filter(expense => expense.isActive)
    };

    res.json(summary);
  } catch (error) {
    console.error('Get expense summary error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
