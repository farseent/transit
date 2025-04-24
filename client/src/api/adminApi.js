import axios from './axios';

export default {
  // User Management
  getUsers: (params) => axios.get('/admin/users', { params }),
  updateUserRole: (userId, role) => 
    axios.put(`/admin/users/${userId}/role`, { role }),
  toggleUserStatus: (userId) => 
    axios.put(`/admin/users/${userId}/status`),

  // Bus Management
  createBus: (busData) => axios.post('/admin/buses', busData),
  assignBusToOwner: (busId, ownerId) => 
    axios.put(`/admin/buses/${busId}/owner`, { ownerId }),

  // Route Management
  createRoute: (routeData) => axios.post('/admin/routes', routeData),

  // Stats
  getSystemStats: () => axios.get('/admin/stats'),

  // Add these to the existing adminApi

// System settings
getSystemSettings: () => axios.get('/admin/settings'),
updateSystemSettings: (settings) => axios.put('/admin/settings', settings),

// Data endpoints
getOwners: () => axios.get('/admin/owners'),
getBuses: () => axios.get('/admin/buses'),
getRoutes: () => axios.get('/admin/routes'),
getRecentComplaints: () => axios.get('/admin/complaints/recent')

};