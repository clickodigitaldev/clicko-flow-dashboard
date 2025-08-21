import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const Charts = ({ projects, cashFlowProjection }) => {
  // Calculate payment status data for pie chart
  const paymentStatusData = [
    {
      name: 'Paid',
      value: projects.filter(p => p.depositPaid === p.totalAmount).length,
      color: '#10b981'
    },
    {
      name: 'Partial',
      value: projects.filter(p => p.depositPaid > 0 && p.depositPaid < p.totalAmount).length,
      color: '#f59e0b'
    },
    {
      name: 'Pending',
      value: projects.filter(p => p.depositPaid === 0).length,
      color: '#ef4444'
    }
  ];

  // Calculate monthly revenue data for bar chart
  const monthlyRevenueData = [
    {
      month: 'August 2025',
      expected: 150000,
      actual: projects
        .filter(p => p.monthOfPayment === 'August 2025')
        .reduce((sum, p) => sum + p.depositPaid, 0)
    },
    {
      month: 'September 2025',
      expected: 180000,
      actual: projects
        .filter(p => p.monthOfPayment === 'September 2025')
        .reduce((sum, p) => sum + p.depositPaid, 0)
    },
    {
      month: 'October 2025',
      expected: 200000,
      actual: projects
        .filter(p => p.monthOfPayment === 'October 2025')
        .reduce((sum, p) => sum + p.depositPaid, 0)
    }
  ];

  // Calculate project status data
  const projectStatusData = [
    { name: 'Completed', value: projects.filter(p => p.status === 'Completed').length, color: '#10b981' },
    { name: 'In Progress', value: projects.filter(p => p.status === 'In Progress').length, color: '#3b82f6' },
    { name: 'Pending', value: projects.filter(p => p.status === 'Pending').length, color: '#f59e0b' }
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Monthly Revenue vs Target */}
      <div className="glass-card glass-card-hover p-6 animate-fade-in-up">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-600 rounded mr-3"></div>
          Monthly Revenue vs Target
        </h3>
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

      {/* Payment Status */}
      <div className="glass-card glass-card-hover p-6 animate-fade-in-up">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <div className="w-2 h-8 bg-gradient-to-b from-green-400 to-emerald-600 rounded mr-3"></div>
          Payment Status
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

      {/* Project Status */}
      <div className="glass-card glass-card-hover p-6 animate-fade-in-up">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <div className="w-2 h-8 bg-gradient-to-b from-purple-400 to-pink-600 rounded mr-3"></div>
          Project Status
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

      {/* Cash Flow Projection */}
      <div className="glass-card glass-card-hover p-6 animate-fade-in-up">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <div className="w-2 h-8 bg-gradient-to-b from-indigo-400 to-purple-600 rounded mr-3"></div>
          Cash Flow Projection
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={cashFlowProjection}>
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
            <Line 
              type="monotone" 
              dataKey="projected" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#06b6d4" 
              strokeWidth={3}
              dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#06b6d4', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;
