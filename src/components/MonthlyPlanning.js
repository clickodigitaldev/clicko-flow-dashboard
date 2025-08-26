import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, TrendingUp, TrendingDown, Calculator, Save, ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';

const MonthlyPlanning = ({ isOpen, onClose, monthlyData, onSaveMonthlyData }) => {
  const { formatCurrency, convertFromBase, convertToBase, currentCurrency } = useCurrency();
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [localMonthlyData, setLocalMonthlyData] = useState([]);
  const [summaryData, setSummaryData] = useState({});

  // Initialize 24 months of data
  useEffect(() => {
    if (monthlyData && monthlyData.length > 0) {
      setLocalMonthlyData(monthlyData);
    } else {
      const initialData = [];
      for (let i = 0; i < 24; i++) {
        const month = new Date();
        month.setMonth(month.getMonth() + i);
        const monthName = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
        initialData.push({
          id: i,
          month: monthName,
          revenue: 150000,
          overhead: [
            { id: 1, name: 'Senior Developer', salary: 8000, team: 'service' },
            { id: 2, name: 'UI/UX Designer', salary: 6000, team: 'product' },
            { id: 3, name: 'Project Manager', salary: 7000, team: 'management' }
          ],
          generalExpenses: [
            { id: 1, name: 'Office Rent', amount: 3000 },
            { id: 2, name: 'Software Subscriptions', amount: 500 },
            { id: 3, name: 'Internet & Utilities', amount: 200 },
            { id: 4, name: 'Marketing', amount: 1000 }
          ],
          breakEven: 120000,
          notes: ''
        });
      }
      setLocalMonthlyData(initialData);
    }
  }, [monthlyData]);

  // Calculate summary data
  useEffect(() => {
    if (localMonthlyData.length > 0) {
      const summary = {
        totalRevenue: localMonthlyData.reduce((sum, month) => sum + month.revenue, 0),
        totalExpenses: localMonthlyData.reduce((sum, month) => {
          const overheadTotal = month.overhead.reduce((s, pos) => s + pos.salary, 0);
          const generalTotal = month.generalExpenses.reduce((s, exp) => s + exp.amount, 0);
          return sum + overheadTotal + generalTotal;
        }, 0),
        totalProfit: 0,
        averageMonthlyRevenue: 0,
        averageMonthlyExpenses: 0,
        monthsAboveBreakEven: 0,
        totalBreakEvenTarget: 0
      };

      summary.totalProfit = summary.totalRevenue - summary.totalExpenses;
      summary.averageMonthlyRevenue = summary.totalRevenue / localMonthlyData.length;
      summary.averageMonthlyExpenses = summary.totalExpenses / localMonthlyData.length;
      summary.totalBreakEvenTarget = localMonthlyData.reduce((sum, month) => sum + month.breakEven, 0);
      summary.monthsAboveBreakEven = localMonthlyData.filter(month => month.revenue >= month.breakEven).length;

      setSummaryData(summary);
    }
  }, [localMonthlyData]);

  const getMonthName = (index) => {
    const month = new Date();
    month.setMonth(month.getMonth() + index);
    return month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const updateMonthData = (monthIndex, field, value) => {
    setLocalMonthlyData(prev => 
      prev.map((month, index) => 
        index === monthIndex ? { ...month, [field]: value } : month
      )
    );
  };

  const addOverheadPosition = (monthIndex, team = 'service') => {
    setLocalMonthlyData(prev => 
      prev.map((month, index) => {
        if (index === monthIndex) {
          const newId = Math.max(...month.overhead.map(item => item.id), 0) + 1;
          return {
            ...month,
            overhead: [...month.overhead, { id: newId, name: '', salary: 0, team }]
          };
        }
        return month;
      })
    );
  };

  const removeOverheadPosition = (monthIndex, positionId) => {
    setLocalMonthlyData(prev => 
      prev.map((month, index) => {
        if (index === monthIndex) {
          return {
            ...month,
            overhead: month.overhead.filter(pos => pos.id !== positionId)
          };
        }
        return month;
      })
    );
  };

  const updateOverheadPosition = (monthIndex, positionId, field, value) => {
    setLocalMonthlyData(prev => 
      prev.map((month, index) => {
        if (index === monthIndex) {
          return {
            ...month,
            overhead: month.overhead.map(pos => 
              pos.id === positionId ? { ...pos, [field]: value } : pos
            )
          };
        }
        return month;
      })
    );
  };

  const getTeamTotal = (monthIndex, team) => {
    const monthData = localMonthlyData[monthIndex];
    if (!monthData) return 0;
    const totalInBase = monthData.overhead
      .filter(position => position.team === team)
      .reduce((sum, position) => sum + (position.salary || 0), 0);
    return convertFromBase(totalInBase);
  };

  const addGeneralExpense = (monthIndex) => {
    setLocalMonthlyData(prev => 
      prev.map((month, index) => {
        if (index === monthIndex) {
          const newId = Math.max(...month.generalExpenses.map(item => item.id), 0) + 1;
          return {
            ...month,
            generalExpenses: [...month.generalExpenses, { id: newId, name: '', amount: 0 }]
          };
        }
        return month;
      })
    );
  };

  const removeGeneralExpense = (monthIndex, expenseId) => {
    setLocalMonthlyData(prev => 
      prev.map((month, index) => {
        if (index === monthIndex) {
          return {
            ...month,
            generalExpenses: month.generalExpenses.filter(exp => exp.id !== expenseId)
          };
        }
        return month;
      })
    );
  };

  const updateGeneralExpense = (monthIndex, expenseId, field, value) => {
    setLocalMonthlyData(prev => 
      prev.map((month, index) => {
        if (index === monthIndex) {
          return {
            ...month,
            generalExpenses: month.generalExpenses.map(exp => 
              exp.id === expenseId ? { ...exp, [field]: value } : exp
            )
          };
        }
        return month;
      })
    );
  };

  const handleSave = () => {
    onSaveMonthlyData(localMonthlyData);
    onClose();
  };

  const currentMonth = localMonthlyData[currentMonthIndex];
  const totalOverhead = currentMonth?.overhead?.reduce((sum, item) => sum + (item.salary || 0), 0) || 0;
  const totalGeneralExpenses = currentMonth?.generalExpenses?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
  const totalMonthlyExpenses = totalOverhead + totalGeneralExpenses;
  const monthlyProfit = (currentMonth?.revenue || 0) - totalMonthlyExpenses;
  const isBreakEvenAchieved = (currentMonth?.revenue || 0) >= (currentMonth?.breakEven || 0);

  // Convert values to current currency for display
  const totalOverheadInCurrentCurrency = convertFromBase(totalOverhead);
  const totalGeneralExpensesInCurrentCurrency = convertFromBase(totalGeneralExpenses);
  const totalMonthlyExpensesInCurrentCurrency = convertFromBase(totalMonthlyExpenses);
  const monthlyProfitInCurrentCurrency = convertFromBase(monthlyProfit);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Calendar className="w-6 h-6 mr-3" />
              24-Month Financial Planning
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="gradient-card-blue p-4 rounded-xl">
              <h3 className="text-sm font-semibold text-white opacity-70 mb-2">Total Revenue (24 Months)</h3>
              <p className="text-2xl font-bold text-white">{formatCurrency(summaryData.totalRevenue || 0)}</p>
              <p className="text-sm text-white opacity-70">Avg: {formatCurrency(summaryData.averageMonthlyRevenue || 0)}/month</p>
            </div>
            <div className="gradient-card-purple p-4 rounded-xl">
              <h3 className="text-sm font-semibold text-white opacity-70 mb-2">Total Expenses (24 Months)</h3>
              <p className="text-2xl font-bold text-white">{formatCurrency(summaryData.totalExpenses || 0)}</p>
              <p className="text-sm text-white opacity-70">Avg: {formatCurrency(summaryData.averageMonthlyExpenses || 0)}/month</p>
            </div>
            <div className="gradient-card-green p-4 rounded-xl">
              <h3 className="text-sm font-semibold text-white opacity-70 mb-2">Total Profit (24 Months)</h3>
              <p className={`text-2xl font-bold ${summaryData.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(summaryData.totalProfit || 0)}
              </p>
              <p className="text-sm text-white opacity-70">
                {summaryData.monthsAboveBreakEven || 0}/24 months above break-even
              </p>
            </div>
            <div className="gradient-card-orange p-4 rounded-xl">
              <h3 className="text-sm font-semibold text-white opacity-70 mb-2">Break-even Target</h3>
              <p className="text-2xl font-bold text-white">{formatCurrency(summaryData.totalBreakEvenTarget || 0)}</p>
              <p className="text-sm text-white opacity-70">Total across 24 months</p>
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between bg-gray-800 rounded-xl p-4">
            <button
              onClick={() => setCurrentMonthIndex(Math.max(0, currentMonthIndex - 1))}
              disabled={currentMonthIndex === 0}
              className="modern-button flex items-center disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous Month
            </button>
            <div className="text-center">
              <h3 className="text-xl font-bold text-white">{currentMonth?.month}</h3>
              <p className="text-sm text-white opacity-70">Month {currentMonthIndex + 1} of 24</p>
            </div>
            <button
              onClick={() => setCurrentMonthIndex(Math.min(23, currentMonthIndex + 1))}
              disabled={currentMonthIndex === 23}
              className="modern-button flex items-center disabled:opacity-50"
            >
              Next Month
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>

          {/* Current Month Planning */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue & Break-even */}
            <div className="gradient-card-blue p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Revenue & Break-even
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white opacity-70 mb-2">
                    Expected Revenue ({currentCurrency})
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={convertFromBase(currentMonth?.revenue || 0).toFixed(2)}
                      onChange={(e) => {
                        const newRevenue = parseFloat(e.target.value) || 0;
                        // Convert from current currency to base currency before saving
                        const revenueInBase = convertToBase(newRevenue);
                        updateMonthData(currentMonthIndex, 'revenue', revenueInBase);
                      }}
                      className="modern-input w-32 pr-8"
                      placeholder="Revenue"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-white opacity-70">
                      {currentCurrency}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white opacity-70 mb-2">
                    Break-even Point ({currentCurrency})
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={convertFromBase(currentMonth?.breakEven || 0).toFixed(2)}
                      onChange={(e) => {
                        const newBreakEven = parseFloat(e.target.value) || 0;
                        // Convert from current currency to base currency before saving
                        const breakEvenInBase = convertToBase(newBreakEven);
                        updateMonthData(currentMonthIndex, 'breakEven', breakEvenInBase);
                      }}
                      className="modern-input w-32 pr-8"
                      placeholder="Break-even"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-white opacity-70">
                      {currentCurrency}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white opacity-70 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={currentMonth?.notes || ''}
                    onChange={(e) => updateMonthData(currentMonthIndex, 'notes', e.target.value)}
                    className="modern-input w-full h-20 resize-none"
                    placeholder="Add notes for this month..."
                  />
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="gradient-card-purple p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                {currentMonth?.month} Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white opacity-70">Revenue:</span>
                  <span className="text-white font-semibold">{formatCurrency(currentMonth?.revenue || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white opacity-70">Total Overhead:</span>
                  <span className="text-white font-semibold">{formatCurrency(totalOverheadInCurrentCurrency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white opacity-70">General Expenses:</span>
                  <span className="text-white font-semibold">{formatCurrency(totalGeneralExpensesInCurrentCurrency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white opacity-70">Total Expenses:</span>
                  <span className="text-white font-semibold">{formatCurrency(totalMonthlyExpensesInCurrentCurrency)}</span>
                </div>
                <div className="border-t border-gray-600 pt-3">
                  <div className="flex justify-between">
                    <span className="text-white opacity-70">Monthly Profit:</span>
                    <span className={`font-semibold ${monthlyProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatCurrency(monthlyProfitInCurrentCurrency)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-white opacity-70">Break-even Status:</span>
                  <span className={`font-semibold ${isBreakEvenAchieved ? 'text-green-400' : 'text-red-400'}`}>
                    {isBreakEvenAchieved ? 'Above Target' : 'Below Target'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Overhead Section */}
          <div className="gradient-card-green p-6 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Team Overhead - {currentMonth?.month}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => addOverheadPosition(currentMonthIndex, 'service')}
                  className="modern-button flex items-center text-xs bg-blue-500 hover:bg-blue-600"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Service
                </button>
                <button
                  onClick={() => addOverheadPosition(currentMonthIndex, 'product')}
                  className="modern-button flex items-center text-xs bg-purple-500 hover:bg-purple-600"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Product
                </button>
                <button
                  onClick={() => addOverheadPosition(currentMonthIndex, 'management')}
                  className="modern-button flex items-center text-xs bg-green-500 hover:bg-green-600"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Management
                </button>
              </div>
            </div>

            {/* Service Team */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-md font-medium text-blue-400 flex items-center">
                  <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                  Service Team
                </h4>
                <span className="text-sm text-white opacity-70">
                  Total: {formatCurrency(getTeamTotal(currentMonthIndex, 'service'))}
                </span>
              </div>
              <div className="space-y-2">
                {currentMonth?.overhead?.filter(position => position.team === 'service').map((position) => (
                  <div key={position.id} className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg border-l-4 border-blue-400">
                    <input
                      type="text"
                      value={position.name}
                      onChange={(e) => updateOverheadPosition(currentMonthIndex, position.id, 'name', e.target.value)}
                      className="modern-input flex-1"
                      placeholder="Position name"
                    />
                    <div className="relative">
                      <input
                        type="number"
                        value={convertFromBase(position.salary || 0).toFixed(2)}
                        onChange={(e) => {
                          const newSalary = parseFloat(e.target.value) || 0;
                          // Convert from current currency to base currency before saving
                          const salaryInBase = convertToBase(newSalary);
                          updateOverheadPosition(currentMonthIndex, position.id, 'salary', salaryInBase);
                        }}
                        className="modern-input w-32 pr-8"
                        placeholder="Salary"
                      />
                      <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-white opacity-70">
                        {currentCurrency}
                      </span>
                    </div>
                    <button
                      onClick={() => removeOverheadPosition(currentMonthIndex, position.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                {(!currentMonth?.overhead?.filter(position => position.team === 'service').length || 
                  currentMonth?.overhead?.filter(position => position.team === 'service').length === 0) && (
                  <div className="text-center py-4 text-white opacity-50 text-sm border-2 border-dashed border-gray-600 rounded-lg">
                    No Service Team positions added yet
                  </div>
                )}
              </div>
            </div>

            {/* Product Team */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-md font-medium text-purple-400 flex items-center">
                  <div className="w-3 h-3 bg-purple-400 rounded-full mr-2"></div>
                  Product Team
                </h4>
                <span className="text-sm text-white opacity-70">
                  Total: {formatCurrency(getTeamTotal(currentMonthIndex, 'product'))}
                </span>
              </div>
              <div className="space-y-2">
                {currentMonth?.overhead?.filter(position => position.team === 'product').map((position) => (
                  <div key={position.id} className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg border-l-4 border-purple-400">
                    <input
                      type="text"
                      value={position.name}
                      onChange={(e) => updateOverheadPosition(currentMonthIndex, position.id, 'name', e.target.value)}
                      className="modern-input flex-1"
                      placeholder="Position name"
                    />
                    <div className="relative">
                      <input
                        type="number"
                        value={convertFromBase(position.salary || 0).toFixed(2)}
                        onChange={(e) => {
                          const newSalary = parseFloat(e.target.value) || 0;
                          // Convert from current currency to base currency before saving
                          const salaryInBase = convertToBase(newSalary);
                          updateOverheadPosition(currentMonthIndex, position.id, 'salary', salaryInBase);
                        }}
                        className="modern-input w-32 pr-8"
                        placeholder="Salary"
                      />
                      <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-white opacity-70">
                        {currentCurrency}
                      </span>
                    </div>
                    <button
                      onClick={() => removeOverheadPosition(currentMonthIndex, position.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  ))}
                {(!currentMonth?.overhead?.filter(position => position.team === 'product').length || 
                  currentMonth?.overhead?.filter(position => position.team === 'product').length === 0) && (
                  <div className="text-center py-4 text-white opacity-50 text-sm border-2 border-dashed border-gray-600 rounded-lg">
                    No Product Team positions added yet
                  </div>
                )}
              </div>
            </div>

            {/* Management Team */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-md font-medium text-green-400 flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                  Management Team
                </h4>
                <span className="text-sm text-white opacity-70">
                  Total: {formatCurrency(getTeamTotal(currentMonthIndex, 'management'))}
                </span>
              </div>
              <div className="space-y-2">
                {currentMonth?.overhead?.filter(position => position.team === 'management').map((position) => (
                  <div key={position.id} className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg border-l-4 border-green-400">
                    <input
                      type="text"
                      value={position.name}
                      onChange={(e) => updateOverheadPosition(currentMonthIndex, position.id, 'name', e.target.value)}
                      className="modern-input flex-1"
                      placeholder="Position name"
                    />
                    <div className="relative">
                      <input
                        type="number"
                        value={convertFromBase(position.salary || 0).toFixed(2)}
                        onChange={(e) => {
                          const newSalary = parseFloat(e.target.value) || 0;
                          // Convert from current currency to base currency before saving
                          const salaryInBase = convertToBase(newSalary);
                          updateOverheadPosition(currentMonthIndex, position.id, 'salary', salaryInBase);
                        }}
                        className="modern-input w-32 pr-8"
                        placeholder="Salary"
                      />
                      <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-white opacity-70">
                        {currentCurrency}
                      </span>
                    </div>
                    <button
                      onClick={() => removeOverheadPosition(currentMonthIndex, position.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                {(!currentMonth?.overhead?.filter(position => position.team === 'management').length || 
                  currentMonth?.overhead?.filter(position => position.team === 'management').length === 0) && (
                  <div className="text-center py-4 text-white opacity-50 text-sm border-2 border-dashed border-gray-600 rounded-lg">
                    No Management Team positions added yet
                  </div>
                )}
              </div>
            </div>

            {/* Team Summary */}
            <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h5 className="text-sm font-medium text-white mb-3">Team Summary</h5>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-blue-400 font-semibold">{formatCurrency(getTeamTotal(currentMonthIndex, 'service'))}</div>
                  <div className="text-white opacity-70 text-xs">Service Team</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-400 font-semibold">{formatCurrency(getTeamTotal(currentMonthIndex, 'product'))}</div>
                  <div className="text-white opacity-70 text-xs">Product Team</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-semibold">{formatCurrency(getTeamTotal(currentMonthIndex, 'management'))}</div>
                  <div className="text-white opacity-70 text-xs">Management Team</div>
                </div>
              </div>
            </div>
          </div>

          {/* General Expenses Section */}
          <div className="gradient-card-orange p-6 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <TrendingDown className="w-5 h-5 mr-2" />
                General Expenses - {currentMonth?.month}
              </h3>
              <button
                onClick={() => addGeneralExpense(currentMonthIndex)}
                className="modern-button flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </button>
            </div>
            <div className="space-y-4">
              {currentMonth?.generalExpenses?.map((expense) => (
                <div key={expense.id} className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                  <input
                    type="text"
                    value={expense.name}
                    onChange={(e) => updateGeneralExpense(currentMonthIndex, expense.id, 'name', e.target.value)}
                    className="modern-input flex-1"
                    placeholder="Expense name"
                  />
                  <input
                    type="number"
                    value={expense.amount}
                    onChange={(e) => updateGeneralExpense(currentMonthIndex, expense.id, 'amount', parseFloat(e.target.value) || 0)}
                    className="modern-input w-32"
                    placeholder="Amount"
                  />
                  <button
                    onClick={() => removeGeneralExpense(currentMonthIndex, expense.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
            <button
              onClick={onClose}
              className="modern-button-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="modern-button flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Save All Monthly Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyPlanning;
