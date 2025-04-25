import { useState, useEffect } from 'react';
import adminApi from '../../api/adminApi';
import UserList from '../../components/admin/UserManagment/UserList';
import UserForm from '../../components/admin/UserManagment/UserForm';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { getUserRoleName } from '../../utils/permissions';

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
    search: ''
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  const handleStatusToggle = async (userId) => {
    try {
      const response = await adminApi.toggleUserStatus(userId);
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isActive: response.data.isActive } : user
      ));
      setSuccess(`User ${response.data.isActive ? 'activated' : 'deactivated'} successfully`);
      setTimeout(() => setSuccess(null), 3000);
      
      // Close details modal if open for this user
      if (selectedUser?._id === userId) {
        setShowUserDetails(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const newUser = await adminApi.createUser(userData);
      setUsers([newUser, ...users]);
      setSuccess('User created successfully');
      setTimeout(() => setSuccess(null), 3000);
      setShowCreateModal(false);
      
      // Update pagination if we added to a full page
      if (users.length === pagination.limit && users.length === pagination.totalUsers) {
        setPagination(prev => ({
          ...prev,
          totalUsers: prev.totalUsers + 1,
          totalPages: Math.ceil((prev.totalUsers + 1) / prev.limit)
        }));
      }
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

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, filters]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">User Management</h1>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <select
            className="p-2 border rounded flex-1 md:flex-none md:w-48"
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          >
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="owner">Owners</option>
            <option value="admin">Admins</option>
          </select>
        
          <input
            type="text"
            placeholder="Search by name or email..."
            className="p-2 border rounded flex-grow"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          
          <Button 
            onClick={handleResetFilters}
            variant="outline"
            size="sm"
            className="whitespace-nowrap"
          >
            Reset Filters
          </Button>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : users.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <UserList 
                users={users} 
                onRoleChange={handleRoleChange}
                onStatusToggle={handleStatusToggle}
                onViewDetails={handleViewDetails}
              />
            </div>
            <div className="mt-4">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No users found matching your criteria
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
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <p>{selectedUser.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p>{selectedUser.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Role</h3>
                <p>{getUserRoleName(selectedUser.role)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedUser.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {selectedUser.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Joined</h3>
                <p>{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Last Login</h3>
                <p>{selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : 'Never'}</p>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end space-x-3">
              <Button 
                onClick={() => {
                  handleStatusToggle(selectedUser._id);
                }}
                variant={selectedUser.isActive ? 'danger' : 'success'}
                size="sm"
              >
                {selectedUser.isActive ? 'Deactivate User' : 'Activate User'}
              </Button>
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

      {/* Create User Modal */}
      <Modal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        title="Create New User"
        size="md"
      >
        <UserForm 
          onSubmit={handleCreateUser}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
    </div>
  );
};

export default UserManagementPage;