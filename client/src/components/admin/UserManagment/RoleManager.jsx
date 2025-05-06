import { useState } from "react";
import { PenSquare, Save, X } from "lucide-react";

const RoleManager = ({ currentRole, userId, onRoleChange, isMobile = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRole, setSelectedRole] = useState(currentRole);

  const handleClose = () => {
    setSelectedRole(currentRole); // Reset to original value
    setIsEditing(false);
  };
  
  const handleSave = () => {
    if (selectedRole !== currentRole) {    
      onRoleChange(userId, selectedRole);
    }
    setIsEditing(false);
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'owner':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`flex items-center ${isMobile ? 'inline-flex' : ''}`}>
      {isEditing ? (
        <div className="flex items-center space-x-2">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className=" text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="user">User</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
            <option value="rto">Rto</option>
          </select>
          <button 
            onClick={handleSave}
            className="p-1 text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
            title="Save"
          >
            <Save size={18} />
          </button>
          <button 
            onClick={handleClose}
            className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded-md"
            title="Cancel"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${getRoleBadgeClass(currentRole)}`}>
            {currentRole}
          </span>
          <button 
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded-md"
            title="Edit role"
          >
            <PenSquare size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default RoleManager;