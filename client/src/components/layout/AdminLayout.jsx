import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white p-4">
        <div className="flex items-center space-x-2 mb-8">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
        
        <nav>
          <ul className="space-y-2">
            <li>
              <Link 
                to="/admin/dashboard" 
                className="block px-4 py-2 rounded hover:bg-blue-700"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/users" 
                className="block px-4 py-2 rounded hover:bg-blue-700"
              >
                User Management
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/buses" 
                className="block px-4 py-2 rounded hover:bg-blue-700"
              >
                Bus Management
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/routes" 
                className="block px-4 py-2 rounded hover:bg-blue-700"
              >
                Route Management
              </Link>
            </li>
            <li>
            <Link 
                to="/admin/settings" 
                className="block px-4 py-2 rounded hover:bg-blue-700"
            >
                System Settings
            </Link>
            </li>
            <li>
              <button 
                onClick={logout}
                className="w-full text-left px-4 py-2 rounded hover:bg-blue-700"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;