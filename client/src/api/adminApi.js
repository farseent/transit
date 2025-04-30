import axios from './axios';

export default {
  // User Management
  getUsers: (params) => axios.get('/admin/users', { params }),
  updateUserRole: (userId, role) => axios.put(`/admin/users/${userId}/role`, { role }),
  toggleUserStatus: (userId) => axios.put(`/admin/users/${userId}/status`),
  getUser: (id) => axios.get(`/admin/users/${id}`),

  // Bus Management
  createBus: (busData) => axios.post('/admin/buses', busData),
  assignBusToOwner: (busId, ownerId) =>  axios.put(`/admin/buses/${busId}/owner`, { ownerId }),
  assignBusToRoute:(busId, routeId) => axios.patch(`/admin/buses/${busId}/route`, { routeId }),
  getBus: (id) => axios.get(`/admin/buses/${id}`),
  updateBus: (id, busData) => axios.put(`/admin/buses/${id}`, busData),
  deleteBus: (id) => axios.delete(`/admin/buses/${id}`),
  getBusesPaginated: (params) => axios.get('/admin/buses/paginated', { params }),

  // Route Management
  createRoute: (routeData) => axios.post('/admin/routes', routeData),
  deleteRoute: (id) => axios.delete(`/admin/routes/${id}`),
  updateRoute: (id, routeData) => axios.put(`/admin/routes/${id}`, routeData),
  getRoute: (id) => axios.get(`/admin/routes/${id}`),
  getRoutesPaginated: (params) => axios.get('/admin/routes/paginated', { params }),

  // ===== STOP MANAGEMENT =====
  createStop: (stopData) => axios.post('/admin/stops', stopData),
  updateStop:(id, stopData) => axios.put(`/admin/stops/${id}`, stopData),
  getStops: () => axios.get('/admin/stops'),
  deleteStop: (id) => axios.delete(`/admin/stops/${id}`),

  // Stats
  getSystemStats: () => axios.get('/admin/stats'),

  // Add these to the existing adminApi

  // System settings
  getSystemSettings: () => axios.get('/admin/settings'),
  updateSystemSettings: (settings) => axios.put('/admin/settings', settings),

  // ===== ACTIVITY LOGS =====
  getActivityLogs: (params) => axios.get('/admin/activity-logs', { params }),

  // ===== COMPLAINT MANAGEMENT =====
  updateComplaintStatus: (id, status) => axios.put(`/admin/complaints/${id}/status`, { status }),
  getComplaint: (id) => axios.get(`/admin/complaints/${id}`),

  // Data endpoints
  getOwners: () => axios.get('/admin/owners'),
  getBuses: () => axios.get('/admin/buses'),
  getRoutes: () => axios.get('/admin/routes'),
  getRecentComplaints: () => axios.get('/admin/complaints/recent')

};