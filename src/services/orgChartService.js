const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://clicko-flow-production.up.railway.app/api'
  : 'http://localhost:5001/api';

const orgChartService = {
  async getOrgChart() {
    try {
      const response = await fetch(`${API_BASE_URL}/org-chart`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching org chart:', error);
      throw error;
    }
  },

  async updateOrgChart(orgChartData) {
    try {
      const response = await fetch(`${API_BASE_URL}/org-chart`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orgChartData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error updating org chart:', error);
      throw error;
    }
  },

  async addTeam(teamData) {
    try {
      const response = await fetch(`${API_BASE_URL}/org-chart/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error adding team:', error);
      throw error;
    }
  },

  async updateTeam(teamId, teamData) {
    try {
      const response = await fetch(`${API_BASE_URL}/org-chart/teams/${teamId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error updating team:', error);
      throw error;
    }
  },

  async deleteTeam(teamId) {
    try {
      const response = await fetch(`${API_BASE_URL}/org-chart/teams/${teamId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error deleting team:', error);
      throw error;
    }
  },

  async addMember(teamId, memberData) {
    try {
      const response = await fetch(`${API_BASE_URL}/org-chart/teams/${teamId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  },

  async updateMember(teamId, memberId, memberData) {
    try {
      const response = await fetch(`${API_BASE_URL}/org-chart/teams/${teamId}/members/${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error updating member:', error);
      throw error;
    }
  },

  async deleteMember(teamId, memberId) {
    try {
      const response = await fetch(`${API_BASE_URL}/org-chart/teams/${teamId}/members/${memberId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error deleting member:', error);
      throw error;
    }
  }
};

export default orgChartService;



