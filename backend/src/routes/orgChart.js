const express = require('express');
const router = express.Router();
const OrgChart = require('../models/OrgChart');
const currencyService = require('../services/currencyService');

// Temporarily disable authentication for development
// router.use(protect);

// Get org chart data
router.get('/', async (req, res) => {
  try {
    const userId = '68a79730091b06b0654ec04a'; // Hardcoded for development
    let orgChart = await OrgChart.findOne({ userId });
    
    if (!orgChart) {
      // Create default org chart if none exists
      orgChart = new OrgChart({
        userId,
        ceo: {
          name: 'Masud Rana',
          position: 'CEO / Founder',
          salary: 15000,
          salaryCurrency: 'AED',
          salaryInBase: 15000
        },
        teams: [
          {
            name: 'Product Team',
            role: 'Product Development & Engineering',
            description: 'Core product development and engineering team',
            members: [
              { name: 'Sarah Wilson', position: 'Product Manager', salary: 8500, salaryCurrency: 'AED', salaryInBase: 8500, status: 'Active' },
              { name: 'Alex Brown', position: 'UI/UX Designer', salary: 7500, salaryCurrency: 'AED', salaryInBase: 7500, status: 'Active' },
              { name: 'David Lee', position: 'Frontend Developer', salary: 8000, salaryCurrency: 'AED', salaryInBase: 8000, status: 'Active' },
              { name: 'Emily Davis', position: 'Backend Developer', salary: 8200, salaryCurrency: 'AED', salaryInBase: 8200, status: 'Active' },
              { name: 'Michael Chen', position: 'Full Stack Developer', salary: 9000, salaryCurrency: 'AED', salaryInBase: 9000, status: 'Active' },
              { name: 'Jessica Park', position: 'Mobile Developer', salary: 7800, salaryCurrency: 'AED', salaryInBase: 7800, status: 'Hiring' },
              { name: 'Ryan Thompson', position: 'DevOps Engineer', salary: 8500, salaryCurrency: 'AED', salaryInBase: 8500, status: 'Active' },
              { name: 'Amanda Rodriguez', position: 'QA Engineer', salary: 6500, salaryCurrency: 'AED', salaryInBase: 6500, status: 'Warning' }
            ]
          },
          {
            name: 'Service Team',
            role: 'Customer Support & Success',
            description: 'Customer service and technical support team',
            members: [
              { name: 'John Doe', position: 'Support Lead', salary: 6000, salaryCurrency: 'AED', salaryInBase: 6000, status: 'Active' },
              { name: 'Jane Smith', position: 'Customer Success Manager', salary: 5500, salaryCurrency: 'AED', salaryInBase: 5500, status: 'Active' },
              { name: 'Mike Johnson', position: 'Technical Support Specialist', salary: 5200, salaryCurrency: 'AED', salaryInBase: 5200, status: 'Active' },
              { name: 'Lisa Wang', position: 'Customer Support Representative', salary: 4500, salaryCurrency: 'AED', salaryInBase: 4500, status: 'Active' },
              { name: 'Carlos Martinez', position: 'Support Engineer', salary: 5800, salaryCurrency: 'AED', salaryInBase: 5800, status: 'Hiring' },
              { name: 'Sophie Turner', position: 'Customer Success Specialist', salary: 4800, salaryCurrency: 'AED', salaryInBase: 4800, status: 'Active' }
            ]
          },
          {
            name: 'Management Team',
            role: 'Leadership & Operations',
            description: 'Executive leadership and operational management',
            members: [
              { name: 'Robert Taylor', position: 'Operations Manager', salary: 9000, salaryCurrency: 'AED', salaryInBase: 9000, status: 'Active' },
              { name: 'Lisa Anderson', position: 'HR Manager', salary: 6800, salaryCurrency: 'AED', salaryInBase: 6800, status: 'Active' },
              { name: 'Tom Wilson', position: 'Finance Manager', salary: 7500, salaryCurrency: 'AED', salaryInBase: 7500, status: 'Active' },
              { name: 'Maria Garcia', position: 'Marketing Manager', salary: 7200, salaryCurrency: 'AED', salaryInBase: 7200, status: 'Active' },
              { name: 'James Kim', position: 'Business Development', salary: 7800, salaryCurrency: 'AED', salaryInBase: 7800, status: 'Warning' },
              { name: 'Rachel Green', position: 'Project Manager', salary: 7000, salaryCurrency: 'AED', salaryInBase: 7000, status: 'Active' }
            ]
          }
        ]
      });
      await orgChart.save();
    }
    
    res.json({ success: true, data: orgChart });
  } catch (error) {
    console.error('Error fetching org chart:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update org chart data
router.put('/', async (req, res) => {
  try {
    const userId = '68a79730091b06b0654ec04a'; // Hardcoded for development
    const { ceo, teams, companyName, companyLogo, settings } = req.body;
    
    // Get existing org chart data
    let orgChart = await OrgChart.findOne({ userId });
    if (!orgChart) {
      return res.status(404).json({ success: false, error: 'Org chart not found' });
    }
    
    // Prepare update data
    const updateData = {};
    
    // Update CEO if provided
    if (ceo) {
      // Process CEO data to ensure salaryInBase is set
      const processedCEO = {
        ...ceo,
        salaryInBase: ceo.salaryInBase || currencyService.convertToBase(ceo.salary || 0, ceo.salaryCurrency || 'AED')
      };
      updateData.ceo = processedCEO;
    }
    
    // Update teams if provided
    if (teams) {
      // Process teams and members to ensure salaryInBase is set
      const processedTeams = teams.map(team => ({
        ...team,
        members: team.members.map(member => ({
          ...member,
          salaryInBase: member.salaryInBase || currencyService.convertToBase(member.salary, member.salaryCurrency || 'AED')
        }))
      }));
      updateData.teams = processedTeams;
    }
    
    // Update other fields if provided
    if (companyName !== undefined) updateData.companyName = companyName;
    if (companyLogo !== undefined) updateData.companyLogo = companyLogo;
    if (settings !== undefined) updateData.settings = settings;
    
    // Update the org chart
    orgChart = await OrgChart.findOneAndUpdate(
      { userId },
      updateData,
      { new: true }
    );
    
    res.json({ success: true, data: orgChart });
  } catch (error) {
    console.error('Error updating org chart:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add new team
router.post('/teams', async (req, res) => {
  try {
    const userId = '68a79730091b06b0654ec04a';
    const { name, role, description, imageUrl } = req.body;
    
    const orgChart = await OrgChart.findOne({ userId });
    if (!orgChart) {
      return res.status(404).json({ success: false, error: 'Org chart not found' });
    }
    
    orgChart.teams.push({
      name,
      role,
      description,
      imageUrl,
      members: []
    });
    
    await orgChart.save();
    res.json({ success: true, data: orgChart });
  } catch (error) {
    console.error('Error adding team:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update team
router.put('/teams/:teamId', async (req, res) => {
  try {
    const userId = '68a79730091b06b0654ec04a';
    const { teamId } = req.params;
    const { name, role, description, imageUrl } = req.body;
    
    const orgChart = await OrgChart.findOne({ userId });
    if (!orgChart) {
      return res.status(404).json({ success: false, error: 'Org chart not found' });
    }
    
    const team = orgChart.teams.id(teamId);
    if (!team) {
      return res.status(404).json({ success: false, error: 'Team not found' });
    }
    
    team.name = name;
    team.role = role;
    team.description = description;
    team.imageUrl = imageUrl;
    
    await orgChart.save();
    res.json({ success: true, data: orgChart });
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete team
router.delete('/teams/:teamId', async (req, res) => {
  try {
    const userId = '68a79730091b06b0654ec04a';
    const { teamId } = req.params;
    
    const orgChart = await OrgChart.findOne({ userId });
    if (!orgChart) {
      return res.status(404).json({ success: false, error: 'Org chart not found' });
    }
    
    orgChart.teams = orgChart.teams.filter(team => team._id.toString() !== teamId);
    await orgChart.save();
    
    res.json({ success: true, data: orgChart });
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add member to team
router.post('/teams/:teamId/members', async (req, res) => {
  try {
    const userId = '68a79730091b06b0654ec04a';
    const { teamId } = req.params;
    const { name, position, salary, salaryCurrency, imageUrl, email, phone, status } = req.body;
    
    const orgChart = await OrgChart.findOne({ userId });
    if (!orgChart) {
      return res.status(404).json({ success: false, error: 'Org chart not found' });
    }
    
    const team = orgChart.teams.id(teamId);
    if (!team) {
      return res.status(404).json({ success: false, error: 'Team not found' });
    }
    
    const salaryInBase = currencyService.convertToBase(salary, salaryCurrency || 'AED');
    
    team.members.push({
      name,
      position,
      salary,
      salaryCurrency: salaryCurrency || 'AED',
      salaryInBase,
      imageUrl,
      email,
      phone,
      status: status || 'Active'
    });
    
    await orgChart.save();
    res.json({ success: true, data: orgChart });
  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update member
router.put('/teams/:teamId/members/:memberId', async (req, res) => {
  try {
    const userId = '68a79730091b06b0654ec04a';
    const { teamId, memberId } = req.params;
    const { name, position, salary, salaryCurrency, imageUrl, email, phone, status } = req.body;
    
    const orgChart = await OrgChart.findOne({ userId });
    if (!orgChart) {
      return res.status(404).json({ success: false, error: 'Org chart not found' });
    }
    
    const team = orgChart.teams.id(teamId);
    if (!team) {
      return res.status(404).json({ success: false, error: 'Team not found' });
    }
    
    const member = team.members.id(memberId);
    if (!member) {
      return res.status(404).json({ success: false, error: 'Member not found' });
    }
    
    const salaryInBase = currencyService.convertToBase(salary, salaryCurrency || 'AED');
    
    member.name = name;
    member.position = position;
    member.salary = salary;
    member.salaryCurrency = salaryCurrency || 'AED';
    member.salaryInBase = salaryInBase;
    member.imageUrl = imageUrl;
    member.email = email;
    member.phone = phone;
    member.status = status || 'Active';
    
    await orgChart.save();
    res.json({ success: true, data: orgChart });
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete member
router.delete('/teams/:teamId/members/:memberId', async (req, res) => {
  try {
    const userId = '68a79730091b06b0654ec04a';
    const { teamId, memberId } = req.params;
    
    const orgChart = await OrgChart.findOne({ userId });
    if (!orgChart) {
      return res.status(404).json({ success: false, error: 'Org chart not found' });
    }
    
    const team = orgChart.teams.id(teamId);
    if (!team) {
      return res.status(404).json({ success: false, error: 'Team not found' });
    }
    
    team.members = team.members.filter(member => member._id.toString() !== memberId);
    await orgChart.save();
    
    res.json({ success: true, data: orgChart });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reset org chart to default test data
router.post('/reset', async (req, res) => {
  try {
    const userId = '68a79730091b06b0654ec04a';
    
    // Delete existing org chart
    await OrgChart.deleteOne({ userId });
    
    // Create new default org chart with test data
    const orgChart = new OrgChart({
      userId,
      ceo: {
        name: 'Masud Rana',
        position: 'CEO / Founder',
        salary: 15000,
        salaryCurrency: 'AED',
        salaryInBase: 15000
      },
      teams: [
        {
          name: 'Product Team',
          role: 'Product Development & Engineering',
          description: 'Core product development and engineering team',
          members: [
            { name: 'Sarah Wilson', position: 'Product Manager', salary: 8500, salaryCurrency: 'AED', salaryInBase: 8500, status: 'Active' },
            { name: 'Alex Brown', position: 'UI/UX Designer', salary: 7500, salaryCurrency: 'AED', salaryInBase: 7500, status: 'Active' },
            { name: 'David Lee', position: 'Frontend Developer', salary: 8000, salaryCurrency: 'AED', salaryInBase: 8000, status: 'Active' },
            { name: 'Emily Davis', position: 'Backend Developer', salary: 8200, salaryCurrency: 'AED', salaryInBase: 8200, status: 'Active' },
            { name: 'Michael Chen', position: 'Full Stack Developer', salary: 9000, salaryCurrency: 'AED', salaryInBase: 9000, status: 'Active' },
            { name: 'Jessica Park', position: 'Mobile Developer', salary: 7800, salaryCurrency: 'AED', salaryInBase: 7800, status: 'Hiring' },
            { name: 'Ryan Thompson', position: 'DevOps Engineer', salary: 8500, salaryCurrency: 'AED', salaryInBase: 8500, status: 'Active' },
            { name: 'Amanda Rodriguez', position: 'QA Engineer', salary: 6500, salaryCurrency: 'AED', salaryInBase: 6500, status: 'Warning' }
          ]
        },
        {
          name: 'Service Team',
          role: 'Customer Support & Success',
          description: 'Customer service and technical support team',
          members: [
            { name: 'John Doe', position: 'Support Lead', salary: 6000, salaryCurrency: 'AED', salaryInBase: 6000, status: 'Active' },
            { name: 'Jane Smith', position: 'Customer Success Manager', salary: 5500, salaryCurrency: 'AED', salaryInBase: 5500, status: 'Active' },
            { name: 'Mike Johnson', position: 'Technical Support Specialist', salary: 5200, salaryCurrency: 'AED', salaryInBase: 5200, status: 'Active' },
            { name: 'Lisa Wang', position: 'Customer Support Representative', salary: 4500, salaryCurrency: 'AED', salaryInBase: 4500, status: 'Active' },
            { name: 'Carlos Martinez', position: 'Support Engineer', salary: 5800, salaryCurrency: 'AED', salaryInBase: 5800, status: 'Hiring' },
            { name: 'Sophie Turner', position: 'Customer Success Specialist', salary: 4800, salaryCurrency: 'AED', salaryInBase: 4800, status: 'Active' }
          ]
        },
        {
          name: 'Management Team',
          role: 'Leadership & Operations',
          description: 'Executive leadership and operational management',
          members: [
            { name: 'Robert Taylor', position: 'Operations Manager', salary: 9000, salaryCurrency: 'AED', salaryInBase: 9000, status: 'Active' },
            { name: 'Lisa Anderson', position: 'HR Manager', salary: 6800, salaryCurrency: 'AED', salaryInBase: 6800, status: 'Active' },
            { name: 'Tom Wilson', position: 'Finance Manager', salary: 7500, salaryCurrency: 'AED', salaryInBase: 7500, status: 'Active' },
            { name: 'Maria Garcia', position: 'Marketing Manager', salary: 7200, salaryCurrency: 'AED', salaryInBase: 7200, status: 'Active' },
            { name: 'James Kim', position: 'Business Development', salary: 7800, salaryCurrency: 'AED', salaryInBase: 7800, status: 'Warning' },
            { name: 'Rachel Green', position: 'Project Manager', salary: 7000, salaryCurrency: 'AED', salaryInBase: 7000, status: 'Active' }
          ]
        }
      ]
    });
    
    await orgChart.save();
    res.json({ success: true, message: 'Org chart reset to default test data', data: orgChart });
  } catch (error) {
    console.error('Error resetting org chart:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

