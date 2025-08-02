// src/components/admin/Analytics.jsx
import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Calendar, Download, RefreshCw } from 'lucide-react';
import api from '../../services/api';

function Analytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/dashboard');
      setAnalyticsData(response.data.analytics);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = () => {
    // In a real app, this would generate and download a report
    alert('Report generation feature would be implemented here');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
          <p className="text-gray-600">Detailed insights into community issues and platform usage</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button
            onClick={loadAnalytics}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-2"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          <button
            onClick={generateReport}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Issues"
          value={analyticsData?.totalIssues || 0}
          change="+12%"
          icon={BarChart3}
          color="blue"
        />
        <MetricCard
          title="Recent Issues"
          value={analyticsData?.recentIssues || 0}
          change="+8%"
          icon={TrendingUp}
          color="green"
        />
        <MetricCard
          title="Resolution Rate"
          value={`${Math.round((analyticsData?.statusStats?.find(s => s.status === 'resolved')?.count || 0) / (analyticsData?.totalIssues || 1) * 100)}%`}
          change="+5%"
          icon={Calendar}
          color="purple"
        />
        <MetricCard
          title="Avg Response Time"
          value="2.3 days"
          change="-15%"
          icon={Calendar}
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Issues by Category</h3>
          <div className="space-y-4">
            {analyticsData?.categoryStats?.map((category, index) => {
              const percentage = Math.round((category.count / analyticsData.totalIssues) * 100);
              return (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {category.category}
                    </span>
                    <span className="text-sm text-gray-500">{category.count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Status Distribution</h3>
          <div className="space-y-4">
            {analyticsData?.statusStats?.map((status, index) => {
              const percentage = Math.round((status.count / analyticsData.totalIssues) * 100);
              const colors = {
                'reported': 'bg-yellow-500',
                'in_progress': 'bg-blue-500',
                'resolved': 'bg-green-500'
              };
              return (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {status.status.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-500">{status.count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${colors[status.status]} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Category Performance</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-sm font-medium text-gray-500">Category</th>
                  <th className="text-center py-2 text-sm font-medium text-gray-500">Total</th>
                  <th className="text-center py-2 text-sm font-medium text-gray-500">Resolved</th>
                  <th className="text-center py-2 text-sm font-medium text-gray-500">Rate</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData?.categoryStats?.map((category, index) => {
                  const resolvedCount = Math.floor(category.count * 0.7); // Mock data
                  const rate = Math.round((resolvedCount / category.count) * 100);
                  return (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2 text-sm text-gray-900 capitalize">{category.category}</td>
                      <td className="py-2 text-sm text-gray-900 text-center">{category.count}</td>
                      <td className="py-2 text-sm text-gray-900 text-center">{resolvedCount}</td>
                      <td className="py-2 text-center">
                        <span className={`text-sm px-2 py-1 rounded ${
                          rate >= 80 ? 'bg-green-100 text-green-800' :
                          rate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {rate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {/* Mock recent activity data */}
            {[
              { action: 'Issue resolved', category: 'Roads', time: '2 hours ago' },
              { action: 'New issue reported', category: 'Lighting', time: '4 hours ago' },
              { action: 'Status updated', category: 'Water', time: '6 hours ago' },
              { action: 'Issue flagged', category: 'Safety', time: '8 hours ago' },
              { action: 'Issue resolved', category: 'Cleanliness', time: '1 day ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.category}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Export Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={generateReport}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <Download className="h-6 w-6 text-blue-500 mb-2" />
            <h4 className="font-medium text-gray-900">Monthly Report</h4>
            <p className="text-sm text-gray-600">Comprehensive monthly analytics report</p>
          </button>
          <button
            onClick={generateReport}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <BarChart3 className="h-6 w-6 text-green-500 mb-2" />
            <h4 className="font-medium text-gray-900">Category Report</h4>
            <p className="text-sm text-gray-600">Detailed breakdown by issue category</p>
          </button>
          <button
            onClick={generateReport}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <TrendingUp className="h-6 w-6 text-purple-500 mb-2" />
            <h4 className="font-medium text-gray-900">Performance Report</h4>
            <p className="text-sm text-gray-600">Resolution times and efficiency metrics</p>
          </button>
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ title, value, change, icon: Icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-500',
    green: 'bg-green-500 text-green-500',
    purple: 'bg-purple-500 text-purple-500',
    orange: 'bg-orange-500 text-orange-500'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-opacity-10 ${colorClasses[color]}`}>
          <Icon className={`h-6 w-6 ${colorClasses[color].split(' ')[1]}`} />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-sm font-medium ${
          change.startsWith('+') ? 'text-green-600' : 'text-red-600'
        }`}>
          {change}
        </span>
        <span className="text-sm text-gray-500 ml-1">vs last period</span>
      </div>
    </div>
  );
}

export default Analytics;