const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://clicko-flow-api.onrender.com/api';

class MonthlyPlanningService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/monthly-planning`;
  }

  // Get auth token from localStorage
  async getAuthToken() {
    let token = localStorage.getItem('authToken');
    
    // If no token exists, try to create one
    if (!token) {
      token = await this.createDemoToken();
    }
    
    // If still no token (production), show auth message
    if (!token) {
      console.log('🔐 No valid authentication token found');
      // For now, we'll use a fallback approach in production
      return 'demo-token-for-production';
    }
    
    return token;
  }

  // Create demo token for development
  async createDemoToken() {
    // For production, fetch a fresh demo token from the API
    if (process.env.NODE_ENV === 'production' || window.location.hostname !== 'localhost') {
      try {
        console.log('🔐 Production environment detected - fetching demo token from API');
        const response = await fetch(`${this.baseURL.replace('/monthly-planning', '')}/demo/token`);
        
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('authToken', data.token);
          return data.token;
        }
      } catch (error) {
        console.error('Failed to fetch demo token:', error);
      }
      return null;
    }
    
    // This is a demo token for development only
    const demoToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YTc5NzMwMDkxYjA2YjA2NTRlYzA0YSIsImlhdCI6MTc1NTgxODk4OSwiZXhwIjoxNzU1OTA1Mzg5fQ.KMDepRqhARXo-pNiqcz8Aw8QybOVId_MsLcpkXIsyRY';
    localStorage.setItem('authToken', demoToken);
    return demoToken;
  }

  // Get auth headers
  async getAuthHeaders() {
    const token = await this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Get all monthly planning data
  async getAllMonthlyPlanning() {
    try {
      const response = await fetch(this.baseURL, {
        method: 'GET',
        headers: await this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching monthly planning data:', error);
      throw error;
    }
  }

  // Get monthly planning by month
  async getMonthlyPlanningByMonth(month) {
    try {
      const response = await fetch(`${this.baseURL}/${encodeURIComponent(month)}`, {
        method: 'GET',
        headers: await this.getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // Month not found
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching monthly planning by month:', error);
      throw error;
    }
  }

  // Save monthly planning (create or update)
  async saveMonthlyPlanning(monthData) {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(monthData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error saving monthly planning:', error);
      throw error;
    }
  }

  // Update monthly planning
  async updateMonthlyPlanning(id, updates) {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'PUT',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error updating monthly planning:', error);
      throw error;
    }
  }

  // Delete monthly planning
  async deleteMonthlyPlanning(id) {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'DELETE',
        headers: await this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting monthly planning:', error);
      throw error;
    }
  }

  // Initialize 24 months of monthly planning data
  async initializeMonthlyPlanning() {
    try {
      const response = await fetch(`${this.baseURL}/initialize`, {
        method: 'POST',
        headers: await this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error initializing monthly planning:', error);
      throw error;
    }
  }

  // Get monthly planning summary
  async getMonthlyPlanningSummary() {
    try {
      const response = await fetch(`${this.baseURL}/summary`, {
        method: 'GET',
        headers: await this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching monthly planning summary:', error);
      throw error;
    }
  }

  // Migrate data from localStorage to database (for existing users)
  async migrateFromLocalStorage() {
    try {
      const savedData = localStorage.getItem('clickoFlowMonthlyData');
      if (!savedData) {
        return { message: 'No localStorage data to migrate' };
      }

      const monthlyData = JSON.parse(savedData);
      let migratedCount = 0;

      for (const monthData of monthlyData) {
        try {
          await this.saveMonthlyPlanning(monthData);
          migratedCount++;
        } catch (error) {
          console.error(`Error migrating month ${monthData.month}:`, error);
        }
      }

      // Clear localStorage after successful migration
      if (migratedCount > 0) {
        localStorage.removeItem('clickoFlowMonthlyData');
      }

      return {
        message: `Successfully migrated ${migratedCount} months of data`,
        migratedCount
      };
    } catch (error) {
      console.error('Error during migration:', error);
      throw error;
    }
  }

  // Fallback to localStorage if API is not available
  async getMonthlyPlanningWithFallback() {
    try {
      // Try to get data from API first
      return await this.getAllMonthlyPlanning();
    } catch (error) {
      console.warn('API not available, falling back to localStorage:', error);
      
      // Fallback to localStorage
      const savedData = localStorage.getItem('clickoFlowMonthlyData');
      if (savedData) {
        return JSON.parse(savedData);
      }
      
      return [];
    }
  }

  // Save to localStorage as fallback
  async saveMonthlyPlanningWithFallback(monthData) {
    try {
      // Try to save to API first
      return await this.saveMonthlyPlanning(monthData);
    } catch (error) {
      console.warn('API not available, falling back to localStorage:', error);
      
      // Fallback to localStorage
      const savedData = localStorage.getItem('clickoFlowMonthlyData') || '[]';
      const monthlyData = JSON.parse(savedData);
      
      // Find and update existing month or add new one
      const existingIndex = monthlyData.findIndex(m => m.month === monthData.month);
      if (existingIndex >= 0) {
        monthlyData[existingIndex] = { ...monthlyData[existingIndex], ...monthData };
      } else {
        monthlyData.push(monthData);
      }
      
      localStorage.setItem('clickoFlowMonthlyData', JSON.stringify(monthlyData));
      return monthData;
    }
  }
}

const monthlyPlanningServiceInstance = new MonthlyPlanningService();

export default monthlyPlanningServiceInstance;
