// src/components/rto/ComplaintStats.jsx
import React from 'react';

const ComplaintStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm font-medium">Total Complaints</h3>
        <p className="text-2xl font-bold">{stats.total || 0}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-yellow-500 text-sm font-medium">Pending</h3>
        <p className="text-2xl font-bold">{stats.pending || 0}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-blue-500 text-sm font-medium">In Progress</h3>
        <p className="text-2xl font-bold">{stats.inprogress || 0}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-green-500 text-sm font-medium">Resolved</h3>
        <p className="text-2xl font-bold">{stats.resolved || 0}</p>
      </div>
    </div>
  );
};

export default ComplaintStats;
