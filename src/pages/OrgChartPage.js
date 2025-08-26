import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Plus, TrendingUp, Users as UsersIcon, DollarSign, Building2, Upload, Edit3, Trash2, Camera, Crown, User, Users } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import CurrencySwitcher from '../components/CurrencySwitcher';
import { useCurrency } from '../contexts/CurrencyContext';
import orgChartService from '../services/orgChartService';
import ImageUpload from '../components/ImageUpload';

// Modal for adding/editing teams
const TeamModal = ({ isOpen, onClose, onSave, team, isEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    description: ''
  });

  useEffect(() => {
    if (team) {
      setFormData({ 
        name: team.name, 
        role: team.role, 
        description: team.description || ''
      });
    } else {
      setFormData({ name: '', role: '', description: '' });
    }
  }, [team]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl p-6 w-[500px]">
        <h3 className="text-xl font-bold text-white mb-4">
          {isEdit ? 'Edit Team' : 'Add New Team'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Team Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:border-white focus:border-opacity-40"
              placeholder="Enter team name"
              required
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Team Role</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:border-white focus:border-opacity-40"
              placeholder="Enter team role"
              required
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:border-white focus:border-opacity-40"
              placeholder="Enter team description"
              rows="3"
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              {isEdit ? 'Update' : 'Add'} Team
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 text-white rounded-lg hover:bg-opacity-20 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal for editing CEO
const CEOModal = ({ isOpen, onClose, onSave, ceo }) => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    salary: '',
    salaryCurrency: 'AED',
    imageUrl: ''
  });

  useEffect(() => {
    if (ceo) {
      setFormData({
        name: ceo.name || '',
        position: ceo.position || '',
        salary: ceo.salary || '',
        salaryCurrency: ceo.salaryCurrency || 'AED',
        imageUrl: ceo.imageUrl || ''
      });
    } else {
      setFormData({ name: '', position: '', salary: '', salaryCurrency: 'AED', imageUrl: '' });
    }
  }, [ceo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl p-6 w-[500px]">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Crown className="w-5 h-5 mr-2" />
          Edit CEO Information
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">CEO Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:border-white focus:border-opacity-40"
              placeholder="Enter CEO name"
              required
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Position</label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:border-white focus:border-opacity-40"
              placeholder="Enter position"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Salary</label>
              <input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:border-white focus:border-opacity-40"
                placeholder="Enter salary"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Currency</label>
              <select
                value={formData.salaryCurrency}
                onChange={(e) => setFormData({ ...formData, salaryCurrency: e.target.value })}
                className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:border-white focus:border-opacity-40"
              >
                <option value="AED">AED</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="BDT">BDT</option>
              </select>
            </div>
          </div>
          <ImageUpload
            currentImageUrl={formData.imageUrl}
            onImageChange={(imageUrl) => setFormData({ ...formData, imageUrl })}
            placeholder="CEO Photo"
          />
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg hover:from-yellow-600 hover:to-orange-700 transition-all duration-300"
            >
              Update CEO
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 text-white rounded-lg hover:bg-opacity-20 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal for adding/editing members
const MemberModal = ({ isOpen, onClose, onSave, member, isEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    salary: '',
    salaryCurrency: 'AED',
    imageUrl: '',
    email: '',
    phone: '',
    status: 'Active'
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        position: member.position,
        salary: member.salary || '',
        salaryCurrency: member.salaryCurrency || 'AED',
        imageUrl: member.imageUrl || '',
        email: member.email || '',
        phone: member.phone || '',
        status: member.status || 'Active'
      });
    } else {
      setFormData({
        name: '',
        position: '',
        salary: '',
        salaryCurrency: 'AED',
        imageUrl: '',
        email: '',
        phone: '',
        status: 'Active'
      });
    }
  }, [member]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      salary: parseFloat(formData.salary) || 0
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl p-6 w-[500px] max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-white mb-4">
          {isEdit ? 'Edit Member' : 'Add Team Member'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:border-white focus:border-opacity-40"
              placeholder="Enter member name"
              required
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Position</label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:border-white focus:border-opacity-40"
              placeholder="Enter position"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Salary</label>
              <input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:border-white focus:border-opacity-40"
                placeholder="Enter salary"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Currency</label>
              <select
                value={formData.salaryCurrency}
                onChange={(e) => setFormData({ ...formData, salaryCurrency: e.target.value })}
                className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:border-white focus:border-opacity-40"
              >
                <option value="AED">AED</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="BDT">BDT</option>
              </select>
            </div>
          </div>
          <ImageUpload
            currentImageUrl={formData.imageUrl}
            onImageChange={(imageUrl) => setFormData({ ...formData, imageUrl })}
            placeholder="Member Photo"
          />
          <div>
            <label className="block text-white text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:border-white focus:border-opacity-40"
              placeholder="Enter email"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:border-white focus:border-opacity-40"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:border-white focus:border-opacity-40"
            >
              <option value="Active">Active</option>
              <option value="Hiring">Hiring</option>
              <option value="Warning">Warning</option>
            </select>
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              {isEdit ? 'Update' : 'Add'} Member
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 text-white rounded-lg hover:bg-opacity-20 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Custom Org Chart Node Component
const OrgChartNode = ({ data, onAddMember, onRemoveMember, onEditTeam, onEditMember, onDeleteTeam, onDeleteMember, onEditCEO }) => {
  const { formatCurrency, convertFromBase } = useCurrency();
  const isCEO = data.type === 'ceo';
  const isTeam = data.type === 'team';
  const isMember = data.type === 'member';

  let bgColor = 'rgba(255, 255, 255, 0.1)';
  let borderColor = 'rgba(255, 255, 255, 0.2)';
  let IconComponent = User;

  if (isCEO) {
    bgColor = 'rgba(255, 255, 255, 0.15)';
    borderColor = 'rgba(255, 255, 255, 0.3)';
    IconComponent = Crown;
  } else if (isTeam) {
    bgColor = 'rgba(59, 130, 246, 0.2)'; // Blue background for teams
    borderColor = 'rgba(59, 130, 246, 0.4)'; // Blue border for teams
    IconComponent = Users;
  } else if (isMember) {
    bgColor = 'rgba(255, 255, 255, 0.08)';
    borderColor = 'rgba(255, 255, 255, 0.2)';
    IconComponent = User;
  }

  // Convert salary to current currency for display
  const displaySalary = data.salary > 0 ? 
    formatCurrency(convertFromBase(data.salaryInBase || data.salary)) : null;

  // Add status-based classes for member styling
  const statusClass = isMember && data.status === 'Hiring' ? 'status-hiring' : 
                     isMember && data.status === 'Warning' ? 'status-warning' : 
                     isMember && data.status === 'Active' ? 'status-active' : '';

  // Only apply default background/border if not a member with status
  const defaultStyle = !isMember || !data.status ? {
    background: bgColor,
    border: `1px solid ${borderColor}`,
  } : {};

  return (
    <div
      className={`relative group ${statusClass}`}
      style={{
        ...defaultStyle,
        borderRadius: '12px',
        padding: '12px',
        backdropFilter: 'blur(10px)',
        color: 'white',
        textAlign: 'center',
        minHeight: isTeam ? '100px' : '120px',
        minWidth: isTeam ? '280px' : '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 255, 255, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Icon or Image - Only show for CEO and Members, not for Teams */}
      {!isTeam && (
        <div className="mb-3">
          {data.imageUrl ? (
            <img 
              src={data.imageUrl} 
              alt={data.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white border-opacity-30"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center"
            style={{ display: data.imageUrl ? 'none' : 'flex' }}
          >
            <IconComponent className="w-6 h-6 text-white" />
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>{data.name}</div>
      <div style={{ fontSize: '12px', opacity: '0.9', marginBottom: '4px' }}>{data.position}</div>
      {displaySalary && (
        <div style={{ fontSize: '11px', opacity: '0.75' }}>{displaySalary}</div>
      )}

      {isTeam && data.memberCount && (
        <div style={{ fontSize: '11px', opacity: '0.75' }}>{data.memberCount} members</div>
      )}
      
      {/* Action buttons for teams */}
      {isTeam && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddMember(data.id);
            }}
            className="w-6 h-6 bg-green-500 bg-opacity-80 rounded-full flex items-center justify-center text-white text-xs hover:bg-opacity-100 transition-all"
            title="Add Member"
          >
            <Plus className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditTeam(data.id);
            }}
            className="w-6 h-6 bg-blue-500 bg-opacity-80 rounded-full flex items-center justify-center text-white text-xs hover:bg-opacity-100 transition-all"
            title="Edit Team"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteTeam(data.id);
            }}
            className="w-6 h-6 bg-red-500 bg-opacity-80 rounded-full flex items-center justify-center text-white text-xs hover:bg-opacity-100 transition-all"
            title="Delete Team"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
      
      {/* Action buttons for CEO */}
      {isCEO && onEditCEO && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditCEO();
            }}
            className="w-6 h-6 bg-yellow-500 bg-opacity-80 rounded-full flex items-center justify-center text-white text-xs hover:bg-opacity-100 transition-all"
            title="Edit CEO"
          >
            <Edit3 className="w-3 h-3" />
          </button>
        </div>
      )}
      
      {/* Action buttons for members */}
      {isMember && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditMember(data.id);
            }}
            className="w-6 h-6 bg-blue-500 bg-opacity-80 rounded-full flex items-center justify-center text-white text-xs hover:bg-opacity-100 transition-all"
            title="Edit Member"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteMember(data.id);
            }}
            className="w-6 h-6 bg-red-500 bg-opacity-80 rounded-full flex items-center justify-center text-white text-xs hover:bg-opacity-100 transition-all"
            title="Delete Member"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

const OrgChartPage = () => {
  const [orgChartData, setOrgChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showCEOModal, setShowCEOModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  const { formatCurrency, convertFromBase } = useCurrency();

  // Load org chart data
  useEffect(() => {
    loadOrgChartData();
  }, []);

  const loadOrgChartData = async () => {
    try {
      setLoading(true);
      const data = await orgChartService.getOrgChart();
      setOrgChartData(data);
    } catch (error) {
      console.error('Error loading org chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    if (!orgChartData) return { totalTeams: 0, totalMembers: 0, totalSalary: 0, avgSalary: 0 };

    const totalTeams = orgChartData.teams.length;
    const ceoSalaryInBase = orgChartData.ceo?.salaryInBase || 0;
    const teamMembers = orgChartData.teams.reduce((sum, team) => sum + team.members.length, 0);
    const totalMembers = (orgChartData.ceo?.name ? 1 : 0) + teamMembers;
    const teamSalariesInBase = orgChartData.teams.reduce((sum, team) => 
      sum + team.members.reduce((teamSum, member) => teamSum + (member.salaryInBase || member.salary), 0), 0
    );
    const totalSalaryInBase = ceoSalaryInBase + teamSalariesInBase;
    const avgSalaryInBase = totalMembers > 0 ? totalSalaryInBase / totalMembers : 0;

    return { 
      totalTeams, 
      totalMembers, 
      totalSalary: convertFromBase(totalSalaryInBase), 
      avgSalary: convertFromBase(avgSalaryInBase) 
    };
  }, [orgChartData, convertFromBase]);

  // Handle adding new team
  const handleAddTeam = async (teamData) => {
    try {
      await orgChartService.addTeam(teamData);
      await loadOrgChartData();
    } catch (error) {
      console.error('Error adding team:', error);
    }
  };

  // Handle editing team
  const handleEditTeam = (teamId) => {
    const team = orgChartData.teams.find(t => t._id === teamId);
    if (team) {
      setEditingTeam(team);
      setShowTeamModal(true);
    }
  };

  // Handle updating team
  const handleUpdateTeam = async (teamData) => {
    try {
      await orgChartService.updateTeam(editingTeam._id, teamData);
      await loadOrgChartData();
      setEditingTeam(null);
    } catch (error) {
      console.error('Error updating team:', error);
    }
  };

  // Handle deleting team
  const handleDeleteTeam = async (teamId) => {
    if (window.confirm('Are you sure you want to delete this team? This will also delete all team members.')) {
      try {
        await orgChartService.deleteTeam(teamId);
        await loadOrgChartData();
      } catch (error) {
        console.error('Error deleting team:', error);
      }
    }
  };

  // Handle updating CEO
  const handleUpdateCEO = async (ceoData) => {
    try {
      await orgChartService.updateOrgChart({ ceo: ceoData });
      await loadOrgChartData();
    } catch (error) {
      console.error('Error updating CEO:', error);
    }
  };

  // Handle adding member to team
  const handleAddMember = (teamId) => {
    setSelectedTeamId(teamId);
    setEditingMember(null);
    setShowMemberModal(true);
  };

  // Handle editing member
  const handleEditMember = (memberId) => {
    // Find the member across all teams
    for (const team of orgChartData.teams) {
      const member = team.members.find(m => m._id === memberId);
      if (member) {
        setEditingMember(member);
        setSelectedTeamId(team._id);
        setShowMemberModal(true);
        break;
      }
    }
  };

  // Handle saving member
  const handleSaveMember = async (memberData) => {
    try {
      if (editingMember) {
        await orgChartService.updateMember(selectedTeamId, editingMember._id, memberData);
      } else {
        await orgChartService.addMember(selectedTeamId, memberData);
      }
      await loadOrgChartData();
      setEditingMember(null);
      setSelectedTeamId(null);
    } catch (error) {
      console.error('Error saving member:', error);
    }
  };

  // Handle removing member
  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        // Find the team that contains this member
        for (const team of orgChartData.teams) {
          const member = team.members.find(m => m._id === memberId);
          if (member) {
            await orgChartService.deleteMember(team._id, memberId);
            await loadOrgChartData();
            break;
          }
        }
      } catch (error) {
        console.error('Error removing member:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <Sidebar />
        <div className="content-with-sidebar flex items-center justify-center">
          <div className="text-white text-xl">Loading organizational chart...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Sidebar />
      
      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="modern-header sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-primary">Organizational Chart</h1>
                <p className="text-sm text-secondary">Interactive team structure and management</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowTeamModal(true)}
                  className="modern-button flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Team</span>
                </button>
                <CurrencySwitcher />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="glass-card p-4 glass-card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary">Total Teams</p>
                  <p className="text-2xl font-bold text-primary">{stats.totalTeams}</p>
                </div>
                <div className="icon-container">
                  <Building2 className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </div>
            
            <div className="glass-card p-4 glass-card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary">Total Members</p>
                  <p className="text-2xl font-bold text-primary">{stats.totalMembers}</p>
                </div>
                <div className="icon-container">
                  <UsersIcon className="w-5 h-5 text-green-400" />
                </div>
              </div>
            </div>
            
            <div className="glass-card p-4 glass-card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary">Total Salary</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(stats.totalSalary)}</p>
                </div>
                <div className="icon-container">
                  <DollarSign className="w-5 h-5 text-purple-400" />
                </div>
              </div>
            </div>
            
            <div className="glass-card p-4 glass-card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary">Avg Salary</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(stats.avgSalary)}</p>
                </div>
                <div className="icon-container">
                  <TrendingUp className="w-5 h-5 text-orange-400" />
                </div>
              </div>
            </div>
          </div>

                  {/* Org Chart Container */}
          <div className="enhanced-card p-6">
            <div className="org-chart-container relative">
              {/* CEO Level */}
              <div className="flex justify-center mb-8 relative z-10">
                <OrgChartNode
                  data={{
                    type: 'ceo',
                    name: orgChartData?.ceo?.name || 'Masud Rana',
                    position: orgChartData?.ceo?.position || 'CEO / Founder',
                    salary: orgChartData?.ceo?.salary || 0,
                    salaryCurrency: orgChartData?.ceo?.salaryCurrency || 'AED',
                    salaryInBase: orgChartData?.ceo?.salaryInBase || 0,
                    imageUrl: orgChartData?.ceo?.imageUrl
                  }}
                  onEditCEO={() => setShowCEOModal(true)}
                />
              </div>
              
              {/* Teams Level */}
              <div className="relative">
                
                <div className="flex justify-center space-x-12 mb-8 relative z-10">
                  {orgChartData?.teams?.map((team, index) => (
                    <div key={team._id} className="flex flex-col items-center relative">
                      
                      <OrgChartNode
                        data={{
                          type: 'team',
                          id: team._id,
                          name: team.name,
                          position: team.role,
                          memberCount: team.members.length,
                          salary: team.members.reduce((sum, member) => sum + (member.salaryInBase || member.salary), 0)
                        }}
                        onAddMember={handleAddMember}
                        onEditTeam={handleEditTeam}
                        onDeleteTeam={handleDeleteTeam}
                      />
                      
                      {/* Members Level */}
                      <div className="flex flex-col space-y-4 mt-4">
                        {team.members.map((member, memberIndex) => (
                          <div key={member._id} className="relative">
                            
                            <OrgChartNode
                              data={{
                                type: 'member',
                                id: member._id,
                                name: member.name,
                                position: member.position,
                                salary: member.salary,
                                salaryInBase: member.salaryInBase,
                                imageUrl: member.imageUrl,
                                status: member.status || 'Active'
                              }}
                              onEditMember={handleEditMember}
                              onDeleteMember={handleRemoveMember}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <CEOModal
        isOpen={showCEOModal}
        onClose={() => setShowCEOModal(false)}
        onSave={handleUpdateCEO}
        ceo={orgChartData?.ceo}
      />
      <TeamModal
        isOpen={showTeamModal}
        onClose={() => { setShowTeamModal(false); setEditingTeam(null); }}
        onSave={editingTeam ? handleUpdateTeam : handleAddTeam}
        team={editingTeam}
        isEdit={!!editingTeam}
      />
      <MemberModal
        isOpen={showMemberModal}
        onClose={() => { setShowMemberModal(false); setEditingMember(null); setSelectedTeamId(null); }}
        onSave={handleSaveMember}
        member={editingMember}
        isEdit={!!editingMember}
      />
    </div>
  );
};

export default OrgChartPage;
