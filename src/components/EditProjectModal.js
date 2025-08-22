import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, DollarSign, User, FileText, Target, AlertCircle, Edit } from 'lucide-react';
import projectService from '../services/projectService';

const EditProjectModal = ({ project, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    projectName: '',
    totalAmount: 0,
    depositPaid: 0,
    depositDate: '',
    expectedStartDate: '',
    expectedCompletion: '',
    actualCompletion: '',
    status: 'Pending',
    monthOfPayment: '',
    priority: 'Medium',
    description: '',
    category: 'Web Development',
    assignedTo: '',
    progress: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize form data when project changes
  useEffect(() => {
    if (project) {
      setFormData({
        clientName: project.clientName || '',
        projectName: project.projectName || '',
        totalAmount: project.totalAmount || 0,
        depositPaid: project.depositPaid || 0,
        depositDate: project.depositDate || '',
        expectedStartDate: project.expectedStartDate || '',
        expectedCompletion: project.expectedCompletion || '',
        actualCompletion: project.actualCompletion || '',
        status: project.status || 'Pending',
        monthOfPayment: project.monthOfPayment || '',
        priority: project.priority || 'Medium',
        description: project.description || '',
        category: project.category || 'Web Development',
        assignedTo: project.assignedTo || '',
        progress: project.progress || 0
      });
    }
  }, [project]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
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

      // Update project via API
      const updatedProject = await projectService.updateProject(project.id, {
        ...formData,
        totalAmount: parseFloat(formData.totalAmount),
        depositPaid: parseFloat(formData.depositPaid) || 0,
        expectedStartDate: new Date(formData.expectedStartDate).toISOString(),
        expectedCompletion: new Date(formData.expectedCompletion).toISOString(),
        depositDate: formData.depositDate ? new Date(formData.depositDate).toISOString() : null
      });
      
      // Call parent callback
      onUpdate(updatedProject);
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('Error updating project:', error);
      setError(error.message || 'Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await projectService.deleteProject(project.id);
      onUpdate(null); // Signal deletion
      onClose();
    } catch (error) {
      console.error('Error deleting project:', error);
      setError(error.message || 'Failed to delete project');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Edit className="w-6 h-6" />
              Edit Project: {project.projectName}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900 bg-opacity-50 border border-red-500 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-200">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Client Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white opacity-60 w-5 h-5" />
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    className="modern-input w-full pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Project Name *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white opacity-60 w-5 h-5" />
                  <input
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    className="modern-input w-full pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Total Amount *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white opacity-60 w-5 h-5" />
                  <input
                    type="number"
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleInputChange}
                    className="modern-input w-full pl-10"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Deposit Paid
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white opacity-60 w-5 h-5" />
                  <input
                    type="number"
                    name="depositPaid"
                    value={formData.depositPaid}
                    onChange={handleInputChange}
                    className="modern-input w-full pl-10"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Deposit Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white opacity-60 w-5 h-5" />
                  <input
                    type="date"
                    name="depositDate"
                    value={formData.depositDate}
                    onChange={handleInputChange}
                    className="modern-input w-full pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Dates and Status */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Expected Start Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white opacity-60 w-5 h-5" />
                  <input
                    type="date"
                    name="expectedStartDate"
                    value={formData.expectedStartDate}
                    onChange={handleInputChange}
                    className="modern-input w-full pl-10"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Expected Completion *
                </label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white opacity-60 w-5 h-5" />
                  <input
                    type="date"
                    name="expectedCompletion"
                    value={formData.expectedCompletion}
                    onChange={handleInputChange}
                    className="modern-input w-full pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Actual Completion
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white opacity-60 w-5 h-5" />
                  <input
                    type="date"
                    name="actualCompletion"
                    value={formData.actualCompletion}
                    onChange={handleInputChange}
                    className="modern-input w-full pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Month of Payment *
                </label>
                <select
                  name="monthOfPayment"
                  value={formData.monthOfPayment}
                  onChange={handleInputChange}
                  className="modern-select w-full"
                  required
                >
                  <option value="">Select Month</option>
                  <option value="August 2025">August 2025</option>
                  <option value="September 2025">September 2025</option>
                  <option value="October 2025">October 2025</option>
                  <option value="November 2025">November 2025</option>
                  <option value="December 2025">December 2025</option>
                  <option value="January 2026">January 2026</option>
                </select>
              </div>
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="modern-select w-full"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="modern-select w-full"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="modern-select w-full"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Design">Design</option>
                  <option value="System Integration">System Integration</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Data Analytics">Data Analytics</option>
                  <option value="Cloud Services">Cloud Services</option>
                  <option value="Backend Development">Backend Development</option>
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
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
                />
              </div>
            </div>

            {/* Assignment and Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Assigned To
                </label>
                <input
                  type="text"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleInputChange}
                  className="modern-input w-full"
                  placeholder="e.g., John Developer"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="modern-input w-full h-20 resize-none"
                  placeholder="Project description..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-white border-opacity-20">
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                Delete Project
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProjectModal;
