import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  DollarSign,
  Users,
  Clock,
  CheckCircle
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import AddProjectModal from '../components/AddProjectModal';
import ProjectsTable from '../components/ProjectsTable';
import { demoProjects, projectCategories, projectStatuses, projectPriorities } from '../data/demoData';
import projectService from '../services/projectService';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Calculate statistics
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const inProgressProjects = projects.filter(p => p.status === 'In Progress').length;
  const totalRevenue = projects.reduce((sum, p) => sum + p.totalAmount, 0);

  // Load projects from database
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to get projects from database
        const dbProjects = await projectService.getAllProjects();
        
        if (dbProjects && dbProjects.length > 0) {
          console.log('✅ Loaded projects from database:', dbProjects.length);
          setProjects(dbProjects);
        } else {
          console.log('⚠️ No projects in database, using demo data');
          setProjects(demoProjects);
        }
      } catch (error) {
        console.error('❌ Error loading projects:', error);
        setError(error.message);
        // Fallback to demo data
        setProjects(demoProjects);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  useEffect(() => {
    let filtered = projects;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    // Apply status filter
    if (selectedStatus) {
      filtered = filtered.filter(project => project.status === selectedStatus);
    }

    // Apply priority filter
    if (selectedPriority) {
      filtered = filtered.filter(project => project.priority === selectedPriority);
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedCategory, selectedStatus, selectedPriority]);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleAddProject = async (newProject) => {
    try {
      const projectData = {
        ...newProject,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        progress: 0,
        milestones: []
      };

      // Save to database
      const savedProject = await projectService.createProject(projectData);
      
      // Add to local state
      setProjects([...projects, savedProject]);
      setShowAddModal(false);
      showNotification('Project added successfully!');
    } catch (error) {
      console.error('Error adding project:', error);
      showNotification('Failed to add project: ' + error.message, 'error');
    }
  };



  const handleUpdateProject = async (projectId, updatedProject) => {
    try {
      if (updatedProject === null) {
        // Project was deleted
        setProjects(projects.filter(p => p.id !== projectId));
        showNotification('Project deleted successfully!');
      } else {
        // Project was updated
        const updatedProjectFromDB = await projectService.updateProject(projectId, updatedProject);
        setProjects(projects.map(p => p.id === projectId ? updatedProjectFromDB : p));
        showNotification('Project updated successfully!');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      showNotification('Failed to update project: ' + error.message, 'error');
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Sidebar />
      
      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="modern-header sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-primary">Projects Management</h1>
                <p className="text-sm text-secondary">Manage all your projects and track progress</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="modern-button flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Statistics Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="glass-card p-4 glass-card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary">Total Projects</p>
                  <p className="text-2xl font-bold text-primary">{totalProjects}</p>
                </div>
                <div className="icon-container">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </div>
            
            <div className="glass-card p-4 glass-card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary">Completed</p>
                  <p className="text-2xl font-bold text-green-400">{completedProjects}</p>
                </div>
                <div className="icon-container">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
              </div>
            </div>
            
            <div className="glass-card p-4 glass-card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary">In Progress</p>
                  <p className="text-2xl font-bold text-blue-400">{inProgressProjects}</p>
                </div>
                <div className="icon-container">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </div>
            
            <div className="glass-card p-4 glass-card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary">Total Revenue</p>
                  <p className="text-2xl font-bold text-primary">${totalRevenue.toLocaleString()}</p>
                </div>
                <div className="icon-container">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="enhanced-card p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="modern-input pl-10 w-full"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="modern-select w-full"
                >
                  <option value="">All Categories</option>
                  {projectCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="modern-select w-full"
                >
                  <option value="">All Statuses</option>
                  {projectStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Priority</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="modern-select w-full"
                >
                  <option value="">All Priorities</option>
                  {projectPriorities.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                    setSelectedStatus('');
                    setSelectedPriority('');
                  }}
                  className="modern-button-secondary w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Projects Table */}
          {loading ? (
            <div className="glass-card p-6 text-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white">Loading projects...</p>
            </div>
          ) : error ? (
            <div className="glass-card p-6 text-center">
              <p className="text-red-400 text-lg font-semibold">Error: {error}</p>
              <p className="text-white text-sm mt-2">Using fallback data</p>
            </div>
          ) : (
            <ProjectsTable
              projects={filteredProjects}
              onUpdateProject={handleUpdateProject}
              activeFilter={null}
              currentMonth="August 2025"
            />
          )}
        </main>
      </div>
      
      {/* Add Project Modal */}
      <AddProjectModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddProject}
      />
      
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg backdrop-blur-lg border ${
          notification.type === 'success' 
            ? 'bg-green-500 bg-opacity-20 border-green-400 text-green-100' 
            : 'bg-red-500 bg-opacity-20 border-red-400 text-red-100'
        }`}>
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-3 ${
              notification.type === 'success' ? 'bg-green-400' : 'bg-red-400'
            }`}></div>
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
