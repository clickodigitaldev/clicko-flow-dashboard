import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useCurrency } from '../contexts/CurrencyContext';
import monthlyPlanningService from '../services/monthlyPlanningService';

const Charts = ({ projects, currentMonth, financialSummary }) => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { formatCurrency, convertFromBase } = useCurrency();

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
            
            // Handle the nested data structure from the API
            const actualData = monthData?.data || monthData;
            
            // Calculate expected revenue as sum of all revenue streams for this month (in base currency)
            const expectedRevenueInBase = actualData?.revenueStreams?.reduce((sum, stream) => sum + (stream.amountInBase || stream.amount || 0), 0) || 0;
            
            // Convert to current currency for display
            const expectedRevenue = convertFromBase(expectedRevenueInBase);
            
            // Calculate actual revenue for this month (same logic as homepage widgets) - convert from base currency
            const monthProjects = projects.filter(project => {
              const projectStartDate = project.expectedStartDate ? new Date(project.expectedStartDate) : null;
              const depositDate = project.depositDate ? new Date(project.depositDate) : null;
              const monthDate = new Date(month);
              
              // Check if project started this month
              const startedThisMonth = projectStartDate && 
                projectStartDate.getMonth() === monthDate.getMonth() && 
                projectStartDate.getFullYear() === monthDate.getFullYear();
              
              // Check if deposit was received this month
              const depositReceivedThisMonth = depositDate && 
                depositDate.getMonth() === monthDate.getMonth() && 
                depositDate.getFullYear() === monthDate.getFullYear();
              
              // Check if project is due this month
              const dueThisMonth = project.monthOfPayment === month;
              
              // Check if project is ongoing (started before this month and not completed)
              const isOngoing = projectStartDate && 
                projectStartDate < monthDate && 
                project.status !== 'Completed';
              
              return startedThisMonth || depositReceivedThisMonth || dueThisMonth || isOngoing;
            });
            const depositsReceivedInBase = monthProjects.reduce((sum, p) => sum + (p.depositPaidInBase || p.depositPaid || 0), 0);
            const duePaymentsInBase = monthProjects.reduce((sum, p) => sum + ((p.totalAmountInBase || p.totalAmount || 0) - (p.depositPaidInBase || p.depositPaid || 0)), 0);
            
            const depositsReceived = convertFromBase(depositsReceivedInBase);
            const duePayments = convertFromBase(duePaymentsInBase);
            const actualRevenue = depositsReceived + duePayments;

            console.log(`📊 ${month} - Expected Revenue (Revenue Streams Sum): ${formatCurrency(expectedRevenue)}`);
            console.log(`📊 ${month} - Actual Revenue (Projects): ${formatCurrency(actualRevenue)}`);

            allData.push({
              month: month,
              expected: expectedRevenue,
              actual: actualRevenue,
              depositsReceived: depositsReceived,
              duePayments: duePayments
            });
          } catch (error) {
            console.log(`No forecast data for ${month}, using defaults`);
            // Calculate actual revenue even if no forecast data (same logic as homepage widgets) - convert from base currency
            const monthProjects = projects.filter(project => {
              const projectStartDate = project.expectedStartDate ? new Date(project.expectedStartDate) : null;
              const depositDate = project.depositDate ? new Date(project.depositDate) : null;
              const monthDate = new Date(month);
              
              // Check if project started this month
              const startedThisMonth = projectStartDate && 
                projectStartDate.getMonth() === monthDate.getMonth() && 
                projectStartDate.getFullYear() === monthDate.getFullYear();
              
              // Check if deposit was received this month
              const depositReceivedThisMonth = depositDate && 
                depositDate.getMonth() === monthDate.getMonth() && 
                depositDate.getFullYear() === monthDate.getFullYear();
              
              // Check if project is due this month
              const dueThisMonth = project.monthOfPayment === month;
              
              // Check if project is ongoing (started before this month and not completed)
              const isOngoing = projectStartDate && 
                projectStartDate < monthDate && 
                project.status !== 'Completed';
              
              return startedThisMonth || depositReceivedThisMonth || dueThisMonth || isOngoing;
            });
            const depositsReceivedInBase = monthProjects.reduce((sum, p) => sum + (p.depositPaidInBase || p.depositPaid || 0), 0);
            const duePaymentsInBase = monthProjects.reduce((sum, p) => sum + ((p.totalAmountInBase || p.totalAmount || 0) - (p.depositPaidInBase || p.depositPaid || 0)), 0);
            
            const depositsReceived = convertFromBase(depositsReceivedInBase);
            const duePayments = convertFromBase(duePaymentsInBase);
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
  }, [currentMonth, projects, convertFromBase, formatCurrency]);

  // Calculate project status data (all projects)
  const projectStatusData = [
    { name: 'Completed', value: projects.filter(p => p.status === 'Completed').length, color: '#10b981' },
    { name: 'In Progress', value: projects.filter(p => p.status === 'In Progress').length, color: '#3b82f6' },
    { name: 'Pending', value: projects.filter(p => p.status === 'Pending').length, color: '#f59e0b' },
    { name: 'On Hold', value: projects.filter(p => p.status === 'On Hold').length, color: '#ef4444' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-4 border border-white border-opacity-20">
          <p className="text-white font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value || 0)}
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Revenue vs Target - 12 Months */}
      <div className="glass-card glass-card-hover p-6 animate-fade-in-up">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded mr-3"></div>
          Monthly Revenue vs Target (12 Months)
        </h3>
        <ResponsiveContainer width="100%" height={350}>
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
              tickFormatter={(value) => `${formatCurrency(value).replace(/[^\d]/g, '')}k`}
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
          Project Status (All Projects)
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={projectStatusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={100}
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
