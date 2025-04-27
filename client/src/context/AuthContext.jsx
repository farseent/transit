//AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getProfile } from '../api/userApi';
import { saveToken, getToken, removeToken } from '../utils/localStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authState, setAuthState] = useState({
    token: getToken(),
    isAuthenticated: false
  });

  // Initialize auth on component mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getToken();
      if (storedToken) {
        try {
          const userData = await getProfile();
          setUser(userData);
          setAuthState({
            token: storedToken,
            isAuthenticated: true
          });
        } catch (err) {
          console.error('Failed to get user profile:', err);
          // Token might be invalid, clear it
          removeToken();
          setAuthState({
            token: null,
            isAuthenticated: false
          });
        }
      }
      setLoading(false);
    };
    
    initAuth();
  }, []);
  
  const login = async (userData) => {
    setLoading(true);
    try {
      const response = await apiLogin(userData);
      //-------------
      console.log('Full login response:', response); // Add this
      //-------------
      saveToken(response.token);
      const user = {
        _id: response._id,
        name: response.name,
        email: response.email,
        role: response.role
      };
      setUser(user);
      setAuthState({
        token: response.token,
        isAuthenticated: true
      });
      return user;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (userData) => {
    try {
      const response = await apiRegister(userData);
      if (response.token) {
        saveToken(response.token);
        // Create user object from response
        const user = {
          _id: response._id,
          name: response.name || userData.name,
          email: response.email || userData.email,
          role: response.role || 'user' // Default to 'user' if not provided
        };
        setUser(user);
        setAuthState({
          token: response.token,
          isAuthenticated: true
        });
      }
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };
  
  const logout = () => {
    try {
      // Call API logout if needed (made async optional)
      // await apiLogout();
      console.log('logging out user');
    } catch (err) {
      console.error('Logout API error:', err);
    } finally {
      removeToken();
      setUser(null);
      setAuthState({
        token: null,
        isAuthenticated: false
      });
    }
  };
  
  const isOwner = user?.role === 'owner';
  
  const value = {
    user,
    role: user?.role,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: authState.isAuthenticated,
    isOwner,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;