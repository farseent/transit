// src/components/rto/ComplaintList.jsx
import React, { useState } from 'react';
import Table from '../common/Table';
import Pagination from '../common/Pagination';
import Modal from '../common/Modal';
import { useNavigate } from 'react-router-dom';

const ComplaintList = ({ 
  complaints, 
  loading, 
  updateComplaintStatus, 
  totalComplaints, 
  currentPage, 
  onPageChange 
}) => {
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [comment, setComment] = useState('');
  const navigate = useNavigate();

  let onRowClick = (complaint) => {
    navigate(`/rto/complaints/${complaint._id}`);
  };

  const handleOpenModal = (complaint) => {
    setSelectedComplaint(complaint);
    setStatusUpdate(complaint.status);
    setComment('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedComplaint(null);
  };

  const handleSubmit = () => {
    updateComplaintStatus(selectedComplaint._id, {
      status: statusUpdate,
      rtoComment: comment
    });
    handleCloseModal();
  };

  const columns = [
    { header: 'User', accessor: 'user.name' },
    { header: 'Bus', accessor: 'bus.name' },
    { header: 'Reg Number', accessor: 'bus.regNumber' },
    { header: 'Category', accessor: 'category' },
    { header: 'Status', accessor: 'status', 
      cell: (complaint) => {
        const statusColors = {
          'pending': 'bg-yellow-100 text-yellow-800',
          'inprogress': 'bg-blue-100 text-blue-800',
          'resolved': 'bg-green-100 text-green-800',
          'rejected': 'bg-red-100 text-red-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${statusColors[complaint.status] || 'bg-gray-100'}`}>
            {complaint.status}
          </span>
        );
      }
    },
    { header: 'Date', accessor: 'createdAt', 
      cell: (complaint) => new Date(complaint.createdAt).toLocaleDateString()
    },
    { header: 'Actions', 
      cell: (complaint) => (
        <button 
          onClick={() => handleOpenModal(complaint)} 
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          Update
        </button>
      )
    },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Manage Complaints</h2>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <p>Loading complaints...</p>
        </div>
      ) : (
        <>
          <Table 
            data={complaints} 
            columns={columns}
            onRowClick={onRowClick} 
            emptyMessage="No complaints found"
          />
          
          <div className="mt-4">
            <Pagination 
              totalItems={totalComplaints}
              itemsPerPage={10}
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
          </div>
        </>
      )}

      {isModalOpen && selectedComplaint && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal}
          title="Update Complaint Status"
        >
          <div className="mb-4">
            <p><strong>User:</strong> {selectedComplaint.user?.name}</p>
            <p><strong>Bus:</strong> {selectedComplaint.bus?.name}</p>
            <p><strong>Reg Number:</strong> {selectedComplaint.bus?.regNumber}</p>
            <p><strong>Category:</strong> {selectedComplaint.category}</p>
            <p><strong>Description:</strong> {selectedComplaint.description}</p>
            <p><strong>Submitted:</strong> {new Date(selectedComplaint.createdAt).toLocaleString()}</p>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusUpdate}
              onChange={(e) => setStatusUpdate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
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
              rows="3"
              placeholder="Add a comment about this complaint status update..."
            ></textarea>
          </div>
          
          <div className="flex justify-end mt-4">
            <button
              onClick={handleCloseModal}
              className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
            >
              Update Status
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ComplaintList;
