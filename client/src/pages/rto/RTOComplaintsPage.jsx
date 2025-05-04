// src/pages/rto/RTOComplaintsPage.jsx
import React, { useEffect, useState } from 'react';
import RTOLayout from '../../components/rto/RTOLayout';
import ComplaintList from '../../components/rto/ComplaintList';
import { getComplaints, updateComplaintStatus } from '../../api/rtoApi';
import Alert from '../../components/common/Alert';

const RTOComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalComplaints, setTotalComplaints] = useState(0);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const fetchComplaints = async (page = 1) => {
    try {
      setLoading(true);
      const result = await getComplaints(page);
      setComplaints(result.complaints);
      setTotalComplaints(result.total);
      setCurrentPage(page);
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
    fetchComplaints(currentPage);
  }, [currentPage]);

  const handleUpdateStatus = async (complaintId, updateData) => {
    try {
      await updateComplaintStatus(complaintId, updateData);
      
      // Update local state to reflect the change
      setComplaints(complaints.map(complaint => 
        complaint._id === complaintId 
          ? { ...complaint, status: updateData.status } 
          : complaint
      ));
      
      setAlert({
        show: true,
        type: 'success',
        message: 'Complaint status updated successfully!'
      });
      
      // Refresh the data to get the latest changes
      fetchComplaints(currentPage);
    } catch (error) {
      console.error('Error updating complaint status:', error);
      setAlert({
        show: true,
        type: 'error',
        message: 'Failed to update complaint status. Please try again.'
      });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <RTOLayout>
      <div>
        <h1 className="text-2xl font-bold mb-6">Complaint Management</h1>
        
        {alert.show && (
          <Alert 
            type={alert.type} 
            message={alert.message} 
            onClose={() => setAlert({ ...alert, show: false })} 
          />
        )}
        
        <ComplaintList 
          complaints={complaints}
          loading={loading}
          updateComplaintStatus={handleUpdateStatus}
          totalComplaints={totalComplaints}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </RTOLayout>
  );
};

export default RTOComplaintsPage;
