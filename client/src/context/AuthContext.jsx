import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getProfile } from '../api/userApi';
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
    try {
      const response = await apiLogin(userData);
      saveToken(response.token);
      setUser(response.user);
      setAuthState({
        token: response.token,
        isAuthenticated: true
      });
      return response.user;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };
  
  const register = async (userData) => {
    try {
      const response = await apiRegister(userData);
      if (response.token) {
        saveToken(response.token);
        setUser(response.user || { 
          name: userData.name, 
          email: userData.email,
          role: 'user' 
        });
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