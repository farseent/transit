// src/components/rto/ComplaintStats.jsx
import React from 'react';
import { AlertCircle, Clock, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

const StatsCard = ({ title, value, icon, color, loading }) => {
  return (
    <div className={`bg-white p-5 rounded-lg shadow-md border-l-4 ${color} hover:shadow-lg transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-sm font-medium mb-1 ${loading ? 'animate-pulse bg-gray-200 h-4 w-24 rounded' : ''}`}>
            {!loading && title}
          </h3>
          <p className={`text-3xl font-bold ${loading ? 'animate-pulse bg-gray-300 h-8 w-16 rounded' : ''}`}>
            {!loading && value}
          </p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('-500', '-100')}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const ComplaintStats = ({ stats, loading = false }) => {
  const statsConfig = [
    {
      title: 'Total Complaints',
      value: stats.total || 0,
      icon: <HelpCircle className="h-6 w-6 text-gray-600" />,
      color: 'border-gray-500'
    },
    {
      title: 'Pending',
      value: stats.pending || 0,
      icon: <Clock className="h-6 w-6 text-yellow-600" />,
      color: 'border-yellow-500'
    },
    {
      title: 'In Progress',
      value: stats.inprogress || 0,
      icon: <AlertCircle className="h-6 w-6 text-blue-600" />,
      color: 'border-blue-500'
    },
    {
      title: 'Resolved',
      value: stats.resolved || 0,
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      color: 'border-green-500'
    },
    {
      title: 'Rejected',
      value: stats.rejected || 0,
      icon: <XCircle className="h-6 w-6 text-red-600" />,
      color: 'border-red-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {statsConfig.map((stat, index) => (
        <StatsCard 
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          loading={loading}
        />
      ))}
    </div>
  );
};

export default ComplaintStats;