import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, CheckCircle, Clock, Send, DollarSign } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

const ProjectsTable = ({ projects, onUpdateProject, activeFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('expectedCompletion');
  const [sortOrder, setSortOrder] = useState('asc');

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.id.toLowerCase().includes(searchTerm.toLowerCase());
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

  const handleSendReminder = (project) => {
    alert(`Payment reminder sent to ${project.clientName} for project ${project.id}`);
  };

  const handleMarkDepositPaid = (project) => {
    const amount = prompt(`Enter deposit amount for ${project.clientName}:`, project.totalAmount / 2);
    if (amount && !isNaN(amount)) {
      onUpdateProject(project.id, {
        ...project,
        depositPaid: parseFloat(amount),
        depositDate: format(new Date(), 'yyyy-MM-dd')
      });
    }
  };

  const handleMarkComplete = (project) => {
    onUpdateProject(project.id, {
      ...project,
      status: 'Completed'
    });
  };

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
                placeholder="Search by client or project ID..."
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
      <div className="overflow-x-auto">
        <table className="w-full modern-table">
          <thead>
            <tr className="border-b border-white border-opacity-20">
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:text-opacity-80 transition-colors w-32" onClick={() => handleSort('id')}>
                <div className="flex items-center space-x-2">
                  <span>Project ID</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-white opacity-60"></div>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-48">
                Client
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:text-opacity-80 transition-colors w-32" onClick={() => handleSort('totalAmount')}>
                Total Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-32">
                Deposit Paid
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-32">
                Remaining
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:text-opacity-80 transition-colors w-40" onClick={() => handleSort('expectedCompletion')}>
                Expected Completion
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:text-opacity-80 transition-colors w-32" onClick={() => handleSort('status')}>
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:text-opacity-80 transition-colors w-32" onClick={() => handleSort('priority')}>
                Priority
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-32">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white divide-opacity-10">
            {sortedProjects.map((project, index) => {
              const daysToCompletion = differenceInDays(new Date(project.expectedCompletion), new Date());
              const remainingPayment = project.totalAmount - project.depositPaid;
              
              return (
                <tr key={project.id} className="hover:bg-white hover:bg-opacity-5 transition-all duration-200 group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-white opacity-60"></div>
                      <span className="text-sm font-medium text-white">{project.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-white opacity-90">{project.clientName}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-white">${project.totalAmount.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-white opacity-90">${project.depositPaid.toLocaleString()}</span>
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
                    <span className={`status-badge ${getPriorityClass(project.priority)}`}>
                      {project.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {project.depositPaid === 0 && (
                        <button
                          onClick={() => handleSendReminder(project)}
                          className="action-button blue"
                          title="Send Payment Reminder"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                      {project.depositPaid < project.totalAmount && (
                        <button
                          onClick={() => handleMarkDepositPaid(project)}
                          className="action-button green"
                          title="Mark Deposit Paid"
                        >
                          <DollarSign className="w-4 h-4" />
                        </button>
                      )}
                      {project.status !== 'Completed' && (
                        <button
                          onClick={() => handleMarkComplete(project)}
                          className="action-button purple"
                          title="Mark Complete"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {daysToCompletion <= 3 && project.status !== 'Completed' && (
                        <span className="action-button orange" title="Due within 3 days">
                          <AlertTriangle className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectsTable;
