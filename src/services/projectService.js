const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

class ProjectService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  async getAuthToken() {
    let token = localStorage.getItem('authToken');
    console.log('🔐 Current token from localStorage:', token ? 'Present' : 'None');
    
    // If no token exists, try to create one
    if (!token) {
      console.log('🔐 No token found, creating demo token...');
      token = await this.createDemoToken();
      console.log('🔐 Demo token created:', token ? 'Success' : 'Failed');
    }
    
    // If still no token (production), show auth message
    if (!token) {
      console.log('🔐 No valid authentication token found');
      // For now, we'll use a fallback approach in production
      return 'demo-token-for-production';
    }
    
    console.log('🔐 Returning token:', token.substring(0, 20) + '...');
    return token;
  }

  // Create demo token for development
  async createDemoToken() {
    // For production, fetch a fresh demo token from the API
    if (process.env.NODE_ENV === 'production' || window.location.hostname !== 'localhost') {
      try {
        console.log('🔐 Production environment detected - fetching demo token from API');
        console.log('🔐 Demo token URL:', `${this.baseURL}/demo/token`);
        
        const response = await fetch(`${this.baseURL}/demo/token`);
        console.log('🔐 Demo token response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('🔐 Demo token data received:', data);
          localStorage.setItem('authToken', data.token);
          console.log('🔐 Demo token stored in localStorage');
          return data.token;
        } else {
          console.error('🔐 Demo token response not ok:', response.status, response.statusText);
          const errorText = await response.text();
          console.error('🔐 Demo token error response:', errorText);
        }
      } catch (error) {
        console.error('🔐 Failed to fetch demo token:', error);
      }
      return null;
    }
    
    // This is a demo token for development only
    const demoToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YTc5NzMwMDkxYjA2YjA2NTRlYzA0YSIsImlhdCI6MTc1NTgxODk4OSwiZXhwIjoxNzU1OTA1Mzg5fQ.KMDepRqhARXo-pNiqcz8Aw8QybOVId_MsLcpkXIsyRY';
    localStorage.setItem('authToken', demoToken);
    return demoToken;
  }

  // Get all projects
  async getAllProjects() {
    try {
      console.log('🔍 Fetching projects from:', `${this.baseURL}/projects`);
      const response = await fetch(`${this.baseURL}/projects`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📊 API Response:', data);
      console.log('📊 Projects count:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('Error fetching projects:', error);
      
      console.log('❌ API failed - No fallback available');
      return [];
    }
  }

  // Get projects by month
  async getProjectsByMonth(month) {
    try {
      const token = await this.getAuthToken();
      const response = await fetch(`${this.baseURL}/projects/month/${encodeURIComponent(month)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error fetching projects by month:', error);
      throw error;
    }
  }

  // Create new project
  async createProject(projectData) {
    try {
      const token = await this.getAuthToken();
      const response = await fetch(`${this.baseURL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  // Update project
  async updateProject(projectId, projectData) {
    try {
      const token = await this.getAuthToken();
      
      // For demo projects with string IDs, we need to handle them differently
      // First try to find the project by projectId field instead of _id
      let response;
      
      if (projectId.startsWith('PROJ')) {
        // This is a demo project with string ID, we need to create a new one
        console.log('Demo project detected, creating new project in database...');
        response = await fetch(`${this.baseURL}/projects`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...projectData,
            projectId: projectId // Use the original projectId
          })
        });
      } else {
        // This is a real MongoDB ObjectId
        response = await fetch(`${this.baseURL}/projects/${projectId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(projectData)
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  // Delete project
  async deleteProject(projectId) {
    try {
      const token = await this.getAuthToken();
      const response = await fetch(`${this.baseURL}/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  // Get project by ID
  async getProjectById(projectId) {
    try {
      const token = await this.getAuthToken();
      const response = await fetch(`${this.baseURL}/projects/${projectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  }
}

const projectService = new ProjectService();
export default projectService;
