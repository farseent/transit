// src/components/profile/ComplaintHistory.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ComplaintHistory = ({ complaints }) => {
  const [filterOption, setFilterOption] = useState('all');
  
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-warning/20 text-warning';
      case 'resolved':
        return 'bg-success/20 text-success';
      case 'under review':
      case 'in progress':
        return 'bg-info/20 text-info';
      case 'rejected':
        return 'bg-danger/20 text-danger';
      default:
        return 'bg-secondary-100 text-secondary-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'resolved':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'under review':
      case 'in progress':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        );
      case 'rejected':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  if (!complaints || complaints.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 bg-secondary-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-secondary-500">You haven't filed any complaints yet.</p>
      </div>
    );
  }
  
  // Filter complaints
  let filteredComplaints = [...complaints];
  if (filterOption !== 'all') {
    filteredComplaints = filteredComplaints.filter(
      complaint => complaint.status.toLowerCase() === filterOption.toLowerCase()
    );
  }

  return (
    <div>
      {/* Filter controls */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filterOption === 'all' ? 'bg-primary-500 text-white' : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
          }`}
          onClick={() => setFilterOption('all')}
        >
          All
        </button>
        <button
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filterOption === 'pending' ? 'bg-warning text-white' : 'bg-warning/20 text-warning hover:bg-warning/30'
          }`}
          onClick={() => setFilterOption('pending')}
        >
          Pending
        </button>
        <button
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filterOption === 'under review' ? 'bg-info text-white' : 'bg-info/20 text-info hover:bg-info/30'
          }`}
          onClick={() => setFilterOption('under review')}
        >
          Under Review
        </button>
        <button
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filterOption === 'resolved' ? 'bg-success text-white' : 'bg-success/20 text-success hover:bg-success/30'
          }`}
          onClick={() => setFilterOption('resolved')}
        >
          Resolved
        </button>
        <button
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filterOption === 'rejected' ? 'bg-danger text-white' : 'bg-danger/20 text-danger hover:bg-danger/30'
          }`}
          onClick={() => setFilterOption('rejected')}
        >
          Rejected
        </button>
      </div>

      {/* Complaints list */}
      {filteredComplaints.length === 0 ? (
        <div className="text-center py-8 bg-secondary-50 rounded-lg">
          <p className="text-secondary-500">No complaints match the selected filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComplaints.map((complaint) => (
            <div 
              key={complaint._id} 
              className="border rounded-lg shadow-card overflow-hidden bg-white hover:shadow-md transition-shadow"
            >
              <div className="p-4 sm:p-5">
                <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                      {complaint.subject || complaint.title}
                    </h3>
                    <div className="flex items-center text-sm text-secondary-500">
                      <span>Bus: {complaint.bus && complaint.bus.name ? complaint.bus.name : 'Not specified'}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className={`flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                    {getStatusIcon(complaint.status)}
                    {complaint.status}
                  </div>
                </div>
                
                <p className="text-secondary-600 mb-4 line-clamp-2">
                  {complaint.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-secondary-500">
                    <span>Category: {complaint.category}</span>
                    {complaint.route && (
                      <>
                        <span className="mx-2">•</span>
                        <span>Route: {complaint.route.name || complaint.route}</span>
                      </>
                    )}
                  </div>
                  <Link 
                    to={`/complaints/${complaint._id}`} 
                    className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    View Details
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              {complaint.responses && complaint.responses.length > 0 && (
                <div className="bg-secondary-50 px-4 py-3 border-t">
                  <div className="flex items-center text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary-400 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span className="text-secondary-600">
                      {complaint.responses.length} {complaint.responses.length === 1 ? 'response' : 'responses'}
                    </span>
                    <span className="mx-2 text-secondary-300">•</span>
                    <span className="text-secondary-600">
                      Last updated: {new Date(complaint.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplaintHistory;