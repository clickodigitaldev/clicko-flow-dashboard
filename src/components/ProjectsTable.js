import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';
import projectService from '../services/projectService';
import EditProjectModal from './EditProjectModal';
import AddDepositModal from './AddDepositModal';
import { format, differenceInDays } from 'date-fns';

const ProjectsTable = ({ projects, onUpdateProject, activeFilter, currentMonth }) => {
  const { formatCurrency, convertFromBase } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortField, setSortField] = useState('projectId');
  const [sortDirection, setSortDirection] = useState('asc');
  const [activeActionMenu, setActiveActionMenu] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addDepositModalOpen, setAddDepositModalOpen] = useState(false);
  const [selectedProjectForDeposit, setSelectedProjectForDeposit] = useState(null);
  const actionMenuRef = useRef();

  // Filter projects based on search term, filters, and active filter
  const filteredProjects = projects.filter(project => {
    // First apply current month filter if provided
    let matchesMonth = true;
    if (currentMonth) {
      matchesMonth = project.monthOfPayment === currentMonth;
    }
    
    // Apply search and basic filters
    const matchesSearch = searchTerm === '' || 
      project.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || project.priority === priorityFilter;
    
    // Apply active filter from alerts if provided
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
    
    return matchesMonth && matchesSearch && matchesStatus && matchesPriority && matchesActiveFilter;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortField) {
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
        aValue = a[sortField];
        bValue = b[sortField];
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
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

  const handleProjectUpdate = (updatedProject) => {
    if (updatedProject === null) {
      // Project was deleted
      onUpdateProject(selectedProject.projectId, null);
    } else {
      // Project was updated
      onUpdateProject(selectedProject.projectId, updatedProject);
    }
    setEditModalOpen(false);
    setSelectedProject(null);
  };

  const handleDepositUpdate = (updatedProject) => {
    if (updatedProject) {
      // Project was updated with new deposit
      onUpdateProject(updatedProject.projectId, updatedProject);
    }
    setAddDepositModalOpen(false);
    setSelectedProjectForDeposit(null);
  };

  const handleCheckStatus = (project) => {
    alert(`Checking status for ${project.clientName} - Project ${project.projectId}`);
    setActiveActionMenu(null);
  };

  const handlePushProject = (project) => {
    alert(`Pushing project ${project.projectId} to next phase`);
    setActiveActionMenu(null);
  };

  const handleSendReminder = (project) => {
    alert(`Payment reminder sent to ${project.clientName} for project ${project.projectId}`);
    setActiveActionMenu(null);
  };

  const handleFollowupComplete = (project) => {
    alert(`Follow-up completed for ${project.clientName} - Project ${project.projectId}`);
    setActiveActionMenu(null);
  };

  const handleAddDeposit = (project) => {
    // This will open a modal for adding deposit
    setSelectedProjectForDeposit(project);
    setAddDepositModalOpen(true);
    setActiveActionMenu(null);
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setEditModalOpen(true);
    setActiveActionMenu(null);
  };

  const handleDelete = async (project) => {
    if (window.confirm(`Are you sure you want to delete project ${project.projectId}?`)) {
      try {
        // Call the delete API using projectService
        await projectService.deleteProject(project._id);
        
        // Remove from local state
        onUpdateProject(project.projectId, null);
        alert(`Project ${project.projectId} deleted successfully`);
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Error deleting project');
      }
    }
    setActiveActionMenu(null);
  };

  const handleComplete = (project) => {
    if (window.confirm(`Are you sure you want to mark project ${project.projectId} as completed?`)) {
      try {
        // Call the update API to mark as completed
        projectService.updateProject(project._id, { status: 'Completed' });
        onUpdateProject(project.projectId, { ...project, status: 'Completed' });
        alert(`Project ${project.projectId} marked as completed successfully`);
      } catch (error) {
        console.error('Error completing project:', error);
        alert('Error completing project');
      }
    }
    setActiveActionMenu(null);
  };

  const toggleActionMenu = (projectId) => {
    if (activeActionMenu === projectId) {
      setActiveActionMenu(null);
    } else {
      setActiveActionMenu(projectId);
    }
  };

  const handleActionClick = (action, project) => {
    switch (action) {
      case 'check-status':
        handleCheckStatus(project);
        break;
      case 'push-project':
        handlePushProject(project);
        break;
      case 'send-reminder':
        handleSendReminder(project);
        break;
      case 'followup-complete':
        handleFollowupComplete(project);
        break;
      case 'add-deposit':
        handleAddDeposit(project);
        break;
      case 'complete':
        handleComplete(project);
        break;
      case 'edit':
        handleEdit(project);
        break;
      case 'delete':
        handleDelete(project);
        break;
      default:
        console.log('🔄 Unknown action:', action);
    }
    
    setActiveActionMenu(null);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is on the three-dot button or inside the action menu
      const isClickOnButton = actionMenuRef.current && actionMenuRef.current.contains(event.target);
      const isClickOnMenu = event.target.closest('.action-menu');
      
      if (!isClickOnButton && !isClickOnMenu) {
        setActiveActionMenu(null);
      }
    };

    // Add event listener with higher priority
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('click', handleClickOutside, true);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <>
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
                className="search-input"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Status</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white border-opacity-20">
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:text-opacity-80 transition-colors w-20" onClick={() => handleSort('projectId')}>
                ID
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
              // Convert amounts from base currency to current currency for display
              const totalAmount = convertFromBase(project.totalAmountInBase || project.totalAmount || 0);
              const depositPaid = convertFromBase(project.depositPaidInBase || project.depositPaid || 0);
              const remainingPayment = totalAmount - depositPaid;
              
              return (
                <tr key={project.projectId} className="hover:bg-white hover:bg-opacity-5 transition-all duration-200">
                  <td className="px-4 py-4 whitespace-nowrap w-20">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-white opacity-60"></div>
                      <span className="text-sm font-medium text-white">{project.projectId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">{project.projectName || 'N/A'}</div>
                      <div className="text-xs text-white opacity-60">{project.clientName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-white">{formatCurrency(totalAmount)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-white opacity-90">{formatCurrency(depositPaid)}</div>
                      <div className="text-xs text-white opacity-60">
                        {project.depositDate ? format(new Date(project.depositDate), 'MMM dd, yyyy') : 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-white">{formatCurrency(remainingPayment)}</span>
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
                          style={{ width: `${Math.round(project.progress || 0)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-secondary">{Math.round(project.progress || 0)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`status-badge ${getPriorityClass(project.priority)}`}>
                      {project.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative" ref={actionMenuRef}>
                      <button 
                        onClick={() => toggleActionMenu(project.projectId)}
                        className="p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors text-white"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {activeActionMenu === project.projectId && (
                        <div className="action-menu absolute right-0 top-full mt-2 w-64 z-50 glass-card border border-white border-opacity-30 backdrop-blur-md bg-black bg-opacity-90 shadow-2xl rounded-lg">
                          <div className="py-2">
                            <button
                              onClick={() => handleActionClick('check-status', project)}
                              className="flex items-center w-full px-3 py-2.5 text-left hover:bg-white hover:bg-opacity-10 transition-all duration-200 text-white"
                            >
                              <div className="w-8 h-8 rounded-lg bg-blue-500 bg-opacity-30 flex items-center justify-center mr-3 border border-blue-400 border-opacity-30">
                                <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <span className="text-sm font-medium">Check Status</span>
                            </button>
                            
                            <button
                              onClick={() => handleActionClick('push-project', project)}
                              className="flex items-center w-full px-3 py-2.5 text-left hover:bg-white hover:bg-opacity-10 transition-all duration-200 text-white"
                            >
                              <div className="w-8 h-8 rounded-lg bg-green-500 bg-opacity-30 flex items-center justify-center mr-3 border border-green-400 border-opacity-30">
                                <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                              </div>
                              <span className="text-sm font-medium">Push Project</span>
                            </button>
                            
                            <button
                              onClick={() => handleActionClick('send-reminder', project)}
                              className="flex items-center w-full px-3 py-2.5 text-left hover:bg-white hover:bg-opacity-10 transition-all duration-200 text-white"
                            >
                              <div className="w-8 h-8 rounded-lg bg-yellow-500 bg-opacity-30 flex items-center justify-center mr-3 border border-yellow-400 border-opacity-30">
                                <svg className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7H4v5l5-5z" />
                                </svg>
                              </div>
                              <span className="text-sm font-medium">Send Reminder</span>
                            </button>
                            
                            <button
                              onClick={() => handleActionClick('followup-complete', project)}
                              className="flex items-center w-full px-3 py-2.5 text-left hover:bg-white hover:bg-opacity-10 transition-all duration-200 text-white"
                            >
                              <div className="w-8 h-8 rounded-lg bg-purple-500 bg-opacity-30 flex items-center justify-center mr-3 border border-purple-400 border-opacity-30">
                                <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                              </div>
                              <span className="text-sm font-medium">Followup Complete</span>
                            </button>
                            
                            <button
                              onClick={() => handleActionClick('add-deposit', project)}
                              className="flex items-center w-full px-3 py-2.5 text-left hover:bg-white hover:bg-opacity-10 transition-all duration-200 text-white"
                            >
                              <div className="w-8 h-8 rounded-lg bg-emerald-500 bg-opacity-30 flex items-center justify-center mr-3 border border-emerald-400 border-opacity-30">
                                <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                              </div>
                              <span className="text-sm font-medium">Add Deposit</span>
                            </button>
                            
                            <div className="border-t border-white border-opacity-20 my-2"></div>
                            
                            <button
                              onClick={() => handleActionClick('complete', project)}
                              className="flex items-center w-full px-3 py-2.5 text-left hover:bg-white hover:bg-opacity-10 transition-all duration-200 text-white"
                            >
                              <div className="w-8 h-8 rounded-lg bg-green-600 bg-opacity-30 flex items-center justify-center mr-3 border border-green-500 border-opacity-30">
                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <span className="text-sm font-medium">Complete</span>
                            </button>
                            
                            <button
                              onClick={() => handleActionClick('edit', project)}
                              className="flex items-center w-full px-3 py-2.5 text-left hover:bg-white hover:bg-opacity-10 transition-all duration-200 text-white"
                            >
                              <div className="w-8 h-8 rounded-lg bg-blue-600 bg-opacity-30 flex items-center justify-center mr-3 border border-blue-500 border-opacity-30">
                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </div>
                              <span className="text-sm font-medium">Edit</span>
                            </button>
                            
                            <button
                              onClick={() => handleActionClick('delete', project)}
                              className="flex items-center w-full px-3 py-2.5 text-left hover:bg-white hover:bg-opacity-10 transition-all duration-200 text-white"
                            >
                              <div className="w-8 h-8 rounded-lg bg-red-500 bg-opacity-30 flex items-center justify-center mr-3 border border-red-400 border-opacity-30">
                                <svg className="w-5 h-5 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </div>
                              <span className="text-sm font-medium text-red-300">Delete</span>
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
      
      {/* Modals - Outside main container for proper overlay rendering */}
      
      {editModalOpen && selectedProject && (
        <div className="modal-overlay">
          <div className="modal-content">
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
        </div>
      )}
      
      {addDepositModalOpen && selectedProjectForDeposit && (
        <div className="modal-overlay">
          <div className="modal-content">
            <AddDepositModal
              project={selectedProjectForDeposit}
              isOpen={addDepositModalOpen}
              onClose={() => {
                setAddDepositModalOpen(false);
                setSelectedProjectForDeposit(null);
              }}
              onUpdate={handleDepositUpdate}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectsTable;
