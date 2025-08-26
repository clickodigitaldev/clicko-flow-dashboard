import React, { useState, useEffect } from 'react';
import { differenceInDays } from 'date-fns';

import Sidebar from './Sidebar';
import SummaryCards from './SummaryCards';
import ProjectsTable from './ProjectsTable';
import AlertsSection from './AlertsSection';
import Charts from './Charts';
import CurrencySwitcher from './CurrencySwitcher';
import { getFinancialSummary } from '../utils/forecastUtils';
import projectService from '../services/projectService';
import { useCurrency } from '../contexts/CurrencyContext';

const Dashboard = () => {
  const { formatCurrency, convertFromBase } = useCurrency();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState('August 2025');
  const [activeFilter, setActiveFilter] = useState(null);
  const [settings] = useState({
    monthlyTarget: 150000,
    breakEvenTarget: 80000,
    overheadExpenses: 50000,
    generalExpenses: 30000
  });

  // Load projects from database
  useEffect(() => {
    const loadProjects = async () => {
      try {
        console.log('🔄 Loading projects from database...');
        setLoading(true);
        const projectsData = await projectService.getAllProjects();
        console.log('📊 Projects loaded:', projectsData?.length || 0, 'projects');
        setProjects(projectsData || []);
      } catch (error) {
        console.error('❌ Error loading projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const handleUpdateProject = (projectId, updatedProject) => {
    if (updatedProject === null) {
      // Project was deleted, remove it from the array
      setProjects(projects.filter(p => p.projectId !== projectId));
    } else {
      // Project was updated, replace it in the array
      setProjects(projects.map(p => p.projectId === projectId ? updatedProject : p));
    }
  };

  const financialSummary = getFinancialSummary(projects, currentMonth, settings);

  if (loading) {
    return (
      <div className="page-container gradient-bg">
        <Sidebar />
        <div className="main-content">
          <div className="flex items-center justify-center h-screen">
            <div className="text-white text-xl">Loading dashboard data...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container gradient-bg">
      <Sidebar />
      
      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="modern-header sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
                <p className="text-sm text-secondary">Overview of your business performance</p>
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
                <CurrencySwitcher />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 py-4">
          {/* Summary Cards - Keep the original style */}
          <SummaryCards 
            projects={projects} 
            currentMonth={currentMonth} 
            settings={settings}
          />

          {/* Charts Section */}
          <div className="mt-8 mb-6">
            <Charts 
              projects={projects} 
              currentMonth={currentMonth}
              financialSummary={financialSummary}
            />
          </div>

          {/* Alerts Section */}
          <div className="mt-6 mb-6">
            <AlertsSection 
              projects={projects} 
              onUpdateProject={handleUpdateProject}
              onFilterChange={setActiveFilter}
              currentMonth={currentMonth}
            />
          </div>

          {/* Project Status Summary - Moved above Projects Overview table */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-primary">Project Status Overview</h2>
              {activeFilter && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-secondary">Filtered by:</span>
                  <span className="px-3 py-1 bg-blue-500 bg-opacity-20 text-blue-300 text-sm rounded-full border border-blue-400 border-opacity-30">
                    {activeFilter === 'overdue' && 'Overdue Projects'}
                    {activeFilter === 'dueSoon' && 'Due Soon Projects'}
                    {activeFilter === 'noDeposit' && 'No Deposit Projects'}
                    {activeFilter === 'partialDeposit' && 'Partial Deposit Projects'}
                  </span>
                  <button
                    onClick={() => setActiveFilter(null)}
                    className="text-xs text-secondary hover:text-white transition-colors"
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={() => setActiveFilter(activeFilter === 'overdue' ? null : 'overdue')}
                className={`glass-card glass-card-hover p-4 text-center animate-fade-in-up cursor-pointer transition-all duration-200 ${
                  activeFilter === 'overdue' ? 'ring-2 ring-red-400 bg-white bg-opacity-15' : ''
                }`}
              >
                <p className="text-2xl font-bold text-red-400">
                  {projects.filter(project => {
                    const daysToCompletion = differenceInDays(new Date(project.expectedCompletion), new Date());
                    return daysToCompletion < 0 && project.status !== 'Completed';
                  }).length}
                </p>
                <p className="text-sm text-white opacity-70">Overdue</p>
              </button>
              <button 
                onClick={() => setActiveFilter(activeFilter === 'dueSoon' ? null : 'dueSoon')}
                className={`glass-card glass-card-hover p-4 text-center animate-fade-in-up cursor-pointer transition-all duration-200 ${
                  activeFilter === 'dueSoon' ? 'ring-2 ring-yellow-400 bg-white bg-opacity-15' : ''
                }`}
              >
                <p className="text-2xl font-bold text-yellow-400">
                  {projects.filter(project => {
                    const daysToCompletion = differenceInDays(new Date(project.expectedCompletion), new Date());
                    return daysToCompletion <= 3 && daysToCompletion >= 0 && project.status !== 'Completed';
                  }).length}
                </p>
                <p className="text-sm text-white opacity-70">Due Soon</p>
              </button>
              <button 
                onClick={() => setActiveFilter(activeFilter === 'noDeposit' ? null : 'noDeposit')}
                className={`glass-card glass-card-hover p-4 text-center animate-fade-in-up cursor-pointer transition-all duration-200 ${
                  activeFilter === 'noDeposit' ? 'ring-2 ring-red-400 bg-white bg-opacity-15' : ''
                }`}
              >
                <p className="text-2xl font-bold text-red-400">
                  {projects.filter(project => 
                    project.depositPaid === 0 && project.status !== 'Completed'
                  ).length}
                </p>
                <p className="text-sm text-white opacity-70">No Deposit</p>
              </button>
              <button 
                onClick={() => setActiveFilter(activeFilter === 'partialDeposit' ? null : 'partialDeposit')}
                className={`glass-card glass-card-hover p-4 text-center animate-fade-in-up cursor-pointer transition-all duration-200 ${
                  activeFilter === 'partialDeposit' ? 'ring-2 ring-yellow-400 bg-white bg-opacity-15' : ''
                }`}
              >
                <p className="text-2xl font-bold text-yellow-400">
                  {projects.filter(project => 
                    project.depositPaid > 0 && project.depositPaid < project.totalAmount && project.status !== 'Completed'
                  ).length}
                </p>
                <p className="text-sm text-white opacity-70">Partial Deposit</p>
              </button>
            </div>
          </div>

          {/* Projects Table */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-primary">Projects Overview</h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-secondary">
                  Showing {projects.filter(p => p.monthOfPayment === currentMonth).length} projects for {currentMonth}
                </span>
              </div>
            </div>
            <div className="glass-card">
              <ProjectsTable 
                projects={projects} 
                onUpdateProject={handleUpdateProject} 
                activeFilter={activeFilter}
                currentMonth={currentMonth}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
