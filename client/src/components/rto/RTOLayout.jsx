// src/components/rto/RTOLayout.jsx
import React from 'react';

const RTOLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-64 mb-6 md:mb-0">
            <div className="bg-white shadow rounded p-4">
              <h2 className="text-xl font-bold mb-4">RTO Dashboard</h2>
              <nav>
                <ul>
                  <li className="mb-2">
                    <a href="/rto/dashboard" className="block p-2 hover:bg-gray-100 rounded">
                      Dashboard
                    </a>
                  </li>
                  <li className="mb-2">
                    <a href="/rto/complaints" className="block p-2 hover:bg-gray-100 rounded">
                      Manage Complaints
                    </a>
                  </li>
                  <li className="mb-2">
                    <a href="/rto/profile" className="block p-2 hover:bg-gray-100 rounded">
                      Profile
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          <div className="md:flex-1 md:pl-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RTOLayout;