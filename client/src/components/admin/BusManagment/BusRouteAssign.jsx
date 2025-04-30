// src/components/admin/BusManagement/BusRouteAssign.jsx
import { useState } from "react";

const BusRouteAssign = ({ busId, currentRoute, routes = [], onAssign }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(currentRoute);

  const handleSave = () => {
    if (selectedRoute !== currentRoute) {
      onAssign(busId, selectedRoute);
    }
    setIsEditing(false);
  };

  return (
    <div className="flex items-center space-x-2">
      {isEditing ? (
        <>
          <select
            value={selectedRoute || ''}
            onChange={(e) => setSelectedRoute(e.target.value)}
            className="p-1 border rounded text-sm"
          >
            <option value="">Unassigned</option>
            {Array.isArray(routes) && routes.map(route => (
              <option key={route._id} value={route._id}>
                {route.name}
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
          <span>
            {currentRoute 
              ? routes.find(r => r._id === currentRoute)?.name || 'Unknown' 
              : 'Unassigned'}
          </span>
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

export default BusRouteAssign;