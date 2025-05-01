// StatsSummary.jsx
import { Users, Bus, Map, Star } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    orange: 'bg-orange-100 text-orange-800',
    purple: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const StatsSummary = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Total Users" 
        value={stats.users} 
        icon={<Users size={20} />}
        color="blue"
      />
      <StatCard 
        title="Total Buses" 
        value={stats.buses} 
        icon={<Bus size={20} />} 
        color="green"
      />
      <StatCard 
        title="Total Routes" 
        value={stats.routes} 
        icon={<Map size={20} />} 
        color="orange"
      />
      <StatCard 
        title="Total Complaints" 
        value={stats.complaint} 
        icon={<Star size={20} />} 
        color="purple"
      />
    </div>
  );
};

export default StatsSummary;
