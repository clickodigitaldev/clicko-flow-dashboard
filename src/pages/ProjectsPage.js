import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, Calendar, DollarSign, Users, Target } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';
import projectService from '../services/projectService';
import ProjectsTable from '../components/ProjectsTable';
import AddProjectModal from '../components/AddProjectModal';
import { isProjectVisibleInMonth } from '../utils/forecastUtils';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [currentMonth, setCurrentMonth] = useState('August 2025');
  const { formatCurrency } = useCurrency();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, statusFilter, priorityFilter, currentMonth]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProjects();
      console.log('✅ Loaded projects from database:', data.length);
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    // Filter by current month (start date OR due date)
    filtered = filtered.filter(project => isProjectVisibleInMonth(project, currentMonth));

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.projectId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    // Filter by priority
    if (priorityFilter) {
      filtered = filtered.filter(project => project.priority === priorityFilter);
    }

    setFilteredProjects(filtered);
  };

  const handleAddProject = async (newProject) => {
    try {
      const addedProject = await projectService.addProject(newProject);
      setProjects([...projects, addedProject]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const handleUpdateProject = async (projectId, updatedProject) => {
    try {
      if (updatedProject === null) {
        // Project was deleted
        setProjects(projects.filter(p => p.projectId !== projectId));
      } else {
        // Project was updated
        // Use Mongo _id for API update to match backend expectations
        const updatedProjectFromDB = await projectService.updateProject(updatedProject._id, updatedProject);
        setProjects(projects.map(p => p.projectId === projectId ? updatedProjectFromDB : p));
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  // Calculate summary statistics for current month
  const currentMonthProjects = projects.filter(p => isProjectVisibleInMonth(p, currentMonth));
  const totalProjects = currentMonthProjects.length;
  const completedProjects = currentMonthProjects.filter(p => p.status === 'Completed').length;
  const totalValue = currentMonthProjects.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
  const totalDeposits = currentMonthProjects.reduce((sum, p) => sum + (p.depositPaid || 0), 0);

  if (loading) {
    return (
      <div className="page-container gradient-bg">
        <div className="main-content">
          <div className="flex items-center justify-center h-screen">
            <div className="text-white text-xl">Loading projects...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container gradient-bg">
      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="modern-header sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-primary">Projects</h1>
                <p className="text-sm text-secondary">Manage and track your projects</p>
              </div>
              <div className="flex items-center space-x-6">
                <select
                  value={currentMonth}
                  onChange={(e) => setCurrentMonth(e.target.value)}
                  className="modern-select min-w-[140px]"
                >
                  <option value="August 2025">August 2025</option>
                  <option value="September 2025">September 2025</option>
                  <option value="October 2025">October 2025</option>
                  <option value="November 2025">November 2025</option>
                  <option value="December 2025">December 2025</option>
                  <option value="January 2026">January 2026</option>
                </select>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="modern-button-primary flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 py-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white opacity-70">Total Projects</p>
                  <p className="text-2xl font-bold text-white">{totalProjects}</p>
                </div>
                <div className="p-3 bg-blue-500 bg-opacity-20 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white opacity-70">Completed</p>
                  <p className="text-2xl font-bold text-white">{completedProjects}</p>
                </div>
                <div className="p-3 bg-green-500 bg-opacity-20 rounded-lg">
                  <Target className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white opacity-70">Total Value</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(totalValue)}</p>
                </div>
                <div className="p-3 bg-purple-500 bg-opacity-20 rounded-lg">
                  <DollarSign className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white opacity-70">Deposits</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(totalDeposits)}</p>
                </div>
                <div className="p-3 bg-green-500 bg-opacity-20 rounded-lg">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="glass-card p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white opacity-60 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="modern-input w-full pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="lg:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="modern-select w-full"
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div className="lg:w-48">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="modern-select w-full"
                >
                  <option value="">All Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              {/* Filter Icon */}
              <div className="flex items-center">
                <Filter className="w-5 h-5 text-white opacity-60" />
              </div>
            </div>
          </div>

          {/* Projects Table */}
          {filteredProjects.length > 0 ? (
            <div>
              <ProjectsTable
                projects={filteredProjects}
                onUpdateProject={handleUpdateProject}
                activeFilter={null}
                currentMonth={currentMonth}
              />
            </div>
          ) : (
            <div className="glass-card p-12 text-center">
              <div className="text-white opacity-60 mb-4">
                <Calendar className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
              <p className="text-white opacity-70 mb-6">
                {searchTerm || statusFilter || priorityFilter 
                  ? 'Try adjusting your filters or search terms.'
                  : `No projects for ${currentMonth}. Add a new project to get started.`
                }
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="modern-button-primary"
              >
                Add Your First Project
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <AddProjectModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddProject}
        />
      )}
    </div>
  );
};

export default ProjectsPage;
