// src/components/issues/IssueDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, User, Flag, Clock } from 'lucide-react';
import { formatDate, getStatusColor, getCategoryIcon } from '../../utils/helpers';
import api from '../../services/api';
import Loading from '../common/Loading';

function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadIssue();
  }, [id]);

  const loadIssue = async () => {
    try {
      const response = await api.get(`/issues/${id}`);
      setIssue(response.data.issue);
    } catch (error) {
      setError('Failed to load issue details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  if (error || !issue) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Issue Not Found</h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getCategoryIcon(issue.category)}</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{issue.title}</h1>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(issue.status)}`}>
                    {issue.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500 capitalize">{issue.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">{issue.description}</p>
          </div>

          {/* Photos */}
          {issue.photos && issue.photos.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Photos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {issue.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/uploads/${photo}`}
                    alt={`Issue photo ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Location</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin size={16} className="text-gray-500" />
                <span className="text-gray-700">{issue.address || 'Address not provided'}</span>
              </div>
              <div className="text-sm text-gray-500">
                Coordinates: {issue.latitude}, {issue.longitude}
              </div>
            </div>
          </div>

          {/* Status History */}
          {issue.statusHistory && issue.statusHistory.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Status History</h3>
              <div className="space-y-3">
                {issue.statusHistory.map((log, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Clock size={16} className="text-gray-400" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                          {log.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-600">
                          {formatDate(log.changed_at)}
                        </span>
                        {log.first_name && (
                          <span className="text-sm text-gray-500">
                            by {log.first_name} {log.last_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reporter Info */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Reported By</h3>
            <div className="flex items-center space-x-3">
              <User size={20} className="text-gray-400" />
              <div>
                <p className="text-gray-700">
                  {issue.is_anonymous 
                    ? 'Anonymous User' 
                    : `${issue.first_name || 'Unknown'} ${issue.last_name || ''}`
                  }
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(issue.created_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IssueDetail;