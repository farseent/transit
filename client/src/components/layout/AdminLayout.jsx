import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Bus, 
  Map, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Bell
} from 'lucide-react';

/**
 * AdminLayout Component - Main layout for admin panel
 * Provides responsive sidebar, header, and content area
 */
const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for responsive UI
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState(2); // Example notification count

  // Check if user is admin, redirect if not
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  // Handle responsive sidebar
  useEffect(() => {
    // Close mobile menu when location changes
    setMobileMenuOpen(false);

    // Responsive sidebar behavior
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [location.pathname]);

  // Navigation item component with active state
  const NavItem = ({ to, icon, text }) => {
    const isActive = location.pathname === to;
    
    return (
      <li>
        <Link 
          to={to} 
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            isActive 
              ? 'bg-blue-700 text-white font-medium' 
              : 'text-blue-100 hover:bg-blue-700/50'
          }`}
        >
          {icon}
          {(sidebarOpen || mobileMenuOpen) && <span className="ml-3">{text}</span>}
        </Link>
      </li>
    );
  };

  // Handle logout with confirmation
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  // Get current page title from path
  const getPageTitle = () => {
    const path = location.pathname.split('/').pop();
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside 
        className={`${
          sidebarOpen ? 'lg:w-64' : 'lg:w-20'
        } bg-blue-800 text-white transition-all duration-300 hidden lg:block`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            {sidebarOpen ? (
              <h1 className="text-xl font-bold">Transit Hub Admin</h1>
            ) : (
              <h1 className="text-xl font-bold">TH</h1>
            )}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-full hover:bg-blue-700 text-blue-100"
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
          
          <nav>
            <ul className="space-y-1">
              <NavItem 
                to="/admin/dashboard" 
                icon={<LayoutDashboard size={20} />} 
                text="Dashboard" 
              />
              <NavItem 
                to="/admin/users" 
                icon={<Users size={20} />} 
                text="User Management" 
              />
              <NavItem 
                to="/admin/buses" 
                icon={<Bus size={20} />} 
                text="Bus Management" 
              />
              <NavItem 
                to="/admin/routes" 
                icon={<Map size={20} />} 
                text="Route Management" 
              />
              <NavItem 
                to="/admin/settings" 
                icon={<Settings size={20} />} 
                text="System Settings" 
              />
              <li className="mt-8">
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-700/50 transition-colors"
                >
                  <LogOut size={20} />
                  {sidebarOpen && <span className="ml-3">Logout</span>}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile sidebar (overlay) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75" 
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          ></div>
          <div className="fixed inset-y-0 left-0 flex flex-col w-64 max-w-xs bg-blue-800 z-50">
            <div className="flex items-center justify-between p-4 border-b border-blue-700">
              <h1 className="text-xl font-bold text-white">Transit Hub Admin</h1>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-md text-blue-100 hover:bg-blue-700"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 px-2 py-4 overflow-y-auto">
              <ul className="space-y-1">
                <NavItem 
                  to="/admin/dashboard" 
                  icon={<LayoutDashboard size={20} />} 
                  text="Dashboard" 
                />
                <NavItem 
                  to="/admin/users" 
                  icon={<Users size={20} />} 
                  text="User Management" 
                />
                <NavItem 
                  to="/admin/buses" 
                  icon={<Bus size={20} />} 
                  text="Bus Management" 
                />
                <NavItem 
                  to="/admin/routes" 
                  icon={<Map size={20} />} 
                  text="Route Management" 
                />
                <NavItem 
                  to="/admin/settings" 
                  icon={<Settings size={20} />} 
                  text="System Settings" 
                />
                <li className="mt-8">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-700/50 transition-colors"
                  >
                    <LogOut size={20} />
                    <span className="ml-3">Logout</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 lg:hidden"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
              <h2 className="ml-2 text-xl font-semibold text-gray-800">
                {getPageTitle()}
              </h2>
            </div>
            <div className="flex items-center">
              <div className="relative">
                <button 
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                  aria-label={`${notifications} notifications`}
                >
                  <Bell size={20} />
                  {notifications > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
              </div>
              <div className="relative ml-3">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-full hover:bg-gray-100"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden md:block">
                    {user?.name || 'Admin User'}
                  </span>
                  <ChevronDown size={16} className="text-gray-500 hidden md:block" />
                </button>
                
                {dropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <Link 
                      to="/admin/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                      role="menuitem"
                    >
                      Your Profile
                    </Link>
                    <Link 
                      to="/admin/settings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                      role="menuitem"
                    >
                      Settings
                    </Link>
                    <div className="border-t border-gray-100"></div>
                    <button 
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 p-4">
          <div className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Transit Hub Admin Dashboard. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;