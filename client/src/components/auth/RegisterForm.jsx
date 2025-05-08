import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Input from '../common/Input';
import Alert from '../common/Alert';
import { useAuth } from '../../context/AuthContext';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      if (response.token) {
        navigate( -1 , { 
          state: { 
            message: 'Registration successful! Please log in.',
            email: formData.email 
          }
        });
      }
    } catch (err) {
      setError(err.message);
      console.error('Registration error details:', {
        message: err.message,
        response: err.response
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-card max-w-md w-full">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>
      
      {error && <Alert type="error" message={error} className="mb-4" />}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </div>
        
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
        
        <div className="mb-4">
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Must be at least 6 characters long
          </p>
        </div>
        
        <div className="mb-6">
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
        </div>
        
        <Button
          type="submit"
          fullWidth
          disabled={loading}
          className="mb-4"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
        
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">
              Log In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;


// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import Button from '../common/Button';
// import Input from '../common/Input';
// import Alert from '../common/Alert';
// import { useAuth } from '../../context/AuthContext';

// const RegisterForm = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { register } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Helper function to validate password strength
//   const validatePasswordStrength = (password) => {
//     const hasMinLength = password.length >= 8;
//     const hasUpperCase = /[A-Z]/.test(password);
//     const hasLowerCase = /[a-z]/.test(password);
//     const hasNumber = /[0-9]/.test(password);
//     const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

//     return {
//       isValid: hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
//       errors: {
//         length: !hasMinLength,
//         upperCase: !hasUpperCase,
//         lowerCase: !hasLowerCase,
//         number: !hasNumber,
//         specialChar: !hasSpecialChar,
//       },
//     };
//   };

//   const validateForm = () => {
//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       return false;
//     }

//     const { isValid, errors } = validatePasswordStrength(formData.password);

//     if (!isValid) {
//       const errorMessages = [];
//       if (errors.length) errorMessages.push('at least 8 characters');
//       if (errors.upperCase) errorMessages.push('one uppercase letter (A-Z)');
//       if (errors.lowerCase) errorMessages.push('one lowercase letter (a-z)');
//       if (errors.number) errorMessages.push('one number (0-9)');
//       if (errors.specialChar) errorMessages.push('one special character (!@#$%^&*)');

//       setError(`Password must contain: ${errorMessages.join(', ')}`);
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
    
//     if (!validateForm()) return;
    
//     setLoading(true);
//     try {
//       const response = await register({
//         name: formData.name,
//         email: formData.email,
//         password: formData.password
//       });
      
//       if (response.token) {
//         navigate(-1, { 
//           state: { 
//             message: 'Registration successful! Please log in.',
//             email: formData.email 
//           }
//         });
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error('Registration error details:', {
//         message: err.message,
//         response: err.response
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white p-8 rounded-lg shadow-card max-w-md w-full">
//       <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>
      
//       {error && <Alert type="error" message={error} className="mb-4" />}
      
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <Input
//             label="Full Name"
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             placeholder="John Doe"
//             required
//           />
//         </div>
        
//         <div className="mb-4">
//           <Input
//             label="Email Address"
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder="you@example.com"
//             required
//           />
//         </div>
        
//         <div className="mb-4">
//           <Input
//             label="Password"
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             placeholder="••••••••"
//             required
//           />
//           <p className="text-xs text-gray-500 mt-1">
//             Must be at least 8 characters with uppercase, lowercase, number, and special character (!@#$%^&*)
//           </p>
//         </div>
        
//         <div className="mb-6">
//           <Input
//             label="Confirm Password"
//             type="password"
//             name="confirmPassword"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             placeholder="••••••••"
//             required
//           />
//         </div>
        
//         <Button
//           type="submit"
//           fullWidth
//           disabled={loading}
//           className="mb-4"
//         >
//           {loading ? 'Creating Account...' : 'Create Account'}
//         </Button>
        
//         <div className="text-center mt-4">
//           <p className="text-gray-600">
//             Already have an account?{' '}
//             <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">
//               Log In
//             </Link>
//           </p>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default RegisterForm;