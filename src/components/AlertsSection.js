import React from 'react';
import { AlertTriangle, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { differenceInDays } from 'date-fns';

const AlertsSection = ({ projects, onUpdateProject, onFilterClick, activeFilter }) => {
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
    alert(`Payment reminder sent to ${project.clientName} for project ${project.id}`);
  };

  const handleMarkDepositPaid = (project) => {
    const amount = prompt(`Enter deposit amount for ${project.clientName}:`, project.totalAmount / 2);
    if (amount && !isNaN(amount)) {
      onUpdateProject(project.id, {
        ...project,
        depositPaid: parseFloat(amount),
        depositDate: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handleMarkComplete = (project) => {
    onUpdateProject(project.id, {
      ...project,
      status: 'Completed'
    });
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
            <div key={project.id} className="flex items-center justify-between p-3 bg-white bg-opacity-5 rounded-lg backdrop-blur-sm border border-white border-opacity-10">
              <div>
                <p className="font-medium text-white">{project.clientName}</p>
                <p className="text-sm text-white opacity-70">{project.id} - ${project.totalAmount.toLocaleString()}</p>
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
          onAction={(project) => alert(`Checking status for ${project.clientName}`)}
        />

        <AlertCard
          title="Due Within 3 Days"
          projects={dueSoonProjects}
          icon={<Clock className="w-5 h-5" />}
          gradient="border-yellow-500"
          actionText="Push Project"
          color="#f59e0b"
          onAction={(project) => alert(`Pushing project for ${project.clientName}`)}
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
          onAction={(project) => alert(`Following up with ${project.clientName} for remaining payment`)}
        />
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <button 
          onClick={() => onFilterClick(activeFilter === 'overdue' ? null : 'overdue')}
          className={`glass-card glass-card-hover p-4 text-center animate-fade-in-up cursor-pointer transition-all duration-200 ${
            activeFilter === 'overdue' ? 'ring-2 ring-red-400 bg-white bg-opacity-15' : ''
          }`}
        >
          <p className="text-2xl font-bold text-red-400">{overdueProjects.length}</p>
          <p className="text-sm text-white opacity-70">Overdue</p>
        </button>
        <button 
          onClick={() => onFilterClick(activeFilter === 'dueSoon' ? null : 'dueSoon')}
          className={`glass-card glass-card-hover p-4 text-center animate-fade-in-up cursor-pointer transition-all duration-200 ${
            activeFilter === 'dueSoon' ? 'ring-2 ring-yellow-400 bg-white bg-opacity-15' : ''
          }`}
        >
          <p className="text-2xl font-bold text-yellow-400">{dueSoonProjects.length}</p>
          <p className="text-sm text-white opacity-70">Due Soon</p>
        </button>
        <button 
          onClick={() => onFilterClick(activeFilter === 'noDeposit' ? null : 'noDeposit')}
          className={`glass-card glass-card-hover p-4 text-center animate-fade-in-up cursor-pointer transition-all duration-200 ${
            activeFilter === 'noDeposit' ? 'ring-2 ring-red-400 bg-white bg-opacity-15' : ''
          }`}
        >
          <p className="text-2xl font-bold text-red-400">{noDepositProjects.length}</p>
          <p className="text-sm text-white opacity-70">No Deposit</p>
        </button>
        <button 
          onClick={() => onFilterClick(activeFilter === 'partialDeposit' ? null : 'partialDeposit')}
          className={`glass-card glass-card-hover p-4 text-center animate-fade-in-up cursor-pointer transition-all duration-200 ${
            activeFilter === 'partialDeposit' ? 'ring-2 ring-yellow-400 bg-white bg-opacity-15' : ''
          }`}
        >
          <p className="text-2xl font-bold text-yellow-400">{partialDepositProjects.length}</p>
          <p className="text-sm text-white opacity-70">Partial Deposit</p>
        </button>
      </div>
    </div>
  );
};

export default AlertsSection;
