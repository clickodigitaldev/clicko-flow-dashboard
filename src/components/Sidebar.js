import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Settings, 
  Calendar, 
  BarChart3, 
  Users, 
  FileText, 
  DollarSign
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();


  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="w-5 h-5" />,
      path: '/',
      children: []
    },
    {
      id: 'forecasting',
      label: 'Monthly Forecasting',
      icon: <Calendar className="w-5 h-5" />,
      path: '/monthly-planning',
      children: []
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      path: '/settings',
      children: []
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <FileText className="w-5 h-5" />,
      path: '/projects',
      children: []
    },
    {
      id: 'clients',
      label: 'Clients',
      icon: <Users className="w-5 h-5" />,
      path: '/clients',
      children: []
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <BarChart3 className="w-5 h-5" />,
      path: '/reports',
      children: []
    },
    {
      id: 'finance',
      label: 'Finance',
      icon: <DollarSign className="w-5 h-5" />,
      path: '/finance',
      children: []
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleMenuClick = (item) => {
    navigate(item.path);
  };



  return (
    <div className="sidebar-fixed sidebar-container glass-card border-r border-white border-opacity-20">
      {/* Logo */}
      <div className="p-4 border-b border-white border-opacity-20">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center mr-3 glow-blue">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-primary">Clicko Flow</h1>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-3">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleMenuClick(item)}
                className={`w-full flex items-center px-3 py-2 rounded-lg transition-all duration-300 ${
                  isActive(item.path) 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg glow-blue' 
                    : 'text-secondary hover:bg-white hover:bg-opacity-10 hover:text-primary'
                }`}
              >
                <div className="flex items-center">
                  {item.icon}
                  <span className="ml-3 font-medium">{item.label}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
