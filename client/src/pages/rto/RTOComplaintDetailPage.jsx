import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RTOLayout from '../../components/rto/RTOLayout';
import { getComplaintById, updateComplaintStatus } from '../../api/rtoApi';
import Alert from '../../components/common/Alert';

const RTOComplaintDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [comment, setComment] = useState('');
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        const data = await getComplaintById(id);
        setComplaint(data);
        setStatus(data.status);
      } catch (error) {
        console.error('Error fetching complaint:', error);
        setAlert({
          show: true,
          type: 'error',
          message: 'Failed to load complaint details. Please try again.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateComplaintStatus(id, {
        status,
        rtoComment: comment
      });
      
      setAlert({
        show: true,
        type: 'success',
        message: 'Complaint status updated successfully!'
      });
      
      // Refetch the complaint to get updated data
      const updatedComplaint = await getComplaintById(id);
      setComplaint(updatedComplaint);
      
    } catch (error) {
      console.error('Error updating complaint:', error);
      setAlert({
        show: true,
        type: 'error',
        message: 'Failed to update complaint status. Please try again.'
      });
    }
  };

  if (loading) {
    return (
      <RTOLayout>
        <div className="flex justify-center items-center h-64">
          <p>Loading complaint details...</p>
        </div>
      </RTOLayout>
    );
  }

  if (!complaint) {
    return (
      <RTOLayout>
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">Complaint Not Found</h1>
          <p>The complaint you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate('/rto/complaints')}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Back to Complaints
          </button>
        </div>
      </RTOLayout>
    );
  }

  return (
    <RTOLayout>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Complaint Detail</h1>
          <button 
            onClick={() => navigate('/rto/complaints')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded"
          >
            Back to List
          </button>
        </div>
        
        {alert.show && (
          <Alert 
            type={alert.type} 
            message={alert.message} 
            onClose={() => setAlert({ ...alert, show: false })} 
          />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-medium mb-2">Complaint Information</h2>
            <div className="bg-gray-50 p-4 rounded">
              <p><strong>Subject:</strong> {complaint.category}</p>
              <p><strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  complaint.status === 'inprogress' ? 'bg-blue-100 text-blue-800' :
                  complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {complaint.status}
                </span>
              </p>
              <p><strong>Submitted:</strong> {new Date(complaint.createdAt).toLocaleString()}</p>
              <p><strong>Last Updated:</strong> {new Date(complaint.updatedAt).toLocaleString()}</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-medium mb-2">User & Bus Information</h2>
            <div className="bg-gray-50 p-4 rounded">
              <p><strong>User:</strong> {complaint.user?.name}</p>
              <p><strong>Email:</strong> {complaint.user?.email}</p>
              <p><strong>Bus Name:</strong> {complaint.bus?.name}</p>
              <p><strong>Bus Number:</strong> {complaint.bus?.regNumber}</p>
              <p><strong>Route:</strong> {complaint.bus?.route?.name}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Complaint Description</h2>
          <div className="bg-gray-50 p-4 rounded">
            <p>{complaint.description}</p>
          </div>
        </div>
        
        {complaint.rtoComments && complaint.rtoComments.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">RTO Comments</h2>
            <div className="bg-gray-50 p-4 rounded">
              {complaint.rtoComments.map((comment, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <p className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleString()} | Status changed to: <strong>{comment.status}</strong>
                  </p>
                  <p>{comment.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-8">
          <h2 className="text-lg font-medium mb-4">Update Complaint Status</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="pending">Pending</option>
                <option value="inprogress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="4"
                placeholder="Add a comment about this status update"
                required
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Update Status
              </button>
            </div>
          </form>
        </div>
      </div>
    </RTOLayout>
  );
};

export default RTOComplaintDetailPage;