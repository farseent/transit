// userController.js
const User = require('../models/User');
// const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/jwtUtils');
const bcrypt = require('bcryptjs');
const Review = require('../models/Review');
const Complaint = require('../models/Complaint');

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('User exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({
      name,
      email,
      password, // Let Mongoose pre-save hook handle hashing
      role: role || 'user'
    });

    console.log('User created:', user.email);
    
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Registration error stack:', error.stack); // Full error stack
    return res.status(500).json({ 
      message: 'Registration failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// User login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    const user = await User.findOne({ email }).select('+password'); 
    if (user) {
      console.log('Comparing password...'); // Log password comparison
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', isMatch); // Log comparison result
      
      if (isMatch) {
        console.log('Generating token...'); // Log token generation
        const token = generateToken(user._id);
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: token
        });
        
      }
    }
    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    console.error('Login error:', error); // Detailed error logging
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      stack: error.stack // Include stack trace for debugging
    });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      role: user.role || 'user',
      // Include other non-sensitive fields you want to return
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user profile
// exports.updateUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
    
//     if (user) {
//       user.name = req.body.name || user.name;
//       user.email = req.body.email || user.email;
      
//       if (req.body.password) {
//         const salt = await bcrypt.genSalt(10);
//         user.password = await bcrypt.hash(req.body.password, salt);
//       }
      
//       const updatedUser = await user.save();
      
//       res.json({
//         _id: updatedUser._id,
//         name: updatedUser.name,
//         email: updatedUser.email,
//         role: updatedUser.role,
//         token: generateToken(updatedUser._id)
//       });
//     } else {
//       res.status(404).json({ message: 'User not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// Get user history (reviews and complaints)
// exports.getUserHistory = async (req, res) => {
//   try {
//     const reviews = await Review.find({ user: req.user._id }).populate('bus');
//     const complaints = await Complaint.find({ user: req.user._id }).populate('bus');
    
//     res.json({
//       reviews,
//       complaints
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id }).populate('bus', 'name regNumber'); ;
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id }).populate('bus', 'name regNumber'); ;
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching user complaints:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};