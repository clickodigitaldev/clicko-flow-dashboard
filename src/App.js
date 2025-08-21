import React, { useState } from 'react';
import { Calendar, BarChart3, TrendingUp, Settings } from 'lucide-react';
import SummaryCards from './components/SummaryCards';
import Charts from './components/Charts';
import ProjectsTable from './components/ProjectsTable';
import AlertsSection from './components/AlertsSection';
import { demoProjects, cashFlowProjection } from './data/demoData';

function App() {
  const [projects, setProjects] = useState(demoProjects);
  const [currentMonth, setCurrentMonth] = useState('August 2025');
  const [activeFilter, setActiveFilter] = useState(null);

  const handleUpdateProject = (projectId, updatedProject) => {
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === projectId ? updatedProject : project
      )
    );
  };

  const months = ['August 2025', 'September 2025', 'October 2025'];

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="modern-header sticky top-0 z-50">
        <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="icon-container gradient-card-blue text-white mr-4">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Clicko Flow</h1>
                <p className="text-sm text-white opacity-70">Track deposits, payments & project completion</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={currentMonth}
                onChange={(e) => setCurrentMonth(e.target.value)}
                className="modern-select"
              >
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <button className="action-button">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <SummaryCards projects={projects} currentMonth={currentMonth} />

        {/* Charts */}
        <Charts projects={projects} cashFlowProjection={cashFlowProjection} />

        {/* Alerts Section */}
        <AlertsSection 
          projects={projects} 
          onUpdateProject={handleUpdateProject} 
          onFilterClick={setActiveFilter}
          activeFilter={activeFilter}
        />

        {/* Projects Table */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-600 rounded mr-3"></div>
              Projects Overview
              {activeFilter && (
                <span className="ml-3 text-sm text-white opacity-70 bg-white bg-opacity-10 px-3 py-1 rounded-full">
                  Filtered: {activeFilter}
                </span>
              )}
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white opacity-70">
                Total Projects: {projects.length}
              </span>
              {activeFilter && (
                <button 
                  onClick={() => setActiveFilter(null)}
                  className="modern-button text-sm"
                >
                  Clear Filter
                </button>
              )}
              <button className="modern-button">
                Add New Project
              </button>
            </div>
          </div>
          <ProjectsTable 
            projects={projects} 
            onUpdateProject={handleUpdateProject} 
            activeFilter={activeFilter}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="modern-header mt-12">
        <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-white opacity-70">
            <p>Clicko Flow - Demo Version</p>
            <p className="text-sm mt-1">Built with React, Recharts, and Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
