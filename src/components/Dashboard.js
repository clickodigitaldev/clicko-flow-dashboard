import React, { useState, useEffect } from 'react';

import Sidebar from './Sidebar';
import SummaryCards from './SummaryCards';
import ProjectsTable from './ProjectsTable';
import AlertsSection from './AlertsSection';
import Charts from './Charts';
import { getFinancialSummary } from '../utils/forecastUtils';
import projectService from '../services/projectService';

const Dashboard = () => {
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
    setProjects(projects.map(p => p.id === projectId ? updatedProject : p));
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
              <div className="flex items-center space-x-4">
                <select
                  value={currentMonth}
                  onChange={(e) => setCurrentMonth(e.target.value)}
                  className="modern-select"
                >
                  <option value="August 2025">August 2025</option>
                  <option value="September 2025">September 2025</option>
                  <option value="October 2025">October 2025</option>
                  <option value="November 2025">November 2025</option>
                  <option value="December 2025">December 2025</option>
                  <option value="January 2026">January 2026</option>
                </select>
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

          {/* Alerts Section */}
          <div className="mt-6 mb-6">
            <AlertsSection 
              projects={projects} 
              onFilterChange={setActiveFilter}
              currentMonth={currentMonth}
            />
          </div>

          {/* Charts Section */}
          <div className="mb-6">
            <Charts 
              projects={projects} 
              currentMonth={currentMonth}
              financialSummary={financialSummary}
            />
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
            <ProjectsTable 
              projects={projects} 
              onUpdateProject={handleUpdateProject} 
              activeFilter={activeFilter}
              currentMonth={currentMonth}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
