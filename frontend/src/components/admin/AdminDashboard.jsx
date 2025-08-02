// src/components/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { BarChart3, Users, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import api from '../../services/api';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data.analytics);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Issues',
      value: stats?.totalIssues || 0,
      icon: AlertTriangle,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'This Week',
      value: stats?.recentIssues || 0,
      icon: TrendingUp,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Resolved',
      value: stats?.statusStats?.find(s => s.status === 'resolved')?.count || 0,
      icon: CheckCircle,
      color: 'bg-green-600',
      change: '+15%'
    },
    {
      title: 'In Progress',
      value: stats?.statusStats?.find(s => s.status === 'in_progress')?.count || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      change: '-3%'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                  <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Issues by Category</h3>
          <div className="space-y-3">
            {stats?.categoryStats?.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">{category.category}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ 
                        width: `${(category.count / Math.max(...(stats.categoryStats?.map(c => c.count) || [1]))) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">{category.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Issues by Status</h3>
          <div className="space-y-4">
            {stats?.statusStats?.map((status, index) => {
              const colors = {
                'reported': 'bg-yellow-500',
                'in_progress': 'bg-blue-500',
                'resolved': 'bg-green-500'
              };
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${colors[status.status] || 'bg-gray-500'}`}></div>
                    <span className="text-sm text-gray-600 capitalize">
                      {status.status.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{status.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <AlertTriangle className="h-6 w-6 text-yellow-500 mb-2" />
            <h4 className="font-medium text-gray-900">Review Flagged Issues</h4>
            <p className="text-sm text-gray-600">Check issues flagged by community</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <Clock className="h-6 w-6 text-blue-500 mb-2" />
            <h4 className="font-medium text-gray-900">Update Status</h4>
            <p className="text-sm text-gray-600">Change issue status to in progress or resolved</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <BarChart3 className="h-6 w-6 text-green-500 mb-2" />
            <h4 className="font-medium text-gray-900">Generate Report</h4>
            <p className="text-sm text-gray-600">Create monthly community report</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;