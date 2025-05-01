// ActivityLog.jsx
import { format } from 'date-fns';
import { useState } from 'react';

const ActivityLog = ({ logs }) => {
  const [expandedLog, setExpandedLog] = useState(null);

  const toggleExpand = (index) => {
    if (expandedLog === index) {
      setExpandedLog(null);
    } else {
      setExpandedLog(index);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        {logs.length > 0 && (
          <a href="/admin/activity" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
            View all
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </a>
        )}
      </div>
      
      {logs.length > 0 ? (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {logs.map((log, index) => (
            <div 
              key={index} 
              className="border-l-4 border-blue-500 pl-4 py-2 hover:bg-gray-50 transition-colors rounded"
              onClick={() => toggleExpand(index)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{log.adminId?.name || 'System'}</p>
                  <p className="text-sm text-gray-600">{log.action}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {format(new Date(log.timestamp), 'MMM d, h:mm a')}
                </span>
              </div>
              
              {log.changes && expandedLog === index && (
                <div className="mt-3 text-xs text-gray-600 bg-gray-100 p-3 rounded">
                  <p className="font-medium mb-1">Changes:</p>
                  {Object.entries(log.changes).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-3 gap-2">
                      <span className="font-medium">{key}:</span>
                      <span className="col-span-2 break-words">{JSON.stringify(value)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 mt-2">No recent activity</p>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
