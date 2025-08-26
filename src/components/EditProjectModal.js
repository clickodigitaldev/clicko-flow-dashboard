import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, DollarSign, User, FileText, Tag, Globe } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';
import { projectCategories, projectStatuses, projectPriorities } from '../utils/constants';
import projectService from '../services/projectService';

const EditProjectModal = ({ project, isOpen, onClose, onUpdate }) => {
  const { getAvailableCurrencies } = useCurrency();
  const [formData, setFormData] = useState({
    clientName: '',
    projectName: '',
    description: '',
    category: 'Web Development',
    totalAmount: '',
    totalAmountCurrency: 'AED',
    depositPaid: '',
    depositPaidCurrency: 'AED',
    depositDate: '',
    expectedStartDate: '',
    expectedCompletion: '',
    actualCompletion: '',
    status: 'Pending',
    priority: 'Medium',
    assignedTo: '',
    monthOfPayment: '',
    progress: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currencies = getAvailableCurrencies();

  // Initialize form data when project changes
  useEffect(() => {
    if (project) {
      // Format dates for input fields (YYYY-MM-DD format)
      const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      setFormData({
        clientName: project.clientName || '',
        projectName: project.projectName || '',
        description: project.description || '',
        category: project.category || 'Web Development',
        totalAmount: project.totalAmount || '',
        totalAmountCurrency: project.totalAmountCurrency || 'AED',
        depositPaid: project.depositPaid || '',
        depositPaidCurrency: project.depositPaidCurrency || 'AED',
        depositDate: formatDateForInput(project.depositDate),
        expectedStartDate: formatDateForInput(project.expectedStartDate),
        expectedCompletion: formatDateForInput(project.expectedCompletion),
        actualCompletion: formatDateForInput(project.actualCompletion),
        status: project.status || 'Pending',
        priority: project.priority || 'Medium',
        assignedTo: project.assignedTo || '',
        monthOfPayment: project.monthOfPayment || '',
        progress: project.progress || 0
      });
    }
  }, [project]);

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
      if (!formData.clientName || !formData.projectName || !formData.totalAmount || !formData.expectedStartDate || !formData.expectedCompletion) {
        throw new Error('Please fill in all required fields (Client Name, Project Name, Total Amount, Expected Start Date, and Expected Completion)');
      }

      const updatedProject = {
        ...project,
        projectName: formData.projectName,
        clientName: formData.clientName,
        description: formData.description,
        category: formData.category,
        totalAmount: parseFloat(formData.totalAmount),
        totalAmountCurrency: formData.totalAmountCurrency,
        depositPaid: parseFloat(formData.depositPaid) || 0,
        depositPaidCurrency: formData.depositPaidCurrency,
        depositDate: formData.depositDate ? new Date(formData.depositDate).toISOString() : null,
        expectedStartDate: new Date(formData.expectedStartDate).toISOString(),
        expectedCompletion: new Date(formData.expectedCompletion).toISOString(),
        actualCompletion: formData.actualCompletion ? new Date(formData.actualCompletion).toISOString() : null,
        status: formData.status,
        priority: formData.priority,
        assignedTo: formData.assignedTo,
        monthOfPayment: formData.monthOfPayment,
        progress: parseInt(formData.progress) || 0
      };

      // Update project via API
      const result = await projectService.updateProject(project._id, updatedProject);
      
      // Call parent callback
      onUpdate(result);
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('Error updating project:', error);
      setError(error.message || 'Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="glass-card w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white border-opacity-20">
          <h2 className="text-xl font-bold text-primary">Edit Project: {project.projectName}</h2>
          <button
            onClick={onClose}
            className="action-button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-900 bg-opacity-50 border border-red-500 rounded-lg flex items-center gap-2">
            <span className="text-red-200">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Client Name *
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  className="modern-input w-full"
                  placeholder="Enter client name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Project Name *
                </label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  className="modern-input w-full"
                  placeholder="Enter project name"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="modern-input w-full h-20 resize-none"
              placeholder="Enter project description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                <Tag className="w-4 h-4 inline mr-2" />
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="modern-select w-full"
              >
                <option value="">Select Category</option>
                {projectCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Assigned To
              </label>
              <input
                type="text"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleInputChange}
                className="modern-input w-full"
                placeholder="Enter assigned person"
              />
            </div>
          </div>

          {/* Financial Information */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Financial Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Total Amount *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleInputChange}
                    className="modern-input flex-1"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                  <select
                    name="totalAmountCurrency"
                    value={formData.totalAmountCurrency}
                    onChange={handleInputChange}
                    className="modern-select w-24"
                  >
                    {currencies.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Deposit Paid
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    name="depositPaid"
                    value={formData.depositPaid}
                    onChange={handleInputChange}
                    className="modern-input flex-1"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                  <select
                    name="depositPaidCurrency"
                    value={formData.depositPaidCurrency}
                    onChange={handleInputChange}
                    className="modern-select w-24"
                  >
                    {currencies.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Deposit Date
                </label>
                <input
                  type="date"
                  name="depositDate"
                  value={formData.depositDate}
                  onChange={handleInputChange}
                  className="modern-input w-full"
                />
              </div>
            </div>
          </div>

          {/* Dates and Status */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Dates and Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Expected Start Date *
                </label>
                <input
                  type="date"
                  name="expectedStartDate"
                  value={formData.expectedStartDate}
                  onChange={handleInputChange}
                  className="modern-input w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Expected Completion *
                </label>
                <input
                  type="date"
                  name="expectedCompletion"
                  value={formData.expectedCompletion}
                  onChange={handleInputChange}
                  className="modern-input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Actual Completion
                </label>
                <input
                  type="date"
                  name="actualCompletion"
                  value={formData.actualCompletion}
                  onChange={handleInputChange}
                  className="modern-input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="modern-select w-full"
                >
                  {projectStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="modern-select w-full"
                >
                  {projectPriorities.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Month of Payment
                </label>
                <select
                  name="monthOfPayment"
                  value={formData.monthOfPayment}
                  onChange={handleInputChange}
                  className="modern-select w-full"
                >
                  <option value="">Select Month</option>
                  <option value="August 2025">August 2025</option>
                  <option value="September 2025">September 2025</option>
                  <option value="October 2025">October 2025</option>
                  <option value="November 2025">November 2025</option>
                  <option value="December 2025">December 2025</option>
                  <option value="January 2026">January 2026</option>
                  <option value="February 2026">February 2026</option>
                  <option value="March 2026">March 2026</option>
                  <option value="April 2026">April 2026</option>
                  <option value="May 2026">May 2026</option>
                  <option value="June 2026">June 2026</option>
                  <option value="July 2026">July 2026</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Progress (%)
                </label>
                <input
                  type="number"
                  name="progress"
                  value={formData.progress}
                  onChange={handleInputChange}
                  className="modern-input w-full"
                  min="0"
                  max="100"
                  step="1"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-white border-opacity-20">
            <button
              type="button"
              onClick={onClose}
              className="modern-button-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modern-button flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;
