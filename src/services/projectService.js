const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

class ProjectService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // Get all projects
  async getAllProjects() {
    try {
      const token = this.getAuthToken();
      const response = await fetch(`${this.baseURL}/projects`, {
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
      return data.data || [];
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  // Get projects by month
  async getProjectsByMonth(month) {
    try {
      const token = this.getAuthToken();
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
      return data.data || [];
    } catch (error) {
      console.error('Error fetching projects by month:', error);
      throw error;
    }
  }

  // Create new project
  async createProject(projectData) {
    try {
      const token = this.getAuthToken();
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
      return data.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  // Update project
  async updateProject(projectId, projectData) {
    try {
      const token = this.getAuthToken();
      
      // For demo projects with string IDs, we need to handle them differently
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  // Delete project
  async deleteProject(projectId) {
    try {
      const token = this.getAuthToken();
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
      const token = this.getAuthToken();
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
      return data.data;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  }
}

const projectService = new ProjectService();
export default projectService;
