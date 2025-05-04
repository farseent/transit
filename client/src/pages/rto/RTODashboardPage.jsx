// src/pages/rto/RTODashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { BarChart, RefreshCw, AlertCircle } from 'lucide-react';
// import RTOLayout from '../../components/rto/RTOLayout';
import ComplaintStats from '../../components/rto/ComplaintStats';
import RecentComplaints from '../../components/rto/RecentComplaints';
import { getComplaintStats, getRecentComplaints } from '../../api/rtoApi';

const RTODashboardPage = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inprogress: 0,
    resolved: 0,
    rejected: 0
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      setRefreshing(true);
      
      const [statsData, complaintsData] = await Promise.all([
        getComplaintStats(),
        getRecentComplaints()
      ]);
      
      setStats(statsData);
      setRecentComplaints(complaintsData);
    } catch (error) {
      console.error('Error fetching RTO dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    // <RTOLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <BarChart className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold">RTO Dashboard</h1>
          </div>
          
          <button 
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        <ComplaintStats stats={stats} loading={loading} />
        
        <RecentComplaints 
          complaints={recentComplaints} 
          loading={loading} 
        />
      </div>
    // </RTOLayout>
  );
};

export default RTODashboardPage;