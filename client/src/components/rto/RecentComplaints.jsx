// src/components/rto/RecentComplaints.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const RecentComplaints = ({ complaints, loading }) => {
  if (loading) {
    return <p>Loading recent complaints...</p>;
  }

  if (!complaints || complaints.length === 0) {
    return <p>No recent complaints found.</p>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Recent Complaints</h2>
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
            {complaints.map((complaint) => (
              <tr key={complaint._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link to={`/rto/complaints/${complaint._id}`} className="text-blue-600 hover:underline">
                    {complaint.category}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{complaint.user?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{complaint.bus?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {complaint.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <Link to="/rto/complaints" className="text-blue-600 hover:underline">
          View all complaints
        </Link>
      </div>
    </div>
  );
};

export default RecentComplaints;