import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, DollarSign, Users, Building, Calculator, Settings as SettingsIcon } from 'lucide-react';
import { generateForecast, calculateMonthlyExpenses } from '../utils/forecastUtils';

const Settings = ({ isOpen, onClose, settings, onSaveSettings }) => {
  const [localSettings, setLocalSettings] = useState({
    monthlyTarget: 150000,
    breakEven: 120000,
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
    forecastingMonths: 24
  });

  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  useEffect(() => {
    const forecast = generateForecast(localSettings, localSettings.forecastingMonths);
    setForecastData(forecast);
  }, [localSettings]);



  const addOverheadPosition = () => {
    const newId = Math.max(...localSettings.overhead.map(item => item.id), 0) + 1;
    setLocalSettings(prev => ({
      ...prev,
      overhead: [...prev.overhead, { id: newId, name: '', salary: 0 }]
    }));
  };

  const removeOverheadPosition = (id) => {
    setLocalSettings(prev => ({
      ...prev,
      overhead: prev.overhead.filter(item => item.id !== id)
    }));
  };

  const updateOverheadPosition = (id, field, value) => {
    setLocalSettings(prev => ({
      ...prev,
      overhead: prev.overhead.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const addGeneralExpense = () => {
    const newId = Math.max(...localSettings.generalExpenses.map(item => item.id), 0) + 1;
    setLocalSettings(prev => ({
      ...prev,
      generalExpenses: [...prev.generalExpenses, { id: newId, name: '', amount: 0 }]
    }));
  };

  const removeGeneralExpense = (id) => {
    setLocalSettings(prev => ({
      ...prev,
      generalExpenses: prev.generalExpenses.filter(item => item.id !== id)
    }));
  };

  const updateGeneralExpense = (id, field, value) => {
    setLocalSettings(prev => ({
      ...prev,
      generalExpenses: prev.generalExpenses.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSave = () => {
    onSaveSettings(localSettings);
    onClose();
  };

  const totalOverhead = localSettings.overhead.reduce((sum, item) => sum + (item.salary || 0), 0);
  const totalGeneralExpenses = localSettings.generalExpenses.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalMonthlyExpenses = calculateMonthlyExpenses(localSettings);
  const monthlyProfit = localSettings.monthlyTarget - totalMonthlyExpenses;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <SettingsIcon className="w-6 h-6 mr-3" />
              Dashboard Settings
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Monthly Targets & Break-even */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="gradient-card-blue p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Monthly Target
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white opacity-70 mb-2">
                    Target Revenue ($)
                  </label>
                  <input
                    type="number"
                    value={localSettings.monthlyTarget}
                    onChange={(e) => setLocalSettings(prev => ({ ...prev, monthlyTarget: parseFloat(e.target.value) || 0 }))}
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
                    value={localSettings.breakEven}
                    onChange={(e) => setLocalSettings(prev => ({ ...prev, breakEven: parseFloat(e.target.value) || 0 }))}
                    className="modern-input w-full"
                    placeholder="120000"
                  />
                </div>
              </div>
            </div>

            <div className="gradient-card-purple p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                Financial Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white opacity-70">Total Overhead:</span>
                  <span className="text-white font-semibold">${totalOverhead.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white opacity-70">General Expenses:</span>
                  <span className="text-white font-semibold">${totalGeneralExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white opacity-70">Total Monthly Expenses:</span>
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
              </div>
            </div>
          </div>

          {/* Overhead Section */}
          <div className="gradient-card-green p-6 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Overhead Expenses
              </h3>
              <button
                onClick={addOverheadPosition}
                className="modern-button flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Position
              </button>
            </div>
            <div className="space-y-4">
              {localSettings.overhead.map((position) => (
                <div key={position.id} className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                  <input
                    type="text"
                    value={position.name}
                    onChange={(e) => updateOverheadPosition(position.id, 'name', e.target.value)}
                    className="modern-input flex-1"
                    placeholder="Position name"
                  />
                  <input
                    type="number"
                    value={position.salary}
                    onChange={(e) => updateOverheadPosition(position.id, 'salary', parseFloat(e.target.value) || 0)}
                    className="modern-input w-32"
                    placeholder="Salary"
                  />
                  <button
                    onClick={() => removeOverheadPosition(position.id)}
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
                <Building className="w-5 h-5 mr-2" />
                General Expenses
              </h3>
              <button
                onClick={addGeneralExpense}
                className="modern-button flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </button>
            </div>
            <div className="space-y-4">
              {localSettings.generalExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                  <input
                    type="text"
                    value={expense.name}
                    onChange={(e) => updateGeneralExpense(expense.id, 'name', e.target.value)}
                    className="modern-input flex-1"
                    placeholder="Expense name"
                  />
                  <input
                    type="number"
                    value={expense.amount}
                    onChange={(e) => updateGeneralExpense(expense.id, 'amount', parseFloat(e.target.value) || 0)}
                    className="modern-input w-32"
                    placeholder="Amount"
                  />
                  <button
                    onClick={() => removeGeneralExpense(expense.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 24-Month Forecast Preview */}
          <div className="gradient-card-purple p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              24-Month Financial Forecast
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left text-white opacity-70 py-2">Month</th>
                    <th className="text-right text-white opacity-70 py-2">Revenue</th>
                    <th className="text-right text-white opacity-70 py-2">Expenses</th>
                    <th className="text-right text-white opacity-70 py-2">Profit</th>
                    <th className="text-center text-white opacity-70 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {forecastData.slice(0, 12).map((item, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="text-white py-2">{item.month}</td>
                      <td className="text-right text-white py-2">${item.revenue.toLocaleString()}</td>
                      <td className="text-right text-white py-2">${item.expenses.toLocaleString()}</td>
                      <td className={`text-right py-2 font-semibold ${item.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${item.profit.toLocaleString()}
                      </td>
                      <td className="text-center py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.breakEvenStatus === 'Above' 
                            ? 'bg-green-500 bg-opacity-20 text-green-400' 
                            : 'bg-red-500 bg-opacity-20 text-red-400'
                        }`}>
                          {item.breakEvenStatus} Break-even
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {forecastData.length > 12 && (
                <p className="text-center text-white opacity-70 mt-4">
                  Showing first 12 months of {forecastData.length} month forecast
                </p>
              )}
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
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
