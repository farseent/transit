import { ChartBarIcon, UsersIcon, CogIcon, DocumentTextIcon, ShoppingCartIcon, BellIcon } from '@heroicons/react/24/outline';

const OwnerDashboardPage = () => {
  
  // Mock data - replace with actual API calls
  const stats = [
    { name: 'Total Revenue', value: '$12,345', change: '+12%', changeType: 'positive' },
    { name: 'Active Users', value: '1,234', change: '+5%', changeType: 'positive' },
    { name: 'Pending Orders', value: '56', change: '-3%', changeType: 'negative' },
    { name: 'New Messages', value: '24', change: '+8%', changeType: 'positive' },
  ];

  const recentActivity = [
    { id: 1, user: 'John Doe', action: 'placed a new order', time: '2 min ago', read: false },
    { id: 2, user: 'Sarah Smith', action: 'updated payment method', time: '10 min ago', read: true },
    { id: 3, user: 'Mike Johnson', action: 'requested a refund', time: '25 min ago', read: false },
    { id: 4, user: 'Emily Wilson', action: 'submitted a review', time: '1 hour ago', read: true },
  ];

  const quickActions = [
    { icon: UsersIcon, name: 'Manage Users', href: '#', count: 5 },
    { icon: ShoppingCartIcon, name: 'Process Orders', href: '#', count: 12 },
    { icon: DocumentTextIcon, name: 'View Reports', href: '#' },
    { icon: CogIcon, name: 'Settings', href: '#' },
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-secondary-900">Owner Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full text-secondary-400 hover:text-secondary-500 relative">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-danger-500"></span>
            </button>
            <div className="flex items-center">
              <img 
                className="h-8 w-8 rounded-full bg-primary-100" 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="User profile" 
              />
              <span className="ml-2 text-sm font-medium text-secondary-700">Owner</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary-500 rounded-md p-3">
                    <ChartBarIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-secondary-500 truncate">{stat.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-secondary-900">{stat.value}</div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'positive' ? 'text-success' : 'text-danger'
                      }`}>
                        {stat.change}
                      </div>
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-secondary-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <div key={action.name} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition duration-150">
                <div className="px-4 py-5 sm:p-6 cursor-pointer">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                      <action.icon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dt className="text-sm font-medium text-secondary-500 truncate">{action.name}</dt>
                      {action.count && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger-100 text-danger-800">
                          {action.count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-secondary-200">
            <h3 className="text-lg leading-6 font-medium text-secondary-900">Recent Activity</h3>
          </div>
          <ul className="divide-y divide-secondary-200">
            {recentActivity.map((activity) => (
              <li key={activity.id} className={`px-4 py-4 sm:px-6 ${!activity.read ? 'bg-primary-50' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {!activity.read && (
                      <span className="h-2 w-2 rounded-full bg-primary-500 mr-2"></span>
                    )}
                    <p className="text-sm font-medium text-primary-600 truncate">
                      {activity.user} <span className="text-secondary-500 font-normal">{activity.action}</span>
                    </p>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="text-xs text-secondary-500">{activity.time}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="bg-secondary-50 px-4 py-4 sm:px-6 text-center">
            <button className="text-sm font-medium text-primary-600 hover:text-primary-500">
              View all activity
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OwnerDashboardPage;