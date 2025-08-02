// src/components/issues/IssueCard.jsx
import React from 'react';
import { MapPin, Calendar, User, Flag, Eye } from 'lucide-react';
import { formatDate, getStatusColor, getCategoryIcon, truncateText } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';

function IssueCard({ issue, onFlag }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/issues/${issue.id}`);
  };

  const handleFlag = (e) => {
    e.stopPropagation();
    onFlag(issue.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
      <div onClick={handleViewDetails} className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getCategoryIcon(issue.category)}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
              {issue.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleFlag}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Flag as inappropriate"
            >
              <Flag size={16} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{issue.title}</h3>

        {/* Description */}
        <p className="text-gray-600 mb-4">{truncateText(issue.description, 150)}</p>

        {/* Photos */}
        {issue.photos && issue.photos.length > 0 && (
          <div className="mb-4">
            <div className="flex space-x-2 overflow-x-auto">
              {issue.photos.slice(0, 3).map((photo, index) => (
                <img
                  key={index}
                  src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/uploads/${photo}`}
                  alt={`Issue photo ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-md border border-gray-200 flex-shrink-0"
                />
              ))}
              {issue.photos.length > 3 && (
                <div className="w-20 h-20 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center text-gray-500 text-sm">
                  +{issue.photos.length - 3}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User size={14} />
              <span>
                {issue.is_anonymous 
                  ? 'Anonymous' 
                  : `${issue.first_name || 'Unknown'} ${issue.last_name || ''}`
                }
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>{formatDate(issue.created_at)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin size={14} />
            <span>{issue.distance ? `${issue.distance.toFixed(1)}km away` : 'Location'}</span>
          </div>
        </div>
      </div>

      {/* View Details Button */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <button
          onClick={handleViewDetails}
          className="w-full flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          <Eye size={16} />
          <span>View Details</span>
        </button>
      </div>
    </div>
  );
}

export default IssueCard;