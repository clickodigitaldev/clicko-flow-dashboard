const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://clicko-flow-production.up.railway.app/api'
  : 'http://localhost:5001/api';

class ProjectService {
  constructor() {
    this.baseURL = API_BASE_URL;
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
      throw error;
    }
  }

  // Get projects by month
  async getProjectsByMonth(month) {
    try {
      const response = await fetch(`${this.baseURL}/projects/month/${encodeURIComponent(month)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
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
      console.log('🚀 Creating project with data:', projectData);
      const response = await fetch(`${this.baseURL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('✅ Project created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  // Update project
  async updateProject(projectId, projectData) {
    try {
      const response = await fetch(`${this.baseURL}/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
      });

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
      const response = await fetch(`${this.baseURL}/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
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
      const response = await fetch(`${this.baseURL}/projects/${projectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
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

  // Add payment to project
  async addPayment(projectId, paymentData) {
    try {
      console.log('💰 Adding payment to project:', projectId, paymentData);
      const response = await fetch(`${this.baseURL}/projects/${projectId}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Payment added successfully:', data);
      return data;
    } catch (error) {
      console.error('Error adding payment:', error);
      throw error;
    }
  }
}

const projectService = new ProjectService();
export default projectService;
