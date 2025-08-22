import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, TrendingUp, TrendingDown, Calculator, Save, ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react';

const MonthlyPlanning = ({ isOpen, onClose, monthlyData, onSaveMonthlyData }) => {
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
            { id: 1, name: 'Developer', salary: 8000 },
            { id: 2, name: 'Designer', salary: 6000 },
            { id: 3, name: 'Project Manager', salary: 7000 }
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

  const addOverheadPosition = (monthIndex) => {
    setLocalMonthlyData(prev => 
      prev.map((month, index) => {
        if (index === monthIndex) {
          const newId = Math.max(...month.overhead.map(item => item.id), 0) + 1;
          return {
            ...month,
            overhead: [...month.overhead, { id: newId, name: '', salary: 0 }]
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
              <p className="text-2xl font-bold text-white">${summaryData.totalRevenue?.toLocaleString() || 0}</p>
              <p className="text-sm text-white opacity-70">Avg: ${summaryData.averageMonthlyRevenue?.toLocaleString() || 0}/month</p>
            </div>
            <div className="gradient-card-purple p-4 rounded-xl">
              <h3 className="text-sm font-semibold text-white opacity-70 mb-2">Total Expenses (24 Months)</h3>
              <p className="text-2xl font-bold text-white">${summaryData.totalExpenses?.toLocaleString() || 0}</p>
              <p className="text-sm text-white opacity-70">Avg: ${summaryData.averageMonthlyExpenses?.toLocaleString() || 0}/month</p>
            </div>
            <div className="gradient-card-green p-4 rounded-xl">
              <h3 className="text-sm font-semibold text-white opacity-70 mb-2">Total Profit (24 Months)</h3>
              <p className={`text-2xl font-bold ${summaryData.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${summaryData.totalProfit?.toLocaleString() || 0}
              </p>
              <p className="text-sm text-white opacity-70">
                {summaryData.monthsAboveBreakEven || 0}/24 months above break-even
              </p>
            </div>
            <div className="gradient-card-orange p-4 rounded-xl">
              <h3 className="text-sm font-semibold text-white opacity-70 mb-2">Break-even Target</h3>
              <p className="text-2xl font-bold text-white">${summaryData.totalBreakEvenTarget?.toLocaleString() || 0}</p>
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
                    Expected Revenue ($)
                  </label>
                  <input
                    type="number"
                    value={currentMonth?.revenue || 0}
                    onChange={(e) => updateMonthData(currentMonthIndex, 'revenue', parseFloat(e.target.value) || 0)}
                    className="modern-input w-full"
                    placeholder="150000"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white opacity-70 mb-2">
                    Break-even Point ($)
                  </label>
                  <input
                    type="number"
                    value={currentMonth?.breakEven || 0}
                    onChange={(e) => updateMonthData(currentMonthIndex, 'breakEven', parseFloat(e.target.value) || 0)}
                    className="modern-input w-full"
                    placeholder="120000"
                  />
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
                  <span className="text-white font-semibold">${(currentMonth?.revenue || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white opacity-70">Total Overhead:</span>
                  <span className="text-white font-semibold">${totalOverhead.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white opacity-70">General Expenses:</span>
                  <span className="text-white font-semibold">${totalGeneralExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white opacity-70">Total Expenses:</span>
                  <span className="text-white font-semibold">${totalMonthlyExpenses.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-600 pt-3">
                  <div className="flex justify-between">
                    <span className="text-white opacity-70">Monthly Profit:</span>
                    <span className={`font-semibold ${monthlyProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${monthlyProfit.toLocaleString()}
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
                Overhead Expenses - {currentMonth?.month}
              </h3>
              <button
                onClick={() => addOverheadPosition(currentMonthIndex)}
                className="modern-button flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Position
              </button>
            </div>
            <div className="space-y-4">
              {currentMonth?.overhead?.map((position) => (
                <div key={position.id} className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                  <input
                    type="text"
                    value={position.name}
                    onChange={(e) => updateOverheadPosition(currentMonthIndex, position.id, 'name', e.target.value)}
                    className="modern-input flex-1"
                    placeholder="Position name"
                  />
                  <input
                    type="number"
                    value={position.salary}
                    onChange={(e) => updateOverheadPosition(currentMonthIndex, position.id, 'salary', parseFloat(e.target.value) || 0)}
                    className="modern-input w-32"
                    placeholder="Salary"
                  />
                  <button
                    onClick={() => removeOverheadPosition(currentMonthIndex, position.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
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
