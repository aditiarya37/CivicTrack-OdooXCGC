// src/components/issues/IssueList.jsx
import React, { useState } from 'react';
import IssueCard from './IssueCard';
import Loading from '../common/Loading';
import { AlertCircle } from 'lucide-react';
import api from '../../services/api';

function IssueList({ issues, loading }) {
  const [flagging, setFlagging] = useState({});
  const [flagMessage, setFlagMessage] = useState('');

  const handleFlag = async (issueId) => {
    if (flagging[issueId]) return;

    setFlagging(prev => ({ ...prev, [issueId]: true }));
    
    try {
      await api.post(`/issues/${issueId}/flag`);
      setFlagMessage('Issue has been flagged for review.');
      setTimeout(() => setFlagMessage(''), 3000);
    } catch (error) {
      setFlagMessage('Failed to flag issue. Please try again.');
      setTimeout(() => setFlagMessage(''), 3000);
    } finally {
      setFlagging(prev => ({ ...prev, [issueId]: false }));
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      {flagMessage && (
        <div className={`mb-4 px-4 py-3 rounded-md flex items-center ${
          flagMessage.includes('flagged') 
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          <AlertCircle size={16} className="mr-2" />
          {flagMessage}
        </div>
      )}

      {issues.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Issues Found</h3>
          <p className="text-gray-600 mb-4">
            No issues have been reported in your area yet.
          </p>
          <a
            href="/report"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Report the First Issue
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onFlag={handleFlag}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default IssueList;