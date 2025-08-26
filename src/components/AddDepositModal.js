import React, { useState } from 'react';
import { X, Save, DollarSign, Calendar } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';

const AddDepositModal = ({ project, isOpen, onClose, onUpdate }) => {
  const { currentCurrency } = useCurrency();
  const [formData, setFormData] = useState({
    amount: '',
    amountCurrency: 'AED', // Will be set to current currency
    type: 'deposit',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update currency when modal opens or current currency changes
  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      amountCurrency: currentCurrency
    }));
  }, [currentCurrency]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.amount || !formData.description) {
        throw new Error('Please fill in all required fields');
      }

      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      // Add payment via API
      const response = await fetch(`http://localhost:5001/api/projects/${project._id}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount,
          amountCurrency: formData.amountCurrency,
          type: formData.type,
          description: formData.description
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add payment');
      }

      const updatedProject = await response.json();
      
      // Call parent callback
      onUpdate(updatedProject);
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('Error adding payment:', error);
      setError(error.message || 'Failed to add payment');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !project) return null;

  // Safety check to ensure project has required properties
  if (!project._id || !project.projectName || !project.clientName) {
    console.error('AddDepositModal: Invalid project data:', project);
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="glass-card w-full max-w-md">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Add Deposit
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Project Info */}
          <div className="mb-6 p-4 bg-white bg-opacity-10 rounded-lg">
            <p className="text-white text-sm">
              <span className="font-medium">Project:</span> {project.projectName}
            </p>
            <p className="text-white text-sm">
              <span className="font-medium">Client:</span> {project.clientName}
            </p>
            <p className="text-white text-sm">
              <span className="font-medium">Current Deposit:</span> ${project.depositPaid || 0}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900 bg-opacity-50 border border-red-500 rounded-lg">
              <span className="text-red-200 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Amount *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white opacity-60 w-4 h-4" />
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="modern-input w-full pl-12"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="mt-1 text-xs text-white opacity-60">
                Currency: {currentCurrency}
              </div>
            </div>

            {/* Payment Type */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Payment Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="modern-select w-full"
              >
                <option value="deposit">Deposit</option>
                <option value="milestone">Milestone Payment</option>
                <option value="final">Final Payment</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Payment Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white opacity-60 w-4 h-4" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="modern-input w-full pl-12"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="modern-input w-full h-20 resize-none"
                placeholder="Payment description..."
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Add Payment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDepositModal;
