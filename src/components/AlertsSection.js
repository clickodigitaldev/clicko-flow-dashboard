import React, { useState } from 'react';
import { AlertTriangle, Clock, DollarSign, CheckCircle, X } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { useCurrency } from '../contexts/CurrencyContext';

const AlertsSection = ({ projects, onUpdateProject, onFilterChange, activeFilter }) => {
  const { formatCurrency, convertFromBase, currentCurrency } = useCurrency();
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositType, setDepositType] = useState('deposit');
  const [depositDescription, setDepositDescription] = useState('');
  
  // Get projects that need attention
  const overdueProjects = projects.filter(project => {
    const daysToCompletion = differenceInDays(new Date(project.expectedCompletion), new Date());
    return daysToCompletion < 0 && project.status !== 'Completed';
  });

  const dueSoonProjects = projects.filter(project => {
    const daysToCompletion = differenceInDays(new Date(project.expectedCompletion), new Date());
    return daysToCompletion <= 3 && daysToCompletion >= 0 && project.status !== 'Completed';
  });

  const noDepositProjects = projects.filter(project => 
    project.depositPaid === 0 && project.status !== 'Completed'
  );

  const partialDepositProjects = projects.filter(project => 
    project.depositPaid > 0 && project.depositPaid < project.totalAmount && project.status !== 'Completed'
  );

  const handleSendReminder = (project) => {
    // Show a modal instead of alert
    setSelectedProject(project);
    setDepositModalOpen(true);
    setDepositType('reminder');
    setDepositDescription('Payment reminder sent');
  };

  const handleMarkDepositPaid = (project) => {
    setSelectedProject(project);
    setDepositModalOpen(true);
    setDepositType('deposit');
    setDepositAmount('');
    setDepositDescription('');
  };

  const handleMarkComplete = (project) => {
    onUpdateProject(project.projectId, {
      ...project,
      status: 'Completed'
    });
  };

  const handleDepositSubmit = async () => {
    if (!selectedProject || !depositAmount || isNaN(depositAmount)) return;

    const amount = parseFloat(depositAmount);
    
    try {
      // Call the backend API to add payment
      const response = await fetch(`http://localhost:5001/api/projects/${selectedProject._id}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          amountCurrency: currentCurrency,
          type: depositType,
          description: depositDescription || `${depositType} payment`,
          date: new Date().toISOString()
        })
      });

      if (response.ok) {
        const updatedProject = await response.json();
        onUpdateProject(selectedProject.projectId, updatedProject);
        setDepositModalOpen(false);
        setSelectedProject(null);
        setDepositAmount('');
        setDepositDescription('');
      } else {
        console.error('Failed to add payment');
      }
    } catch (error) {
      console.error('Error adding payment:', error);
    }
  };

  const closeDepositModal = () => {
    setDepositModalOpen(false);
    setSelectedProject(null);
    setDepositAmount('');
    setDepositDescription('');
  };

  const AlertCard = ({ title, projects, icon, gradient, actionText, onAction, color }) => {
    if (projects.length === 0) return null;

    return (
      <div className={`glass-card glass-card-hover p-6 animate-fade-in-up border-l-4 ${gradient}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`icon-container ${gradient} text-white mr-3`}>
              {icon}
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <span className="ml-2 bg-white bg-opacity-20 text-white text-xs font-medium px-2.5 py-0.5 rounded-full backdrop-blur-sm">
              {projects.length}
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          {projects.slice(0, 3).map((project) => (
            <div key={project.projectId} className="flex items-center justify-between p-3 bg-white bg-opacity-5 rounded-lg backdrop-blur-sm border border-white border-opacity-10">
              <div>
                <p className="font-medium text-white">{project.clientName}</p>
                <p className="text-sm text-white opacity-70">{project.projectId} - {formatCurrency(convertFromBase(project.totalAmountInBase || project.totalAmount))}</p>
                {project.expectedCompletion && (
                  <p className="text-xs text-white opacity-50">
                    Due: {new Date(project.expectedCompletion).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                {onAction && (
                  <button
                    onClick={() => onAction(project)}
                    className="modern-button text-xs px-3 py-1"
                    style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)` }}
                  >
                    {actionText}
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
              </div>
            </div>
          ))}
          {projects.length > 3 && (
            <p className="text-sm text-white opacity-60 text-center">
              +{projects.length - 3} more projects
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="mb-8 animate-fade-in-up">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <div className="w-1 h-8 bg-gradient-to-b from-red-400 to-pink-600 rounded mr-3"></div>
          Alerts & Actions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AlertCard
            title="Overdue Projects"
            projects={overdueProjects}
            icon={<AlertTriangle className="w-5 h-5" />}
            gradient="border-red-500"
            actionText="Check Status"
            color="#ef4444"
            onAction={(project) => {
              // Show status check modal
              setSelectedProject(project);
              setDepositModalOpen(true);
              setDepositType('status');
              setDepositDescription('Status check completed');
            }}
          />

          <AlertCard
            title="Due Within 3 Days"
            projects={dueSoonProjects}
            icon={<Clock className="w-5 h-5" />}
            gradient="border-yellow-500"
            actionText="Push Project"
            color="#f59e0b"
            onAction={(project) => {
              // Show push project modal
              setSelectedProject(project);
              setDepositModalOpen(true);
              setDepositType('push');
              setDepositDescription('Project pushed to client');
            }}
          />

          <AlertCard
            title="No Deposit Received"
            projects={noDepositProjects}
            icon={<DollarSign className="w-5 h-5" />}
            gradient="border-red-500"
            actionText="Send Reminder"
            color="#ef4444"
            onAction={handleSendReminder}
          />

          <AlertCard
            title="Partial Deposits"
            projects={partialDepositProjects}
            icon={<DollarSign className="w-5 h-5" />}
            gradient="border-yellow-500"
            actionText="Follow Up"
            color="#f59e0b"
            onAction={(project) => {
              // Show follow up modal
              setSelectedProject(project);
              setDepositModalOpen(true);
              setDepositType('followup');
              setDepositDescription('Follow up completed');
            }}
          />
        </div>
      </div>

      {/* Deposit/Action Modal */}
      {depositModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {depositType === 'deposit' ? 'Add Deposit' : 
                 depositType === 'reminder' ? 'Send Reminder' :
                 depositType === 'status' ? 'Check Status' :
                 depositType === 'push' ? 'Push Project' :
                 depositType === 'followup' ? 'Follow Up' : 'Action'}
              </h3>
              <button
                onClick={closeDepositModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-300 mb-2">Project: {selectedProject.projectId}</p>
                <p className="text-sm text-gray-300 mb-2">Client: {selectedProject.clientName}</p>
                {depositType === 'deposit' && (
                  <>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Deposit Amount ({currentCurrency})
                    </label>
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter amount"
                    />
                  </>
                )}
                
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={depositDescription}
                  onChange={(e) => setDepositDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Enter description"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={closeDepositModal}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDepositSubmit}
                  disabled={depositType === 'deposit' && (!depositAmount || isNaN(depositAmount))}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                  {depositType === 'deposit' ? 'Add Deposit' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AlertsSection;
