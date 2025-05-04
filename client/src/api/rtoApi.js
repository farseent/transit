// src/api/rtoApi.js
import axios from './axios';

// Get complaints with pagination
export const getComplaints = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`/rto/complaints?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching complaints:', error);
    throw error;
  }
};

// Get a single complaint by ID
export const getComplaintById = async (complaintId) => {
  try {
    const response = await axios.get(`/rto/complaints/${complaintId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching complaint ${complaintId}:`, error);
    throw error;
  }
};

// Update complaint status
export const updateComplaintStatus = async (complaintId, updateData) => {
  try {
    const response = await axios.patch(`/rto/complaints/${complaintId}/status`, updateData);
    return response.data;
  } catch (error) {
    console.error(`Error updating complaint ${complaintId}:`, error);
    throw error;
  }
};

// Get complaint statistics
export const getComplaintStats = async () => {
  try {
    const response = await axios.get('/rto/complaints/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching complaint statistics:', error);
    throw error;
  }
};

// Get recent complaints for dashboard
export const getRecentComplaints = async (limit = 5) => {
  try {
    const response = await axios.get(`/rto/complaints/recent?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recent complaints:', error);
    throw error;
  }
};