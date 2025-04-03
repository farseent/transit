const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route imports
const userRoutes = require('./routes/userRoutes');
const busRoutes = require('./routes/busRoutes');
const routeRoutes = require('./routes/routeRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const searchRoutes = require('./routes/searchRoutes');
const complaintRoutes = require('./routes/complaintRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // or your frontend URL
  credentials: true
}));

// Logging middleware in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Add at the top of your routes section in server.js
// app.get('/api/routes', (req, res) => {
//   // Get a list of all registered routes
//   const routes = [];
  
//   app._router.stack.forEach((middleware) => {
//     if (middleware.route) {
//       // Routes registered directly on the app
//       routes.push({
//         path: middleware.route.path,
//         method: Object.keys(middleware.route.methods)[0].toUpperCase()
//       });
//     } else if (middleware.name === 'router') {
//       // Router middleware
//       middleware.handle.stack.forEach((handler) => {
//         if (handler.route) {
//           const path = handler.route.path;
//           const method = Object.keys(handler.route.methods)[0].toUpperCase();
//           routes.push({
//             path: middleware.regexp.toString().includes('/api/search') 
//               ? `/api/search${path}` 
//               : path,
//             method: method
//           });
//         }
//       });
//     }
//   });
  
//   res.json(routes);
// });





// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/complaints', complaintRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Transit Hub API is running');
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// In server.js or wherever you define routes
// app.get('/api/test', (req, res) => {
//   res.json({ message: 'API is working' });
// });