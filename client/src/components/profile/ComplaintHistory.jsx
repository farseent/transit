// src/components/profile/ComplaintHistory.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ComplaintHistory = ({ complaints }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!complaints || complaints.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-card p-6">
        <p className="text-gray-500">You haven't submitted any complaints yet.</p>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg shadow-card p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Complaints</h2>
      
      {complaints && complaints.length > 0 ? (
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-start mb-2">
                <Link 
                  to={`/bus/${complaint.busId}`} 
                  className="text-lg font-medium text-primary-500 hover:underline"
                >
                  {complaint.busName}
                </Link>
                <span className="text-sm text-gray-500">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center mb-2">
                <span className="text-sm text-gray-600 mr-2">Status:</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(complaint.status)}`}>
                  {complaint.status}
                </span>
              </div>
              
              <div className="mb-2">
                <span className="text-sm text-gray-600 mr-2">Issue Type:</span>
                <span className="capitalize">{complaint.type}</span>
              </div>
              
              <p className="text-gray-700 mt-2">{complaint.description}</p>
              
              {complaint.response && (
                <div className="mt-3 bg-gray-50 p-3 rounded">
                  <p className="text-sm font-medium text-gray-600">Response:</p>
                  <p className="text-gray-700">{complaint.response}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-500">You haven't filed any complaints yet.</p>
        </div>
      )}
    </div>
  );
};

export default ComplaintHistory;