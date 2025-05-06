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

  // Empty state handler
  if (!complaints || complaints.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <div className="w-20 h-20 mx-auto mb-6 bg-secondary-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-secondary-900 mb-2">No Complaints Found</h3>
        <p className="text-secondary-500 max-w-sm mx-auto">You haven't filed any complaints yet. When you submit a complaint, it will appear here.</p>
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
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
      <h2 className="text-xl font-semibold text-secondary-900 mb-6">Your Complaint History</h2>
      
      {/* Filter controls - Scrollable on mobile */}
      <div className="mb-6 overflow-x-auto pb-2">
        <div className="flex gap-2 min-w-max">
          <button
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterOption === 'all' ? 'bg-primary-500 text-white' : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
            }`}
            onClick={() => setFilterOption('all')}
          >
            All
          </button>
          <button
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterOption === 'pending' ? 'bg-warning text-white' : 'bg-warning/20 text-warning hover:bg-warning/30'
            }`}
            onClick={() => setFilterOption('pending')}
          >
            Pending
          </button>
          <button
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterOption === 'under review' ? 'bg-info text-white' : 'bg-info/20 text-info hover:bg-info/30'
            }`}
            onClick={() => setFilterOption('under review')}
          >
            Under Review
          </button>
          <button
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterOption === 'resolved' ? 'bg-success text-white' : 'bg-success/20 text-success hover:bg-success/30'
            }`}
            onClick={() => setFilterOption('resolved')}
          >
            Resolved
          </button>
          <button
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterOption === 'rejected' ? 'bg-danger text-white' : 'bg-danger/20 text-danger hover:bg-danger/30'
            }`}
            onClick={() => setFilterOption('rejected')}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* No results state */}
      {filteredComplaints.length === 0 ? (
        <div className="text-center py-8 bg-secondary-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-secondary-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-secondary-500 font-medium">No complaints match the selected filter.</p>
          <button 
            onClick={() => setFilterOption('all')} 
            className="mt-3 text-primary-500 hover:text-primary-600 font-medium text-sm"
          >
            Show all complaints
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComplaints.map((complaint) => (
            <div 
              key={complaint._id} 
              className="border rounded-lg shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow"
            >
              <div className="p-4 sm:p-5">
                <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-1 truncate">
                      {complaint.subject || complaint.title}
                    </h3>
                    <div className="flex flex-wrap items-center text-sm text-secondary-500 gap-y-1">
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </span>
                      <span className="mx-2 hidden sm:inline">|</span>
                      <span className="flex items-center">
                        {complaint.category}
                      </span>
                    </div>
                  </div>
                  <div className={`flex items-center px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${getStatusColor(complaint.status)}`}>
                    {getStatusIcon(complaint.status)}
                    {complaint.status}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center text-sm text-secondary-500 mb-3 gap-y-1">
                  <span className="flex items-center">
                    Bus: {complaint.bus && complaint.bus.name ? complaint.bus.name : 'Not specified'}
                  </span>
                  {complaint.route && (
                    <>
                      <span className="mx-2 hidden sm:inline">•</span>
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        Route: {complaint.route.name || complaint.route}
                      </span>
                    </>
                  )}
                </div>
                
                <p className="text-secondary-600 mb-4 line-clamp-2 text-sm sm:text-base">
                  {complaint.description}
                </p>
                
                {/* RTO Comment - With visual distinction */}
                {complaint.rtoComments && complaint.rtoComments.length > 0 && (
                <div className="mt-2 mb-4 bg-blue-50 p-3 rounded-md text-sm text-secondary-700 border-l-4 border-info">
                  <div className="flex items-center mb-1 text-info font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    RTO Response
                  </div>
                  <p>
                    {
                      [...complaint.rtoComments]
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
                        .comment
                    }
                  </p>
                </div>
                )}
              </div>
              
              {/* Footer with responses count and last updated */}
              <div className=" px-4 py-3 border-t">
                <div className="flex flex-wrap justify-between items-center text-sm">
                  <div className="flex items-center text-secondary-500 mt-1 sm:mt-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Updated: {new Date(complaint.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
      
      {/* Pagination placeholder - if needed in the future */}
      {filteredComplaints.length > 10 && (
        <div className="mt-6 flex justify-center">
          <nav className="flex items-center space-x-1">
            <button className="px-2 py-1 rounded text-secondary-500 hover:bg-secondary-100" disabled>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="px-3 py-1 rounded bg-primary-500 text-white">1</button>
            <button className="px-3 py-1 rounded hover:bg-secondary-100 text-secondary-700">2</button>
            <button className="px-2 py-1 rounded text-secondary-500 hover:bg-secondary-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ComplaintHistory;