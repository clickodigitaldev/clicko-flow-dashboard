import React, { useState } from 'react';
import { Search, CheckCircle, Send, MoreVertical, Edit, Trash2, Eye, MessageSquare, ArrowRight } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import EditProjectModal from './EditProjectModal';

const ProjectsTable = ({ projects, onUpdateProject, activeFilter, currentMonth }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('expectedCompletion');
  const [sortOrder, setSortOrder] = useState('asc');
  const [openActionMenu, setOpenActionMenu] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Filter projects to show only current month
  const currentMonthProjects = projects.filter(project => 
    project.monthOfPayment === currentMonth
  );

  // Filter projects
  const filteredProjects = currentMonthProjects.filter(project => {
    const matchesSearch = project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.projectName && project.projectName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || project.priority === priorityFilter;
    
    // Apply active filter from alerts
    let matchesActiveFilter = true;
    if (activeFilter) {
      const daysToCompletion = differenceInDays(new Date(project.expectedCompletion), new Date());
      
      switch (activeFilter) {
        case 'overdue':
          matchesActiveFilter = daysToCompletion < 0 && project.status !== 'Completed';
          break;
        case 'dueSoon':
          matchesActiveFilter = daysToCompletion <= 3 && daysToCompletion >= 0 && project.status !== 'Completed';
          break;
        case 'noDeposit':
          matchesActiveFilter = project.depositPaid === 0 && project.status !== 'Completed';
          break;
        case 'partialDeposit':
          matchesActiveFilter = project.depositPaid > 0 && project.depositPaid < project.totalAmount && project.status !== 'Completed';
          break;
        default:
          matchesActiveFilter = true;
      }
    }
    
    return matchesSearch && matchesStatus && matchesPriority && matchesActiveFilter;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'expectedCompletion':
        aValue = new Date(a.expectedCompletion);
        bValue = new Date(b.expectedCompletion);
        break;
      case 'depositDate':
        aValue = a.depositDate ? new Date(a.depositDate) : new Date(0);
        bValue = b.depositDate ? new Date(b.depositDate) : new Date(0);
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'priority':
        aValue = a.priority;
        bValue = b.priority;
        break;
      default:
        aValue = a[sortBy];
        bValue = b[sortBy];
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getStatusClass = (project) => {
    const daysToCompletion = differenceInDays(new Date(project.expectedCompletion), new Date());
    
    if (project.status === 'Completed') return 'status-completed';
    if (project.status === 'Pending' && project.depositPaid === 0) return 'status-overdue';
    if (daysToCompletion <= 3) return 'status-pending';
    return 'status-progress';
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const handleCheckStatus = (project) => {
    alert(`Checking status for ${project.clientName} - Project ${project.id}`);
    setOpenActionMenu(null);
  };

  const handlePushProject = (project) => {
    alert(`Pushing project ${project.id} to next phase`);
    setOpenActionMenu(null);
  };

  const handleSendReminder = (project) => {
    alert(`Payment reminder sent to ${project.clientName} for project ${project.id}`);
    setOpenActionMenu(null);
  };

  const handleFollowup = (project) => {
    alert(`Follow-up scheduled for ${project.clientName} - Project ${project.id}`);
    setOpenActionMenu(null);
  };

  const handleComplete = (project) => {
    onUpdateProject(project.id, {
      ...project,
      status: 'Completed',
      actualCompletion: format(new Date(), 'yyyy-MM-dd'),
      progress: 100
    });
    setOpenActionMenu(null);
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setEditModalOpen(true);
    setOpenActionMenu(null);
  };

  const handleProjectUpdate = (updatedProject) => {
    if (updatedProject === null) {
      // Project was deleted
      onUpdateProject(selectedProject.id, null);
    } else {
      // Project was updated
      onUpdateProject(updatedProject.id, updatedProject);
    }
  };

  const handleDelete = (project) => {
    if (window.confirm(`Are you sure you want to delete project "${project.projectName}"?`)) {
      onUpdateProject(project.id, null);
    }
    setOpenActionMenu(null);
  };

  const toggleActionMenu = (projectId) => {
    setOpenActionMenu(openActionMenu === projectId ? null : projectId);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (openActionMenu && !event.target.closest('.action-menu-container')) {
        setOpenActionMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openActionMenu]);

  return (
    <div className="glass-card animate-fade-in-up">
      {/* Filters */}
      <div className="p-6 border-b border-white border-opacity-20">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white opacity-60 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by client, project ID, or project name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="modern-input w-full pl-12 pr-4"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="modern-select"
          >
            <option value="All">All Status</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="modern-select"
          >
            <option value="All">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto overflow-y-visible relative z-10">
        <table className="w-full modern-table">
          <thead>
            <tr className="border-b border-white border-opacity-20">
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:text-opacity-80 transition-colors w-20" onClick={() => handleSort('id')}>
                <div className="flex items-center space-x-2">
                  <span>ID</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-white opacity-60"></div>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-48">
                PROJECT
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:text-opacity-80 transition-colors w-32" onClick={() => handleSort('totalAmount')}>
                TOTAL AMOUNT
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-32">
                DEPOSIT PAID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-32">
                REMAINING
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:text-opacity-80 transition-colors w-32" onClick={() => handleSort('expectedCompletion')}>
                DUE DATE
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:text-opacity-80 transition-colors w-24" onClick={() => handleSort('status')}>
                STATUS
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-24">
                PROGRESS
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:text-opacity-80 transition-colors w-24" onClick={() => handleSort('priority')}>
                PRIORITY
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-24">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white divide-opacity-10">
            {sortedProjects.map((project, index) => {
              const remainingPayment = project.totalAmount - project.depositPaid;
              
              return (
                <tr key={project.id} className="hover:bg-white hover:bg-opacity-5 transition-all duration-200 group relative">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-white opacity-60"></div>
                      <span className="text-sm font-medium text-white">{project.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">{project.projectName || 'N/A'}</div>
                      <div className="text-xs text-white opacity-60">{project.clientName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-white">${project.totalAmount.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-white opacity-90">${project.depositPaid.toLocaleString()}</div>
                      <div className="text-xs text-white opacity-60">
                        {project.depositDate ? format(new Date(project.depositDate), 'MMM dd, yyyy') : 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-white">${remainingPayment.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-white opacity-90">{format(new Date(project.expectedCompletion), 'MMM dd, yyyy')}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`status-badge ${getStatusClass(project)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-700 rounded-full h-2 mr-2">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full" 
                          style={{ width: `${project.progress || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-secondary">{project.progress || 0}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`status-badge ${getPriorityClass(project.priority)}`}>
                      {project.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative action-menu-container" style={{ zIndex: 9999, isolation: 'isolate' }}>
                      <button 
                        onClick={() => toggleActionMenu(project.id)}
                        className="action-button"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {openActionMenu === project.id && (
                        <div className="action-dropdown absolute w-56 bg-gray-800 rounded-lg shadow-xl border border-white border-opacity-20 backdrop-blur-lg"
                             style={{ 
                               position: 'absolute',
                               zIndex: 999999,
                               boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
                               top: '100%',
                               right: '0',
                               marginTop: '0.5rem'
                             }}>
                          <div className="py-2">
                            <button 
                              onClick={() => handleCheckStatus(project)}
                              className="flex items-center w-full px-4 py-3 text-sm text-secondary hover:bg-white hover:bg-opacity-10 transition-colors"
                            >
                              <Eye className="w-4 h-4 mr-3" />
                              Check Status
                            </button>
                            <button 
                              onClick={() => handlePushProject(project)}
                              className="flex items-center w-full px-4 py-3 text-sm text-secondary hover:bg-white hover:bg-opacity-10 transition-colors"
                            >
                              <ArrowRight className="w-4 h-4 mr-3" />
                              Push Project
                            </button>
                            <button 
                              onClick={() => handleSendReminder(project)}
                              className="flex items-center w-full px-4 py-3 text-sm text-secondary hover:bg-white hover:bg-opacity-10 transition-colors"
                            >
                              <Send className="w-4 h-4 mr-3" />
                              Send Reminder
                            </button>
                            <button 
                              onClick={() => handleFollowup(project)}
                              className="flex items-center w-full px-4 py-3 text-sm text-secondary hover:bg-white hover:bg-opacity-10 transition-colors"
                            >
                              <MessageSquare className="w-4 h-4 mr-3" />
                              Followup
                            </button>
                            {project.status !== 'Completed' && (
                              <button 
                                onClick={() => handleComplete(project)}
                                className="flex items-center w-full px-4 py-3 text-sm text-green-400 hover:bg-white hover:bg-opacity-10 transition-colors"
                              >
                                <CheckCircle className="w-4 h-4 mr-3" />
                                Complete
                              </button>
                            )}
                            <div className="border-t border-white border-opacity-20 my-1"></div>
                            <button 
                              onClick={() => handleEdit(project)}
                              className="flex items-center w-full px-4 py-3 text-sm text-secondary hover:bg-white hover:bg-opacity-10 transition-colors"
                            >
                              <Edit className="w-4 h-4 mr-3" />
                              Edit Project
                            </button>
                            <button 
                              onClick={() => handleDelete(project)}
                              className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:bg-white hover:bg-opacity-10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 mr-3" />
                              Delete Project
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Project Modal */}
      <EditProjectModal
        project={selectedProject}
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedProject(null);
        }}
        onUpdate={handleProjectUpdate}
      />
    </div>
  );
};

export default ProjectsTable;
