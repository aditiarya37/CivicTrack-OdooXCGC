// src/pages/Categories.jsx
import React from 'react';
import { ISSUE_CATEGORIES } from '../utils/constants';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function Categories() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Issue Categories</h1>
        <p className="text-gray-600 text-lg">
          Learn about the different types of issues you can report to help improve your community.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {ISSUE_CATEGORIES.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">{category.icon}</span>
              <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
            </div>
            <p className="text-gray-600 mb-4">{category.description}</p>
            <div className="text-sm text-gray-500">
              Click "Report Issue" to report {category.name.toLowerCase()} related problems.
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">Ready to Report an Issue?</h2>
        <p className="text-blue-700 mb-4">
          Help make your community better by reporting issues you encounter. Every report helps local authorities prioritize and address community needs.
        </p>
        <Link
          to="/report"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Report an Issue
          <ArrowRight size={16} className="ml-2" />
        </Link>
      </div>

      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Reporting Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">✅ What to Report</h3>
            <ul className="text-gray-700 space-y-1">
              <li>• Public infrastructure issues</li>
              <li>• Safety hazards in public areas</li>
              <li>• Cleanliness and sanitation problems</li>
              <li>• Public lighting issues</li>
              <li>• Water supply problems</li>
              <li>• Road and transportation issues</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">❌ What NOT to Report</h3>
            <ul className="text-gray-700 space-y-1">
              <li>• Private property issues</li>
              <li>• Medical emergencies (call 911)</li>
              <li>• Criminal activity (call police)</li>
              <li>• Fire hazards (call fire department)</li>
              <li>• Personal disputes</li>
              <li>• Commercial complaints</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Categories;