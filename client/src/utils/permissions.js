// utils/permissions.js

export const getUserRoleName = (role) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'owner':
        return 'Owner';
      case 'user':
        return 'User';
      case 'rto':
        return 'RTO';
      default:
        return 'Unknown';
    }
  };
  