// src/pages/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { BarChart3, Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import AdminDashboard from '../components/admin/AdminDashboard';
import IssueManagement from '../components/admin/IssueManagement';
import Analytics from '../components/admin/Analytics';

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'issues', name: 'Manage Issues', icon: AlertTriangle },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Panel</h1>
        <p className="text-gray-600">
          Manage community issues and monitor platform activity.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={18} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'dashboard' && <AdminDashboard />}
        {activeTab === 'issues' && <IssueManagement />}
        {activeTab === 'analytics' && <Analytics />}
      </div>
    </div>
  );
}

export default AdminPanel;