// src/components/rto/RTOLayout.jsx
import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const NavItem = ({ href, icon, children, isActive }) => {
  
  return (
    <li className="mb-1">
      <Link
        to={href}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
          isActive
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        {icon}
        <span>{children}</span>
      </Link>
    </li>
  );
};

const RTOLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout  = () => {
    if(window.confirm('Are you sure you want to logout?')){
      logout();
      navigate('/login');
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navItems = [
    {
      href: '/rto/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      href: '/rto/complaints',
      label: 'Manage Complaints',
      icon: <FileText className="h-5 w-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 mr-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <h1 className="text-xl font-bold text-gray-900">RTO Portal</h1>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar for desktop */}
        <aside className="hidden lg:block w-64 bg-white shadow-md min-h-screen fixed">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">RTO Portal</h2>
            <p className="text-sm text-gray-600 mt-1">Regional Transport Office</p>
          </div>
          
          <nav className="p-4">
            <ul>
              {navItems.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  isActive={location.pathname === item.href}
                >
                  {item.label}
                </NavItem>
              ))}
              
              <li className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  handleLogout()
                }}
                className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-20 lg:hidden">
            <div 
              className="absolute inset-0 bg-gray-800 bg-opacity-50"
              onClick={toggleSidebar}
            ></div>
            <aside className="absolute top-0 left-0 w-64 h-full bg-white shadow-lg z-30 transform transition-transform">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">RTO Portal</h2>
                <p className="text-sm text-gray-600 mt-1">Regional Transport Office</p>
              </div>
              
              <nav className="p-4">
                <ul>
                  {navItems.map((item) => (
                    <NavItem
                      key={item.href}
                      href={item.href}
                      icon={item.icon}
                      isActive={location.pathname === item.href}
                      onClick={toggleSidebar}
                    >
                      {item.label}
                    </NavItem>
                  ))}
                  
                  <li className="mt-6 pt-6 border-t border-gray-200">
                    <a
                      href="/logout"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-4 sm:p-6">
          <div className="container mx-auto">
            <Outlet/>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RTOLayout;