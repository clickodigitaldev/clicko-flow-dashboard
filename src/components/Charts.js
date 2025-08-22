import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import monthlyPlanningService from '../services/monthlyPlanningService';

const Charts = ({ projects, currentMonth, financialSummary }) => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generate 12 months array
  const generateMonths = () => {
    const months = [];
    const currentDate = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      months.push(monthName);
    }
    return months;
  };

  // Fetch forecast data for all 12 months
  useEffect(() => {
    const fetchAllMonthlyData = async () => {
      try {
        setLoading(true);
        const months = generateMonths();
        const allData = [];

        for (const month of months) {
          try {
            const monthData = await monthlyPlanningService.getMonthlyPlanningByMonth(month);
            
            // Calculate expected revenue as sum of all revenue streams for this month
            const expectedRevenue = monthData?.revenueStreams?.reduce((sum, stream) => sum + (stream.amount || 0), 0) || 0;
            
            // Calculate actual revenue for this month (same logic as homepage widgets)
            const monthProjects = projects.filter(p => p.monthOfPayment === month);
            const depositsReceived = monthProjects.reduce((sum, p) => sum + p.depositPaid, 0);
            const duePayments = monthProjects.reduce((sum, p) => sum + (p.totalAmount - p.depositPaid), 0);
            const actualRevenue = depositsReceived + duePayments;

            console.log(`📊 ${month} - Expected Revenue (Revenue Streams Sum): $${expectedRevenue.toLocaleString()}`);
            console.log(`📊 ${month} - Actual Revenue (Projects): $${actualRevenue.toLocaleString()}`);

            allData.push({
              month: month,
              expected: expectedRevenue,
              actual: actualRevenue,
              depositsReceived: depositsReceived,
              duePayments: duePayments
            });
          } catch (error) {
            console.log(`No forecast data for ${month}, using defaults`);
            // Calculate actual revenue even if no forecast data (same logic as homepage widgets)
            const monthProjects = projects.filter(p => p.monthOfPayment === month);
            const depositsReceived = monthProjects.reduce((sum, p) => sum + p.depositPaid, 0);
            const duePayments = monthProjects.reduce((sum, p) => sum + (p.totalAmount - p.depositPaid), 0);
            const actualRevenue = depositsReceived + duePayments;

            allData.push({
              month: month,
              expected: 0, // No revenue streams data available
              actual: actualRevenue,
              depositsReceived: depositsReceived,
              duePayments: duePayments
            });
          }
        }

        setMonthlyData(allData);
        
        console.log('📊 Charts: All monthly data loaded:', allData);
        console.log('📊 Charts: August 2025 data specifically:', allData.find(d => d.month === 'August 2025'));
      } catch (error) {
        console.error('Error fetching monthly data:', error);
        setMonthlyData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllMonthlyData();
  }, [currentMonth, projects]);

  // Calculate project status data (current month only)
  const currentMonthProjects = projects.filter(p => p.monthOfPayment === currentMonth);
  const projectStatusData = [
    { name: 'Completed', value: currentMonthProjects.filter(p => p.status === 'Completed').length, color: '#10b981' },
    { name: 'In Progress', value: currentMonthProjects.filter(p => p.status === 'In Progress').length, color: '#3b82f6' },
    { name: 'Pending', value: currentMonthProjects.filter(p => p.status === 'Pending').length, color: '#f59e0b' }
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
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Monthly Revenue vs Target - 12 Months */}
      <div className="glass-card glass-card-hover p-6 animate-fade-in-up lg:col-span-2">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-600 rounded mr-3"></div>
          Monthly Revenue vs Target (12 Months)
        </h3>
        <div className="mb-4 text-sm text-gray-300">
          <p><strong>Expected Revenue:</strong> Sum of all revenue streams for each month</p>
          <p><strong>Actual Revenue:</strong> Deposits received + Due payments for each month</p>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="month" 
              stroke="rgba(255,255,255,0.8)"
              fontSize={10}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.8)"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="expected" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Expected Revenue" />
            <Bar dataKey="actual" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Actual Revenue" />
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
    </div>
  );
};

export default Charts;
