// src/components/admin/IssueManagement.jsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Flag, Users, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { formatDate, getStatusColor, getCategoryIcon } from '../../utils/helpers';
import { ISSUE_CATEGORIES, ISSUE_STATUSES } from '../../utils/constants';
import api from '../../services/api';

function IssueManagement() {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    flagged: false
  });
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState({});

  useEffect(() => {
    loadIssues();
  }, []);

  useEffect(() => {
    filterIssues();
  }, [issues, searchTerm, filters]);

  const loadIssues = async () => {
    try {
      const response = await api.get('/admin/issues');
      setIssues(response.data.issues);
    } catch (error) {
      console.error('Failed to load issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterIssues = () => {
    let filtered = issues;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(issue =>
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(issue => issue.status === filters.status);
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(issue => issue.category === filters.category);
    }

    // Flagged filter
    if (filters.flagged) {
      filtered = filtered.filter(issue => issue.flag_count > 0 || issue.is_hidden);
    }

    setFilteredIssues(filtered);
  };

  const updateIssueStatus = async (issueId, newStatus) => {
    setUpdatingStatus(prev => ({ ...prev, [issueId]: true }));
    
    try {
      await api.put(`/admin/issues/${issueId}/status`, { status: newStatus });
      
      // Update local state
      setIssues(prev => prev.map(issue => 
        issue.id === issueId ? { ...issue, status: newStatus } : issue
      ));
      
      setSelectedIssue(prev => 
        prev && prev.id === issueId ? { ...prev, status: newStatus } : prev
      );
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update issue status');
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [issueId]: false }));
    }
  };

  const hideIssue = async (issueId) => {
    try {
      await api.put(`/admin/issues/${issueId}/hide`);
      setIssues(prev => prev.map(issue => 
        issue.id === issueId ? { ...issue, is_hidden: true } : issue
      ));
    } catch (error) {
      console.error('Failed to hide issue:', error);
      alert('Failed to hide issue');
    }
  };

  const unhideIssue = async (issueId) => {
    try {
      await api.put(`/admin/issues/${issueId}/unhide`);
      setIssues(prev => prev.map(issue => 
        issue.id === issueId ? { ...issue, is_hidden: false } : issue
      ));
    } catch (error) {
      console.error('Failed to unhide issue:', error);
      alert('Failed to unhide issue');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Issues</p>
              <p className="text-lg font-semibold text-gray-900">{issues.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-lg font-semibold text-gray-900">
                {issues.filter(i => i.status === 'reported').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Resolved</p>
              <p className="text-lg font-semibold text-gray-900">
                {issues.filter(i => i.status === 'resolved').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Flag className="h-8 w-8 text-red-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Flagged</p>
              <p className="text-lg font-semibold text-gray-900">
                {issues.filter(i => i.flag_count > 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            {ISSUE_STATUSES.map(status => (
              <option key={status.id} value={status.id}>{status.name}</option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {ISSUE_CATEGORIES.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>

          {/* Flagged Filter */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.flagged}
              onChange={(e) => setFilters(prev => ({ ...prev, flagged: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Show flagged only</span>
          </label>
        </div>
      </div>

      {/* Issues Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reporter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Flags
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIssues.map((issue) => (
                <tr key={issue.id} className={issue.is_hidden ? 'bg-red-50' : ''}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{getCategoryIcon(issue.category)}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{issue.title}</div>
                        <div className="text-sm text-gray-500">
                          {issue.description.substring(0, 60)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 capitalize">{issue.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={issue.status}
                      onChange={(e) => updateIssueStatus(issue.id, e.target.value)}
                      disabled={updatingStatus[issue.id]}
                      className={`text-xs font-medium rounded-full px-2 py-1 border-0 ${getStatusColor(issue.status)} ${
                        updatingStatus[issue.id] ? 'opacity-50' : ''
                      }`}
                    >
                      <option value="reported">Reported</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {issue.is_anonymous ? 'Anonymous' : `${issue.first_name} ${issue.last_name}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(issue.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {issue.flag_count > 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {issue.flag_count} flags
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setSelectedIssue(issue)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      {issue.is_hidden ? (
                        <button
                          onClick={() => unhideIssue(issue.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Unhide Issue"
                        >
                          <CheckCircle size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => hideIssue(issue.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Hide Issue"
                        >
                          <Flag size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredIssues.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No issues found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria.
            </p>
          </div>
        )}
      </div>

      {/* Issue Detail Modal */}
      {selectedIssue && (
        <IssueDetailModal 
          issue={selectedIssue} 
          onClose={() => setSelectedIssue(null)}
          onStatusUpdate={updateIssueStatus}
        />
      )}
    </div>
  );
}

// Issue Detail Modal Component
function IssueDetailModal({ issue, onClose, onStatusUpdate }) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getCategoryIcon(issue.category)}</span>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{issue.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                  {issue.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">Description</h4>
              <p className="text-gray-700 mt-1">{issue.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900">Category</h4>
                <p className="text-gray-700 capitalize">{issue.category}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Reporter</h4>
                <p className="text-gray-700">
                  {issue.is_anonymous ? 'Anonymous' : `${issue.first_name} ${issue.last_name}`}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900">Location</h4>
              <p className="text-gray-700">{issue.address || 'Address not provided'}</p>
              <p className="text-sm text-gray-500">
                {issue.latitude}, {issue.longitude}
              </p>
            </div>

            {issue.photos && issue.photos.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900">Photos</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {issue.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/uploads/${photo}`}
                      alt={`Issue photo ${index + 1}`}
                      className="w-full h-24 object-cover rounded border"
                    />
                  ))}
                </div>
              </div>
            )}

            {issue.flag_count > 0 && (
              <div className="bg-red-50 p-3 rounded border border-red-200">
                <h4 className="font-medium text-red-900">Flags</h4>
                <p className="text-red-700 text-sm">
                  This issue has been flagged {issue.flag_count} time{issue.flag_count !== 1 ? 's' : ''} by community members.
                </p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex space-x-2 pt-4 border-t">
              <select
                value={issue.status}
                onChange={(e) => {
                  onStatusUpdate(issue.id, e.target.value);
                  onClose();
                }}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="reported">Mark as Reported</option>
                <option value="in_progress">Mark as In Progress</option>
                <option value="resolved">Mark as Resolved</option>
              </select>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IssueManagement;