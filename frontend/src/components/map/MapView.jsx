// frontend/src/components/map/MapView.jsx - Fixed MapView component
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getCategoryIcon, getStatusColor, formatDate } from '../../utils/helpers';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons for different statuses
const createCustomIcon = (status) => {
  const colors = {
    'reported': '#f59e0b',
    'in_progress': '#3b82f6',
    'resolved': '#10b981'
  };
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${colors[status] || '#6b7280'}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

function MapView({ issues, userLocation, loading }) {
  const mapRef = useRef();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading map...</span>
        </div>
      </div>
    );
  }

  if (!userLocation) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <p className="text-gray-600">Unable to load map. Location access required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Map View</h3>
        <p className="text-sm text-gray-600">Issues near your location</p>
      </div>
      
      <div className="h-96">
        <MapContainer
          center={[userLocation.latitude, userLocation.longitude]}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* User location marker */}
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={L.divIcon({
              className: 'user-location-marker',
              html: '<div style="background-color: #2563eb; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            })}
          >
            <Popup>
              <div className="text-center">
                <strong>Your Location</strong>
              </div>
            </Popup>
          </Marker>

          {/* Issue markers */}
          {issues.map((issue) => (
            <Marker
              key={issue.id}
              position={[issue.latitude, issue.longitude]}
              icon={createCustomIcon(issue.status)}
            >
              <Popup maxWidth={300}>
                <div className="p-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{getCategoryIcon(issue.category)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                      {issue.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-1">{issue.title}</h4>
                  
                  <p className="text-gray-600 text-sm mb-2">
                    {issue.description.length > 100 
                      ? issue.description.substring(0, 100) + '...' 
                      : issue.description
                    }
                  </p>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>Category: {issue.category}</div>
                    <div>Reported: {formatDate(issue.created_at)}</div>
                    <div>
                      By: {issue.is_anonymous 
                        ? 'Anonymous' 
                        : `${issue.first_name || 'Unknown'} ${issue.last_name || ''}`
                      }
                    </div>
                    {issue.distance && (
                      <div>Distance: {issue.distance.toFixed(1)}km away</div>
                    )}
                  </div>

                  {issue.photos && issue.photos.length > 0 && (
                    <div className="mt-2">
                      <img
                        src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/uploads/${issue.photos[0]}`}
                        alt="Issue"
                        className="w-full h-20 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Legend:</h4>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-blue-600 border border-white"></div>
            <span className="text-gray-600">Your Location</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500 border border-white"></div>
            <span className="text-gray-600">Reported</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-blue-500 border border-white"></div>
            <span className="text-gray-600">In Progress</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-green-500 border border-white"></div>
            <span className="text-gray-600">Resolved</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapView;