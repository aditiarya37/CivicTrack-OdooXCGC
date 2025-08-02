// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Filter, Plus, AlertCircle } from 'lucide-react';
import IssueList from '../components/issues/IssueList';
import MapView from '../components/map/MapView';
import { getCurrentLocation } from '../services/location';
import { ISSUE_CATEGORIES, ISSUE_STATUSES, DISTANCE_OPTIONS } from '../utils/constants';
import api from '../services/api';

function Dashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    distance: 5
  });

  useEffect(() => {
    loadUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      loadIssues();
    }
  }, [userLocation, filters]);

  const loadUserLocation = async () => {
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
    } catch (error) {
      console.error('Failed to get location:', error);
      setError('Unable to get your location. Please enable location services.');
    }
  };

  const loadIssues = async () => {
    if (!userLocation) return;

    setLoading(true);
    try {
      const params = {
        lat: userLocation.latitude,
        lng: userLocation.longitude,
        radius: filters.distance,
        status: filters.status,
        category: filters.category
      };

      const response = await api.get('/issues/nearby', { params });
      setIssues(response.data.issues);
    } catch (error) {
      console.error('Failed to load issues:', error);
      setError('Failed to load issues. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading && !userLocation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Getting your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Community Issues</h1>
            <p className="text-gray-600 mt-1">
              Issues reported within {filters.distance}km of your location
            </p>
          </div>
          <Link
            to="/report"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Report Issue
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 flex items-center">
            <AlertCircle size={20} className="mr-2" />
            {error}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            {ISSUE_STATUSES.map(status => (
              <option key={status.id} value={status.id}>{status.name}</option>
            ))}
          </select>

          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {ISSUE_CATEGORIES.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>

          <select
            value={filters.distance}
            onChange={(e) => handleFilterChange('distance', parseInt(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {DISTANCE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <div className="ml-auto flex items-center space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'map' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Map View
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {loading ? 'Loading...' : `${issues.length} issue${issues.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <IssueList issues={issues} loading={loading} />
      ) : (
        <MapView 
          issues={issues} 
          userLocation={userLocation} 
          loading={loading}
        />
      )}
    </div>
  );
}

export default Dashboard;