import RoleManager from './RoleManager';
// import Button from '../../common/Button';

const UserList = ({ users, onRoleChange, onStatusToggle, onViewDetails }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
          {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> */}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {users.map((user) => (
          <tr key={user._id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {user.email}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <RoleManager 
                currentRole={user.role} 
                userId={user._id}
                onRoleChange={onRoleChange}
              />
            </td>
            {/* <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div className="flex space-x-2">
                <Button
                  onClick={() => onStatusToggle(user._id)}
                  size="xs"
                  variant={user.isActive ? 'danger' : 'success'}
                >
                  {user.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  onClick={() => onViewDetails(user)}
                  size="xs"
                  variant="outline"
                >
                  Details
                </Button>
              </div>
            </td> */}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserList;