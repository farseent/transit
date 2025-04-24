import { format } from 'date-fns';

const ActivityLog = ({ logs }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      {logs.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="border-b pb-3 last:border-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{log.adminId?.name || 'System'}</p>
                  <p className="text-sm">{log.action}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {format(new Date(log.timestamp), 'MMM d, h:mm a')}
                </span>
              </div>
              {log.changes && (
                <div className="mt-1 text-xs text-gray-600">
                  {Object.entries(log.changes).map(([key, value]) => (
                    <p key={key}>{key}: {JSON.stringify(value)}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No recent activity</p>
      )}
    </div>
  );
};

export default ActivityLog;