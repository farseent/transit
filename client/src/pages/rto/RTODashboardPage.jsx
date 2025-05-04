// src/pages/rto/RTODashboardPage.jsx
import React, { useEffect, useState } from 'react';
import RTOLayout from '../../components/rto/RTOLayout';
import ComplaintStats from '../../components/rto/ComplaintStats';
import RecentComplaints from '../../components/rto/RecentComplaints';
import { getComplaintStats, getRecentComplaints } from '../../api/rtoApi';

const RTODashboardPage = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inprogress: 0,
    resolved: 0
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, complaintsData] = await Promise.all([
          getComplaintStats(),
          getRecentComplaints()
        ]);
        
        setStats(statsData);
        setRecentComplaints(complaintsData);
      } catch (error) {
        console.error('Error fetching RTO dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <RTOLayout>
      <div>
        <h1 className="text-2xl font-bold mb-6">RTO Dashboard</h1>
        
        <ComplaintStats stats={stats} />
        
        <RecentComplaints 
          complaints={recentComplaints} 
          loading={loading} 
        />
      </div>
    </RTOLayout>
  );
};

export default RTODashboardPage;
