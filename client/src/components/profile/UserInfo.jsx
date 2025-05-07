// src/components/profile/UserInfo.jsx
import React from 'react';

const UserInfo = ({ user }) => {
  if (!user) {
    return <div>No user data available</div>;
  }

  const userFields = [
    { label: 'Full Name', value: user.name },
    { label: 'Email Address', value: user.email },
    { label: 'Member Since', value: new Date(user.createdAt).toLocaleDateString() },
    { label: 'Account Type', value: user.role || 'User', show: true },
    // { label: 'Phone Number', value: user.phone || 'Not provided' },
    // { label: 'Address', value: user.address || 'Not provided' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userFields.map((field, index) => (
          (field.show || field.show === undefined) && (
            <div key={index} className="space-y-1">
              <label className="block text-sm font-medium text-gray-500">{field.label}</label>
              <p className="font-medium text-gray-800">{field.value}</p>
            </div>
          )
        ))}
      </div>
      
      <div className="border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive email about your activity</p>
            </div>
            <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
              <input type="checkbox" id="toggle-notifications" className="peer sr-only" defaultChecked />
              <label 
                htmlFor="toggle-notifications" 
                className="absolute inset-0 rounded-full bg-gray-300 cursor-pointer transition-colors peer-checked:bg-primary-500"
              ></label>
              <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform peer-checked:translate-x-6"></span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Review Privacy</p>
              <p className="text-sm text-gray-500">Show your name with reviews</p>
            </div>
            <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
              <input type="checkbox" id="toggle-privacy" className="peer sr-only" defaultChecked />
              <label 
                htmlFor="toggle-privacy" 
                className="absolute inset-0 rounded-full bg-gray-300 cursor-pointer transition-colors peer-checked:bg-primary-500"
              ></label>
              <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform peer-checked:translate-x-6"></span>
            </div>
          </div>
        </div>
      </div>
      
      {/* <div className="border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Account Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors">
            Edit Profile
          </button>
          <button className="bg-white border border-primary-500 text-primary-500 px-4 py-2 rounded-md hover:bg-primary-50 transition-colors">
            Change Password
          </button>
          <button className="bg-white border border-red-500 text-red-500 px-4 py-2 rounded-md hover:bg-red-50 transition-colors">
            Delete Account
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default UserInfo;