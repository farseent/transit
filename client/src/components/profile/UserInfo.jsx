import React from 'react';

const UserInfo = ({ user }) => {
  if (!user) {
    return <div>No user data available</div>;
  }
  return (
    <div className="bg-white rounded-lg shadow-card p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center">
          <span className="text-gray-600 font-medium w-32">Name:</span>
          <span className="font-medium">{user.name}</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center">
          <span className="text-gray-600 font-medium w-32">Email:</span>
          <span>{user.email}</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center">
          <span className="text-gray-600 font-medium w-32">Joined:</span>
          <span>{new Date(user.createdAt).toLocaleDateString()}</span>
        </div>
        {user?.role === 'owner'&&(<div className="flex flex-col md:flex-row md:items-center">
          <span className="text-gray-600 font-medium w-32">Account Type:</span>
          <span className="capitalize">{user.role}</span>
        </div>)}
      </div>
      <div className="mt-6">
        <button className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default UserInfo;