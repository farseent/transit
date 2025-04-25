import { useState } from "react";

const BusOwnerAssign = ({ busId, currentOwner, owners, onAssign }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedOwner, setSelectedOwner] = useState(currentOwner);
  
    const handleSave = () => {
      if (selectedOwner !== currentOwner) {
        onAssign(busId, selectedOwner);
      }
      setIsEditing(false);
    };
  
    return (
      <div className="flex items-center space-x-2">
        {isEditing ? (
          <>
            <select
              value={selectedOwner}
              onChange={(e) => setSelectedOwner(e.target.value)}
              className="p-1 border rounded text-sm"
            >
              <option value="">Unassigned</option>
              {owners.map(owner => (
                <option key={owner._id} value={owner._id}>
                  {owner.name}
                </option>
              ))}
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
            <span>{currentOwner ? owners.find(o => o._id === currentOwner)?.name || 'Unknown' : 'Unassigned'}</span>
            <button 
              onClick={() => setIsEditing(true)}
              className="px-2 py-1 bg-gray-100 rounded text-sm"
            >
              Assign
            </button>
          </>
        )}
      </div>
    );
  };
  
  export default BusOwnerAssign;