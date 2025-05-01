import { useState, useEffect } from 'react';
import adminApi from '../../api/adminApi';
import UserList from '../../components/admin/UserManagment/UserList';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { getUserRoleName } from '../../utils/permissions';
import { Search, Filter, X } from 'lucide-react';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalUsers: 0
  });
  const [filters, setFilters] = useState({
    role: '',
    search: '',
    isActive: ''
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '') delete params[key];
      });

      const response = await adminApi.getUsers(params);
      setUsers(response.data.users);
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.totalPages,
        totalUsers: response.data.totalCount
      }));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminApi.updateUserRole(userId, newRole);
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
      setSuccess(`User role updated to ${getUserRoleName(newRole)}`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleResetFilters = () => {
    setFilters({
      role: '',
      search: '',
      isActive: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchUsers();
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(val => val !== '');
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, filters]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Search & Filters Header */}
        <div className="border-b border-gray-200 bg-gray-50 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearchSubmit} className="relative flex-grow">
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full p-2 pl-10 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </form>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Filter size={16} />
                <span className="hidden sm:inline">Filters</span>
                {hasActiveFilters() && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {Object.values(filters).filter(val => val !== '').length}
                  </span>
                )}
              </Button>
              
              {hasActiveFilters() && (
                <Button 
                  onClick={handleResetFilters}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <X size={16} />
                  <span className="hidden sm:inline">Clear</span>
                </Button>
              )}
            </div>
          </div>

          {/* Filter Panel */}
          {showFilterPanel && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md border border-gray-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.role}
                  onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                >
                  <option value="">All Roles</option>
                  <option value="user">Users</option>
                  <option value="owner">Owners</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
              
            </div>
          )}
        </div>

        {/* Alerts */}
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

        {/* Users Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader size="lg" />
          </div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <UserList 
              users={users} 
              onRoleChange={handleRoleChange}
              onViewDetails={handleViewDetails}
            />
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Search className="text-gray-400" size={24} />
            </div>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <div className="mt-6">
              <Button
                onClick={handleResetFilters}
                variant="outline"
                size="sm"
              >
                Clear filters
              </Button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {users.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              <Button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              {/* <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.limit, pagination.totalUsers)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.totalUsers}</span> results
                </p>
              </div> */}
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      <Modal 
        isOpen={showUserDetails} 
        onClose={() => setShowUserDetails(false)}
        title="User Details"
        size="md"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-medium text-gray-600">
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-medium">{selectedUser.name}</h2>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Role</h3>
                <p className="mt-1 font-medium">{getUserRoleName(selectedUser.role)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Joined</h3>
                <p className="mt-1">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 flex justify-end space-x-3">
              <Button 
                onClick={() => setShowUserDetails(false)}
                variant="outline"
                size="sm"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagementPage;