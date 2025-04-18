//loginform
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Input from '../common/Input';
import Alert from '../common/Alert';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      const response = await login({  
        email: formData.email,  
        password: formData.password  
      });
      
      console.log('Login response in form:', response); // Debugging log
      
      if (response?.role === 'owner') {
        navigate('/owner/dashboard');
      } else {
        navigate(-1);
      }
    } catch (err) {
      console.error('Login error:', err); // Debugging log
      setError(err.response?.data?.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-card max-w-md w-full">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to Transit Hub</h2>
      
      {error && <Alert type="error" message={error} className="mb-4" />}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </div>
        
        <div className="mb-6">
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
          <div className="mt-1 text-right">
            <Link to="/forgot-password" className="text-sm text-primary-500 hover:text-primary-600">
              Forgot your password?
            </Link>
          </div>
        </div>
        
        <Button
          type="submit"
          fullWidth
          disabled={loading}
          className="mb-4"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </Button>
        
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-500 hover:text-primary-600 font-medium">
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;