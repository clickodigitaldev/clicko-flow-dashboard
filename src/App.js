import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CurrencyProvider } from './contexts/CurrencyContext';
import Dashboard from './components/Dashboard';
import MonthlyPlanningPage from './pages/MonthlyPlanningPage';
import ProjectsPage from './pages/ProjectsPage';
import OrgChartPage from './pages/OrgChartPage';
import './index.css';

function App() {
  return (
    <CurrencyProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/monthly-planning" element={<MonthlyPlanningPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/org-chart" element={<OrgChartPage />} />
        </Routes>
      </Router>
    </CurrencyProvider>
  );
}

export default App;
