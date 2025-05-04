// src/components/rto/ComplaintList.jsx
import React, { useState } from 'react';
import Table from '../common/Table';
import Pagination from '../common/Pagination';
import { useNavigate } from 'react-router-dom';
import { HiSearch, HiFilter, HiBadgeCheck, HiClock, HiExclamation } from 'react-icons/hi';

const ComplaintList = ({ 
  complaints, 
  loading, 
  totalComplaints, 
  currentPage, 
  onPageChange,
  totalPage
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  const handleRowClick = (complaint) => {
    navigate(`/rto/complaints/${complaint._id}`);
  };

  // Filter complaints based on search term and status filter
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = searchTerm === '' || 
      (complaint.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
       complaint.bus?.regNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       complaint.category?.toLowerCase().includes(searchTerm.toLowerCase()));
       
    const matchesStatus = filterStatus === '' || complaint.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { header: 'User', accessor: 'user.name' },
    { header: 'Bus', accessor: 'bus.name' },
    { header: 'Reg Number', accessor: 'bus.regNumber' },
    { header: 'Category', accessor: 'category' },
    { 
      header: 'Status', 
      accessor: 'status', 
      cell: (complaint) => {
        const statusConfig = {
          'pending': { 
            color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            icon: <HiClock className="mr-1" />
          },
          'inprogress': { 
            color: 'bg-blue-100 text-blue-800 border-blue-200',
            icon: <HiExclamation className="mr-1" />
          },
          'resolved': { 
            color: 'bg-green-100 text-green-800 border-green-200',
            icon: <HiBadgeCheck className="mr-1" />
          },
          'rejected': { 
            color: 'bg-red-100 text-red-800 border-red-200',
            icon: <HiExclamation className="mr-1" />
          }
        };
        
        const { color, icon } = statusConfig[complaint.status] || { 
          color: 'bg-gray-100 text-gray-800 border-gray-200', 
          icon: null 
        };
        
        return (
          <span className={`px-3 py-1 rounded-full text-xs flex items-center justify-center border ${color} whitespace-nowrap`}>
            {icon}
            {complaint.status}
          </span>
        );
      }
    },
    { 
      header: 'Date', 
      accessor: 'createdAt', 
      cell: (complaint) => new Date(complaint.createdAt).toLocaleDateString()
    },
    { 
      header: 'Actions', 
      cell: (complaint) => (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/rto/complaints/${complaint._id}`);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200 whitespace-nowrap"
        >
          View Details
        </button>
      )
    },
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'inprogress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-gray-600">Loading complaints...</p>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search input */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by user, bus number or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Status filter */}
          <div className="relative w-full md:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiFilter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-600">
          Showing {filteredComplaints.length} of {totalComplaints} total complaints
        </div>
      </div>
      
      {loading ? (
        <LoadingState />
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table 
              data={filteredComplaints} 
              columns={columns}
              onRowClick={handleRowClick} 
              emptyMessage="No complaints found"
              className="min-w-full"
              rowClassName="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
            />
          </div>
          
          <div className="mt-6">
            <Pagination 
              totalItems={totalComplaints}
              itemsPerPage={10}
              currentPage={currentPage}
              onPageChange={onPageChange}
              totalPage={totalPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ComplaintList;