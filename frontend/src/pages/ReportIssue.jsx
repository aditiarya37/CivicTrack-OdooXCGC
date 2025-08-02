// src/pages/ReportIssue.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IssueForm from '../components/issues/IssueForm';
import { ArrowLeft } from 'lucide-react';

function ReportIssue() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitSuccess = () => {
    // Show success message and redirect
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Report an Issue</h1>
        <p className="text-gray-600 text-lg">
          Help improve your community by reporting local issues. Your report will be visible to other community members and local authorities.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <IssueForm 
          onSubmitSuccess={handleSubmitSuccess}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-yellow-800 font-medium mb-2">📋 Before You Submit</h3>
        <ul className="text-yellow-700 text-sm space-y-1">
          <li>• Make sure you're in a safe location before taking photos</li>
          <li>• Provide clear, accurate location information</li>
          <li>• Include relevant details that will help authorities understand the issue</li>
          <li>• Avoid including personal or sensitive information in your report</li>
        </ul>
      </div>
    </div>
  );
}

export default ReportIssue;