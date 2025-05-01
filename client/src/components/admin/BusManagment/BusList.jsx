import { useState } from 'react';
import { Edit, Trash, ChevronDown, ChevronUp, AlertCircle, Clock } from 'lucide-react';
import Button from '../../common/Button';

const BusList = ({ buses, onEditBus, onDeleteBus }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  
  const toggleRowExpansion = (busId) => {
    setExpandedRow(expandedRow === busId ? null : busId);
  };
  
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    
    try {
      // Check if already in HH:MM format
      if (/^\d{1,2}:\d{2}$/.test(timeString)) {
        return timeString;
      }
      
      // Try to format as HH:MM if it's a valid date
      const date = new Date(timeString);
      if (!isNaN(date)) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      }
      
      return timeString;
    } catch (e) {
      return timeString;
    }
  };

  if (buses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle size={48} className="text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No buses found</h3>
        <p className="mt-1 text-sm text-gray-500">No buses match your current search criteria.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* Desktop view */}
      <table className="min-w-full bg-white hidden md:table">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">Name</th>
            <th className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">Reg. Number</th>
            <th className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">Route</th>
            <th className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">Owner</th>
            <th className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">Status</th>
            <th className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">Schedules</th>
            <th className="py-3.5 px-4 text-right text-sm font-semibold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {buses.map(bus => (
            <tr key={bus._id} className="hover:bg-gray-50">
              <td className="py-4 px-4 text-sm font-medium text-gray-900">{bus.name}</td>
              <td className="py-4 px-4 text-sm text-gray-500">{bus.regNumber}</td>
              <td className="py-4 px-4 text-sm text-gray-500">
                {bus.route?.name || 'Unassigned'}
              </td>
              <td className="py-4 px-4 text-sm text-gray-500">
                {bus.owner?.name || 'Unassigned'}
              </td>
              <td className="py-4 px-4 text-sm">
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                  bus.isAvailable 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {bus.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </td>
              <td className="py-4 px-4 text-sm text-gray-500">
                {bus.schedules?.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {bus.schedules.slice(0, 3).map((schedule, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        <Clock size={12} className="mr-1" />
                        {formatTime(schedule.departureTime)}
                      </span>
                    ))}
                    {bus.schedules.length > 3 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        +{bus.schedules.length - 3} more
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400">No schedules</span>
                )}
              </td>
              <td className="py-4 px-4 text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onEditBus(bus)}
                    className="flex items-center"
                    aria-label="Edit bus"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="danger"
                    onClick={() => onDeleteBus(bus._id)}
                    className="flex items-center"
                    aria-label="Delete bus"
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile view */}
      <div className="block md:hidden">
        {buses.map(bus => (
          <div key={bus._id} className="bg-white border-b border-gray-200">
            <div 
              className="p-4 flex justify-between items-center cursor-pointer"
              onClick={() => toggleRowExpansion(bus._id)}
            >
              <div>
                <h3 className="text-sm font-medium text-gray-900">{bus.name}</h3>
                <p className="text-xs text-gray-500">{bus.regNumber}</p>
              </div>
              <div className="flex items-center">
                <span className={`mr-3 inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                  bus.isAvailable 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {bus.isAvailable ? 'Available' : 'Unavailable'}
                </span>
                {expandedRow === bus._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>
            
            {expandedRow === bus._id && (
              <div className="px-4 pb-4 space-y-3">
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="text-gray-500">Route</div>
                  <div className="text-gray-900">{bus.route?.name || 'Unassigned'}</div>
                  
                  <div className="text-gray-500">Owner</div>
                  <div className="text-gray-900">{bus.owner?.name || 'Unassigned'}</div>
                  
                  <div className="text-gray-500">Schedules</div>
                  <div>
                    {bus.schedules?.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {bus.schedules.map((schedule, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {formatTime(schedule.departureTime)}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">No schedules</span>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditBus(bus);
                    }}
                    className="flex items-center"
                  >
                    <Edit size={16} className="mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteBus(bus._id);
                    }}
                    className="flex items-center"
                  >
                    <Trash size={16} className="mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusList;