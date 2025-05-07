// src/pages/rto/RTOComplaintsPage.jsx
import React, { useEffect, useState } from 'react';
import ComplaintList from '../../components/rto/ComplaintList';
import { getComplaints } from '../../api/rtoApi';
import Alert from '../../components/common/Alert';
import { HiOutlineTicket, HiRefresh } from 'react-icons/hi';

const RTOComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const result = await getComplaints();
      setComplaints(result);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setAlert({
        show: true,
        type: 'error',
        message: 'Failed to load complaints. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleRefresh = () => {
    fetchComplaints();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center">
              <HiOutlineTicket className="text-blue-600 text-2xl mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Complaint Management</h1>
            </div>
            <button 
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors duration-200"
            >
              <HiRefresh className="mr-2" /> Refresh
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {alert.show && (
            <div className="mb-6">
              <Alert 
                type={alert.type} 
                message={alert.message} 
                onClose={() => setAlert({ ...alert, show: false })} 
              />
            </div>
          )}
          
          <ComplaintList 
            complaints={complaints}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default RTOComplaintsPage;