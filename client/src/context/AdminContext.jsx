import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import adminApi from '../api/adminApi';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activityLog, setActivityLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSystemStats = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getSystemStats();
      // console.log('data received in admin context:', response.data);
      setStats(response.data.stats);
      setActivityLog(response.data.recentActivity);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchSystemStats();
    }
  }, [user]);

  return (
    <AdminContext.Provider
      value={{
        stats,
        activityLog,
        loading,
        error,
        fetchSystemStats
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};