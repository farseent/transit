// AdminDashboardPage.jsx
import { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import StatsSummary from '../../components/admin/Dashboard/StatsSummary';
import ActivityLog from '../../components/admin/Dashboard/ActivityLog';
import ComplaintOverview from '../../components/admin/Dashboard/ComplaintOverview';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { Users, Bus, Map } from 'lucide-react';

const AdminDashboardPage = () => {
  const { stats, activityLog, loading, error, fetchSystemStats } = useAdmin();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Set page title
    document.title = "Admin Dashboard | Transit Hub";
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSystemStats();
    setTimeout(() => setRefreshing(false), 500); // Provide visual feedback
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your transit system</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading || refreshing}
          className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
            flex items-center space-x-2 transition-all shadow-sm
            ${(loading || refreshing) ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
          <svg xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} 
            viewBox="0 0 20 20" 
            fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {error && (
        <Alert 
          type="error" 
          message={error} 
          className="mb-6"
        />
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader size="large" />
          <p className="mt-4 text-gray-500">Loading dashboard data...</p>
        </div>
      ) : stats ? (
        <div className="space-y-8">
          <StatsSummary stats={stats} />
          
          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickActionCard 
              title="Manage Users"
              description="View and edit user permissions"
              icon={<Users size={30} />}
              linkTo="/admin/users"
              color="blue"
            />
            <QuickActionCard 
              title="Manage Buses"
              description="Add, edit or remove buses"
              icon={<Bus size={30} />}
              linkTo="/admin/buses"
              color="green"
            />
            <QuickActionCard 
              title="Manage Routes"
              description="Create and edit transit routes"
              icon={<Map size={30} />}
              linkTo="/admin/routes"
              color="orange"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityLog logs={activityLog} />
            <ComplaintOverview />
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-700">Unable to load dashboard data</p>
          <p className="text-gray-500 mt-2">Please check your connection and try again</p>
          <button 
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

// Quick Action Card Component
const QuickActionCard = ({ title, description, icon, linkTo, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    green: "bg-green-50 text-green-700 hover:bg-green-100",
    orange: "bg-orange-50 text-orange-700 hover:bg-orange-100",
    purple: "bg-purple-50 text-purple-700 hover:bg-purple-100"
  };

  return (
    <a 
      href={linkTo} 
      className={`block p-6 rounded-lg shadow-sm transition-all hover:shadow ${colorClasses[color]}`}
    >
      <div className="flex items-center">
        <div className="mr-4">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm opacity-80">{description}</p>
        </div>
      </div>
    </a>
  );
};

export default AdminDashboardPage;
