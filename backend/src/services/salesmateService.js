const axios = require('axios');
const Project = require('../models/Project');
const User = require('../models/User');

class SalesmateService {
  constructor(apiKey, baseUrl = 'https://api.salesmate.io') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  // Test API connection
  async testConnection() {
    try {
      const response = await this.client.get('/api/v1/user/profile');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  }

  // Get all deals
  async getDeals() {
    try {
      const response = await this.client.get('/api/v1/deals');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  }

  // Get specific deal by ID
  async getDeal(dealId) {
    try {
      const response = await this.client.get(`/api/v1/deals/${dealId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  }

  // Get won deals
  async getWonDeals() {
    try {
      const response = await this.client.get('/api/v1/deals', {
        params: {
          stage: 'Won',
          limit: 100
        }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  }

  // Create project from deal
  async createProjectFromDeal(deal, userId) {
    try {
      // Extract deal information
      const dealData = deal.data || deal;
      
      const projectData = {
        projectId: `PROJ${Date.now()}`,
        projectName: dealData.title || `Project from ${dealData.companyName}`,
        clientName: dealData.companyName || dealData.contactName || 'Unknown Client',
        totalAmount: dealData.value || 0,
        expectedStartDate: dealData.expectedStartDate || new Date(),
        expectedCompletion: dealData.expectedCloseDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: 'Pending',
        priority: 'Medium',
        description: dealData.description || '',
        salesmateDealId: dealData._id,
        salesmateDealValue: dealData.value,
        salesmateDealStage: dealData.stage
      };

      // Check if project already exists for this deal
      const existingProject = await Project.findOne({
        salesmateDealId: dealData._id,
        userId: userId
      });

      if (existingProject) {
        return { 
          success: false, 
          error: 'Project already exists for this deal' 
        };
      }

      // Create new project
      const project = await Project.create({
        ...projectData,
        userId: userId
      });

      return { success: true, data: project };
    } catch (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  // Sync won deals for a user
  async syncWonDeals(userId) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.salesmateApiKey) {
        return { 
          success: false, 
          error: 'User not found or Salesmate API key not configured' 
        };
      }

      // Create service instance with user's API key
      const salesmateService = new SalesmateService(
        user.salesmateApiKey, 
        user.salesmateBaseUrl
      );

      // Get won deals
      const wonDealsResult = await salesmateService.getWonDeals();
      
      if (!wonDealsResult.success) {
        return wonDealsResult;
      }

      const wonDeals = wonDealsResult.data;
      const createdProjects = [];
      const errors = [];

      // Process each won deal
      for (const deal of wonDeals) {
        const result = await salesmateService.createProjectFromDeal(deal, userId);
        
        if (result.success) {
          createdProjects.push(result.data);
        } else {
          errors.push({
            dealId: deal._id,
            error: result.error
          });
        }
      }

      return {
        success: true,
        data: {
          createdProjects,
          errors,
          totalProcessed: wonDeals.length,
          totalCreated: createdProjects.length,
          totalErrors: errors.length
        }
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  // Watch for deal status changes (webhook simulation)
  async watchDealStatus(dealId, userId) {
    try {
      const dealResult = await this.getDeal(dealId);
      
      if (!dealResult.success) {
        return dealResult;
      }

      const deal = dealResult.data;
      
      // If deal is won, create project
      if (deal.stage === 'Won') {
        return await this.createProjectFromDeal(deal, userId);
      }

      return { 
        success: true, 
        message: 'Deal status checked, no action needed' 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  }
}

module.exports = SalesmateService;
