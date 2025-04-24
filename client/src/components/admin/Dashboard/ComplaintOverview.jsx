import { useState, useEffect } from 'react';
import adminApi from '../../../api/adminApi';
import Loader from '../../common/Loader';

const ComplaintOverview = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getRecentComplaints();
      setComplaints(data);
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

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Recent Complaints</h2>
      {loading ? (
        <div className="flex justify-center py-4">
          <Loader size="small" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center py-4">{error}</p>
      ) : complaints.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {complaints.map(complaint => (
            <div key={complaint._id} className="border-b pb-3 last:border-0">
              <div className="flex justify-between">
                <p className="font-medium truncate">{complaint.bus?.name || 'Unknown Bus'}</p>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(complaint.status)}`}>
                  {complaint.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 truncate">{complaint.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                By: {complaint.user?.name || 'Anonymous'} • {new Date(complaint.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No recent complaints</p>
      )}
    </div>
  );
};

export default ComplaintOverview;