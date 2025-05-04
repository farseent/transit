// src/components/rto/RecentComplaints.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Inbox, Loader2 } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
    'in-progress': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Progress' },
    'resolved': { bg: 'bg-green-100', text: 'text-green-800', label: 'Resolved' },
    'rejected': { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' }
  };

  const config = statusConfig[status] || statusConfig['pending'];

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

const RecentComplaints = ({ complaints, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredComplaints = searchTerm 
    ? complaints.filter(complaint => 
        complaint.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.bus?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : complaints;

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          <span className="ml-2 text-gray-600">Loading recent complaints...</span>
        </div>
      </div>
    );
  }

  if (!complaints || complaints.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Inbox className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900">No complaints found</h3>
          <p className="text-gray-500 mt-2">There are no recent complaints to display.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-bold">Recent Complaints</h2>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search complaints..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
            />
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredComplaints.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No matching complaints found.
                </td>
              </tr>
            ) : (
              filteredComplaints.map((complaint) => (
                <tr key={complaint._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link 
                      to={`/rto/complaints/${complaint._id}`} 
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                    >
                      {complaint.category}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{complaint.user?.name || 'Unknown'}</td>
                  <td className="px-6 py-4">{complaint.bus?.name || 'Unknown'}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={complaint.status} />
                  </td>
                  <td className="px-6 py-4">
                    {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <Link 
          to="/rto/complaints" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          View all complaints
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default RecentComplaints;