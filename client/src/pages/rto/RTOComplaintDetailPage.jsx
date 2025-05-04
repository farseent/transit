import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
      
      // Reset comment field after successful submission
      setComment('');
      
      // Refetch the complaint to get updated data
      const updatedComplaint = await getComplaintById(id);
      setComplaint(updatedComplaint);
      
      // Scroll to the alert
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      console.error('Error updating complaint:', error);
      setAlert({
        show: true,
        type: 'error',
        message: 'Failed to update complaint status. Please try again.'
      });
    }
  };

  const getStatusBadgeClasses = (status) => {
    const baseClasses = "ml-2 px-3 py-1 rounded-full text-xs font-medium";
    
    switch(status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'inprogress':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'resolved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center p-4 bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading complaint details...</p>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen flex justify-center items-center p-4 bg-gray-50">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Complaint Not Found</h1>
            <p className="text-gray-600">The complaint you're looking for doesn't exist or has been removed.</p>
          </div>
          <button 
            onClick={() => navigate('/rto/complaints')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition duration-200 font-medium flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Complaints
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-500 text-white px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-xl md:text-2xl font-bold flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Complaint #{id}
              </h1>
              <p className="text-blue-100 mt-1">
                Category: {complaint.category}
              </p>
            </div>
            <button 
              onClick={() => navigate('/rto/complaints')}
              className="mt-4 md:mt-0 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to List
            </button>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {/* Alert */}
            {alert.show && (
              <Alert 
                type={alert.type} 
                message={alert.message} 
                onClose={() => setAlert({ ...alert, show: false })} 
                className="mb-6"
              />
            )}
            
            {/* Status Badge */}
            <div className="mb-6 flex flex-wrap items-center">
              <span className="text-lg font-medium mr-2">Status:</span>
              <span className={getStatusBadgeClasses(complaint.status)}>
                {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
              </span>
              <span className="ml-auto text-sm text-gray-500">
                Last Updated: {formatDate(complaint.updatedAt)}
              </span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Complaint Info */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Complaint Information
                </h2>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-start">
                    <span className="w-32 text-gray-600 font-medium">Category:</span>
                    <span className="flex-1">{complaint.category}</span>
                  </div>
                  <div className="flex flex-wrap items-start">
                    <span className="w-32 text-gray-600 font-medium">Submitted:</span>
                    <span className="flex-1">{formatDate(complaint.createdAt)}</span>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium mb-2">Description:</p>
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <p className="whitespace-pre-line">{complaint.description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* User & Bus Info */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  User & Bus Information
                </h2>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-start">
                    <span className="w-32 text-gray-600 font-medium">User:</span>
                    <span className="flex-1">{complaint.user?.name || 'N/A'}</span>
                  </div>
                  <div className="flex flex-wrap items-start">
                    <span className="w-32 text-gray-600 font-medium">Email:</span>
                    <span className="flex-1 break-words">{complaint.user?.email || 'N/A'}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <h3 className="text-md font-medium mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      Bus Details
                    </h3>
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-start">
                        <span className="w-32 text-gray-600">Bus Name:</span>
                        <span className="flex-1">{complaint.bus?.name || 'N/A'}</span>
                      </div>
                      <div className="flex flex-wrap items-start">
                        <span className="w-32 text-gray-600">Reg Number:</span>
                        <span className="flex-1">{complaint.bus?.regNumber || 'N/A'}</span>
                      </div>
                      <div className="flex flex-wrap items-start">
                        <span className="w-32 text-gray-600">Route:</span>
                        <span className="flex-1">{complaint.bus?.route?.name || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* RTO Comments */}
            {complaint.rtoComments && complaint.rtoComments.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                  </svg>
                  RTO Comments History
                </h2>
                <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                  <div className="divide-y divide-gray-200">
                    {complaint.rtoComments.map((commentItem, index) => (
                      <div key={index} className="p-4 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center mb-2">
                          <span className={getStatusBadgeClasses(commentItem.status)}>
                            {commentItem.status.charAt(0).toUpperCase() + commentItem.status.slice(1)}
                          </span>
                          <span className="ml-3 text-sm text-gray-500">
                            {formatDate(commentItem.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-line">{commentItem.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Update Status Form */}
            <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
              <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Update Complaint Status
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Change Status To
                    </label>
                    <div className="relative">
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 appearance-none"
                        required
                      >
                        <option value="pending">Pending</option>
                        <option value="inprogress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comment
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
                      rows="4"
                      placeholder="Add details about this status update..."
                      required
                    ></textarea>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition duration-200 flex items-center font-medium"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Update Status
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RTOComplaintDetailPage;