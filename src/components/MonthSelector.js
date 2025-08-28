import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MonthSelector = ({ currentMonth, onMonthChange, className = '' }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showYearSelector, setShowYearSelector] = useState(false);

  // Generate months for the selected year
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Initialize with current month and year on component mount
  useEffect(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthName = months[now.getMonth()];
    
    if (!currentMonth || currentMonth === '') {
      onMonthChange(`${currentMonthName} ${currentYear}`);
    }
    
    setSelectedYear(currentYear);
  }, []);

  const handleMonthClick = (month) => {
    const monthString = `${month} ${selectedYear}`;
    onMonthChange(monthString);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setShowYearSelector(false);
    
    // Update current month with new year
    const currentMonthName = currentMonth.split(' ')[0];
    onMonthChange(`${currentMonthName} ${year}`);
  };

  const isCurrentMonth = (month) => {
    const now = new Date();
    return month === months[now.getMonth()] && selectedYear === now.getFullYear();
  };

  const isSelectedMonth = (month) => {
    return currentMonth === `${month} ${selectedYear}`;
  };

  const getMonthClass = (month) => {
    let baseClass = 'glass-card glass-card-hover p-3 text-center cursor-pointer transition-all duration-200 text-sm font-medium';
    
    if (isSelectedMonth(month)) {
      baseClass += ' ring-2 ring-blue-400 bg-blue-500 bg-opacity-20 text-blue-300';
    } else if (isCurrentMonth(month)) {
      baseClass += ' bg-green-500 bg-opacity-20 text-green-300 border border-green-400 border-opacity-30';
    } else {
      baseClass += ' text-white hover:text-blue-300 hover:bg-white hover:bg-opacity-10';
    }
    
    return baseClass;
  };

  return (
    <div className={`month-selector ${className}`}>
      {/* Year Selector Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setSelectedYear(selectedYear - 1)}
          className="glass-card glass-card-hover p-2 rounded-full hover:bg-white hover:bg-opacity-10 transition-all duration-200"
        >
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>
        
        <button
          onClick={() => setShowYearSelector(!showYearSelector)}
          className="glass-card glass-card-hover px-4 py-2 rounded-lg text-white font-semibold hover:bg-white hover:bg-opacity-10 transition-all duration-200"
        >
          {selectedYear}
        </button>
        
        <button
          onClick={() => setSelectedYear(selectedYear + 1)}
          className="glass-card glass-card-hover p-2 rounded-full hover:bg-white hover:bg-opacity-10 transition-all duration-200"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Year Dropdown */}
      {showYearSelector && (
        <div className="absolute top-16 left-0 z-50 glass-card p-2 rounded-lg max-h-48 overflow-y-auto">
          {Array.from({ length: 10 }, (_, i) => selectedYear - 5 + i).map((year) => (
            <button
              key={year}
              onClick={() => handleYearChange(year)}
              className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                year === selectedYear 
                  ? 'bg-blue-500 bg-opacity-20 text-blue-300' 
                  : 'text-white hover:bg-white hover:bg-opacity-10'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      )}

      {/* Months Grid */}
      <div className="grid grid-cols-3 gap-2">
        {months.map((month) => (
          <button
            key={month}
            onClick={() => handleMonthClick(month)}
            className={getMonthClass(month)}
          >
            {month}
          </button>
        ))}
      </div>

      {/* Current Month Indicator */}
      <div className="mt-3 text-center">
        <span className="text-xs text-secondary">
          Current: {months[new Date().getMonth()]} {new Date().getFullYear()}
        </span>
      </div>
    </div>
  );
};

export default MonthSelector;
