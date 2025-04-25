// utils/permissions.js

export const getUserRoleName = (role) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'moderator':
        return 'Moderator';
      case 'user':
        return 'User';
      default:
        return 'Unknown';
    }
  };
  