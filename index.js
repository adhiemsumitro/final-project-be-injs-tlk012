require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database'); // Import your database configuration

const app = express(); // Create the Express app

// Middleware
app.use(express.json());

// Import your routes
const authRoutes = require('./routes/auth');
const bookmarkRoutes = require('./routes/bookmark');
const moviesRoutes = require('./routes/movies');

// Use routes with logging
console.log('Registering routes...');
app.use('/', authRoutes); // Register auth routes at the root level (for /register and /login)
app.use('/bookmark', bookmarkRoutes); // Register bookmark routes for /bookmark/:movieId
app.use('/mybookmark', bookmarkRoutes); // Register bookmark routes for /mybookmark
app.use('/movies', moviesRoutes); // Register movies routes for /movies



// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error middleware triggered:', err);
  res.status(500).json({ message: err.message });
});

// Synchronize database only in development mode
if (process.env.NODE_ENV === 'development') {
  sequelize.authenticate()
    .then(() => {
      console.log('Database connection has been established successfully.');
      return sequelize.sync({ alter: true });
    })
    .then(() => {
      console.log('Database synchronized with altered schema in development environment.');
    })
    .catch((err) => {
      console.error('Unable to connect to the database or synchronize:', err);
    });



}

// Export the app for use in server.js and testing
module.exports = app;
