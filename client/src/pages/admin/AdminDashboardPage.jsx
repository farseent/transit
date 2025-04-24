import { useAdmin } from '../../context/AdminContext';
import StatsSummary from '../../components/admin/Dashboard/StatsSummary';
import ActivityLog from '../../components/admin/Dashboard/ActivityLog';
import ComplaintOverview from '../../components/admin/Dashboard/ComplaintOverview';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';

const AdminDashboardPage = () => {
  const { stats, activityLog, loading, error, fetchSystemStats } = useAdmin();

  const handleRefresh = () => {
    fetchSystemStats();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center space-x-2"
        >
          <span>Refresh Data</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {error && <Alert type="error" message={error} />}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size="large" />
        </div>
      ) : stats ? (
        <>
          <StatsSummary stats={stats} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityLog logs={activityLog} />
            <ComplaintOverview />
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">
          Unable to load dashboard data
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;