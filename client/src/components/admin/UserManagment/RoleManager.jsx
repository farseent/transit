import { useState } from "react";

const RoleManager = ({ currentRole, userId, onRoleChange }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedRole, setSelectedRole] = useState(currentRole);
  
    const handleSave = () => {
      if (selectedRole !== currentRole) {
        onRoleChange(userId, selectedRole);
      }
      setIsEditing(false);
    };
  
    return (
      <div className="flex items-center space-x-2">
        {isEditing ? (
          <>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="p-1 border rounded text-sm"
            >
              <option value="user">User</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
            </select>
            <button 
              onClick={handleSave}
              className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
            >
              Save
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              className="px-2 py-1 bg-gray-200 rounded text-sm"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <span className="capitalize">{currentRole}</span>
            <button 
              onClick={() => setIsEditing(true)}
              className="px-2 py-1 bg-gray-100 rounded text-sm"
            >
              Edit
            </button>
          </>
        )}
      </div>
    );
  };
  
  export default RoleManager;