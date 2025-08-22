import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import monthlyPlanningService from '../services/monthlyPlanningService';

const Charts = ({ projects, currentMonth, financialSummary }) => {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch forecast data for the current month
  useEffect(() => {
    const fetchForecastData = async () => {
      try {
        setLoading(true);
        const monthData = await monthlyPlanningService.getMonthlyPlanningByMonth(currentMonth);
        console.log('📊 Charts: Forecast data loaded:', monthData);
        console.log('📊 Charts: Revenue streams:', monthData?.revenueStreams);
        console.log('📊 Charts: Total revenue streams:', monthData?.revenueStreams?.reduce((sum, stream) => sum + (stream.amount || 0), 0));
        setForecastData(monthData);
      } catch (error) {
        console.error('Error fetching forecast data for charts:', error);
        setForecastData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchForecastData();
  }, [currentMonth]);

  // Calculate payment status data for pie chart (current month only)
  const currentMonthProjects = projects.filter(p => p.monthOfPayment === currentMonth);
  const paymentStatusData = [
    {
      name: 'Paid',
      value: currentMonthProjects.filter(p => p.depositPaid === p.totalAmount).length,
      color: '#10b981'
    },
    {
      name: 'Partial',
      value: currentMonthProjects.filter(p => p.depositPaid > 0 && p.depositPaid < p.totalAmount).length,
      color: '#f59e0b'
    },
    {
      name: 'Pending',
      value: currentMonthProjects.filter(p => p.depositPaid === 0).length,
      color: '#ef4444'
    }
  ];

  // Calculate monthly revenue data for bar chart using database forecast data
  const monthlyRevenueData = [
    {
      month: 'August 2025',
      expected: forecastData?.revenue || 200000,
      actual: financialSummary?.depositsReceived || 0 // Use actual deposits received
    },
    {
      month: 'September 2025',
      expected: 230000, // Will be updated when we have September data
      actual: 0 // Will be updated when we have September data
    },
    {
      month: 'October 2025',
      expected: 260000, // Will be updated when we have October data
      actual: 0 // Will be updated when we have October data
    }
  ];

  // Calculate total expenses from forecast data
  const totalOverhead = forecastData?.overhead?.reduce((sum, pos) => sum + (pos.salary || 0), 0) || 0;
  const totalGeneralExpenses = forecastData?.generalExpenses?.reduce((sum, exp) => sum + (exp.amount || 0), 0) || 0;
  const totalExpenses = totalOverhead + totalGeneralExpenses;

  // Calculate project status data (current month only)
  const projectStatusData = [
    { name: 'Completed', value: currentMonthProjects.filter(p => p.status === 'Completed').length, color: '#10b981' },
    { name: 'In Progress', value: currentMonthProjects.filter(p => p.status === 'In Progress').length, color: '#3b82f6' },
    { name: 'Pending', value: currentMonthProjects.filter(p => p.status === 'Pending').length, color: '#f59e0b' }
  ];

  // Calculate revenue breakdown for current month using database forecast data
  const revenueBreakdown = [
    {
      name: 'Revenue Streams',
      value: forecastData?.revenueStreams?.reduce((sum, stream) => sum + (stream.amount || 0), 0) || 0,
      color: '#10b981'
    },
    {
      name: 'Project Deposits',
      value: financialSummary?.depositsReceived || 0,
      color: '#3b82f6'
    },
    {
      name: 'Expected Payments',
      value: financialSummary?.expectedPayments || 0,
      color: '#f59e0b'
    },
    {
      name: 'Total Expenses',
      value: totalExpenses,
      color: '#ef4444'
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-4 border border-white border-opacity-20">
          <p className="text-white font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: ${entry.value?.toLocaleString() || entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-card glass-card-hover p-6 animate-fade-in-up">
          <div className="flex items-center justify-center h-64">
            <p className="text-white">Loading chart data...</p>
          </div>
        </div>
        <div className="glass-card glass-card-hover p-6 animate-fade-in-up">
          <div className="flex items-center justify-center h-64">
            <p className="text-white">Loading chart data...</p>
          </div>
        </div>
        <div className="glass-card glass-card-hover p-6 animate-fade-in-up">
          <div className="flex items-center justify-center h-64">
            <p className="text-white">Loading chart data...</p>
          </div>
        </div>
        <div className="glass-card glass-card-hover p-6 animate-fade-in-up">
          <div className="flex items-center justify-center h-64">
            <p className="text-white">Loading chart data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Monthly Revenue vs Target */}
      <div className="glass-card glass-card-hover p-6 animate-fade-in-up">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-600 rounded mr-3"></div>
          Monthly Revenue vs Target
        </h3>
        <div className="mb-4 text-sm text-gray-300">
          <p>Target Revenue: ${(forecastData?.revenue || 0).toLocaleString()}</p>
          <p>Actual Collected: ${(financialSummary?.depositsReceived || 0).toLocaleString()}</p>
          <p>Revenue Streams Total: ${(forecastData?.revenueStreams?.reduce((sum, stream) => sum + (stream.amount || 0), 0) || 0).toLocaleString()}</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyRevenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="month" 
              stroke="rgba(255,255,255,0.8)"
              fontSize={12}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.8)"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="expected" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="actual" fill="#06b6d4" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Project Status Distribution */}
      <div className="glass-card glass-card-hover p-6 animate-fade-in-up">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <div className="w-2 h-8 bg-gradient-to-b from-green-400 to-emerald-600 rounded mr-3"></div>
          Project Status ({currentMonth})
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={projectStatusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {projectStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Payment Status */}
      <div className="glass-card glass-card-hover p-6 animate-fade-in-up">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <div className="w-2 h-8 bg-gradient-to-b from-orange-400 to-red-600 rounded mr-3"></div>
          Payment Status ({currentMonth})
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={paymentStatusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {paymentStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue Breakdown */}
      <div className="glass-card glass-card-hover p-6 animate-fade-in-up">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-indigo-600 rounded mr-3"></div>
          Revenue & Expenses Breakdown ({currentMonth})
        </h3>
        <div className="mb-4 text-sm text-gray-300">
          <p>Total Revenue: ${(forecastData?.revenueStreams?.reduce((sum, stream) => sum + (stream.amount || 0), 0) || 0).toLocaleString()}</p>
          <p>Total Expenses: ${totalExpenses.toLocaleString()}</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={revenueBreakdown}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {revenueBreakdown.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;
