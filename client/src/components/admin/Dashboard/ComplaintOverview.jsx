// ComplaintOverview.jsx
import { useState, useEffect } from 'react';
import adminApi from '../../../api/adminApi';
import Loader from '../../common/Loader';

const ComplaintOverview = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getRecentComplaints();
      setComplaints(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredComplaints = 
    activeFilter === 'all' 
      ? complaints 
      : complaints.filter(complaint => complaint.status === activeFilter);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recent Complaints</h2>
      </div>
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <FilterButton 
          label="All" 
          active={activeFilter === 'all'} 
          onClick={() => setActiveFilter('all')} 
        />
        <FilterButton 
          label="Pending" 
          active={activeFilter === 'pending'} 
          onClick={() => setActiveFilter('pending')} 
        />
        <FilterButton 
          label="Resolved" 
          active={activeFilter === 'resolved'} 
          onClick={() => setActiveFilter('resolved')} 
        />
        <FilterButton 
          label="Rejected" 
          active={activeFilter === 'rejected'} 
          onClick={() => setActiveFilter('rejected')} 
        />
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader size="small" />
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchComplaints}
            className="mt-2 text-sm text-red-700 hover:text-red-800"
          >
            Try Again
          </button>
        </div>
      ) : filteredComplaints.length > 0 ? (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {filteredComplaints.map(complaint => (
            <div 
              key={complaint._id} 
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <p className="font-medium text-gray-900">{complaint.bus?.name || 'Unknown Bus'}</p>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(complaint.status)}`}>
                  {complaint.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{complaint.description}</p>
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-gray-500">
                  By: {complaint.user?.name || 'Anonymous'}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 mt-2">
            {activeFilter === 'all' ? 'No recent complaints' : `No ${activeFilter} complaints`}
          </p>
        </div>
      )}
    </div>
  );
};

const FilterButton = ({ label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
        active 
          ? 'bg-blue-100 text-blue-800' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );
};

export default ComplaintOverview;
