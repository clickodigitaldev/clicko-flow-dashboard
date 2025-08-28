import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useCurrency } from '../contexts/CurrencyContext';
import monthlyPlanningService from '../services/monthlyPlanningService';
import { getDepositsReceivedInMonth, getPaymentsDueInMonth, getMonthlyTrendsData } from '../utils/forecastUtils';

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
            
            // Calculate actual revenue for this month using new logic
            const depositsReceivedInBase = getDepositsReceivedInMonth(projects, month);
            const paymentsDueInBase = getPaymentsDueInMonth(projects, month);
            
            const depositsReceived = convertFromBase(depositsReceivedInBase);
            const paymentsDue = convertFromBase(paymentsDueInBase);
            const actualRevenue = depositsReceived + paymentsDue;

            console.log(`📊 ${month} - Expected Revenue: ${formatCurrency(expectedRevenue)}`);
            console.log(`📊 ${month} - Deposits Received: ${formatCurrency(depositsReceived)}`);
            console.log(`📊 ${month} - Payments Due: ${formatCurrency(paymentsDue)}`);

            allData.push({
              month: month,
              expected: expectedRevenue,
              actual: actualRevenue,
              depositsReceived: depositsReceived,
              paymentsDue: paymentsDue
            });
          } catch (error) {
            console.log(`No forecast data for ${month}, using defaults`);
            // Calculate actual revenue even if no forecast data using new logic
            const depositsReceivedInBase = getDepositsReceivedInMonth(projects, month);
            const paymentsDueInBase = getPaymentsDueInMonth(projects, month);
            
            const depositsReceived = convertFromBase(depositsReceivedInBase);
            const paymentsDue = convertFromBase(paymentsDueInBase);
            const actualRevenue = depositsReceived + paymentsDue;

            allData.push({
              month: month,
              expected: 0, // No revenue streams data available
              actual: actualRevenue,
              depositsReceived: depositsReceived,
              paymentsDue: paymentsDue
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
    { name: 'On Hold', value: projects.filter(p => p.status === 'On Hold').length, color: '#f97316' },
    { name: 'Cancelled', value: projects.filter(p => p.status === 'Cancelled').length, color: '#ef4444' }
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-4 border border-white border-opacity-20">
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-white">Loading charts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Monthly Revenue Trends Chart */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-4">Monthly Revenue Trends</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="month" 
              stroke="rgba(255,255,255,0.7)"
              fontSize={12}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.7)"
              fontSize={12}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="depositsReceived" 
              name="Deposits Received" 
              fill="#10b981" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="paymentsDue" 
              name="Payments Due" 
              fill="#8b5cf6" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="expected" 
              name="Expected Revenue" 
              fill="#f59e0b" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Project Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">Project Status Distribution</h3>
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

        {/* Financial Summary */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">Current Month Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white opacity-70">Total Projects:</span>
              <span className="text-white font-semibold">{financialSummary.totalProjects}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white opacity-70">Completed:</span>
              <span className="text-white font-semibold">{financialSummary.completedProjects}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white opacity-70">Completion Rate:</span>
              <span className="text-white font-semibold">{financialSummary.completionRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white opacity-70">Deposits Received:</span>
              <span className="text-green-400 font-semibold">{formatCurrency(financialSummary.depositsReceived)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white opacity-70">Payments Due:</span>
              <span className="text-purple-400 font-semibold">{formatCurrency(financialSummary.expectedPayments)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white opacity-70">Total Revenue:</span>
              <span className="text-blue-400 font-semibold">{formatCurrency(financialSummary.monthlyRevenue)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
