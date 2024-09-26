const express = require('express');
const router = express.Router();
const { createMovie, getMovies, updateMovie, deleteMovie } = require('../controllers/moviesController'); // Import all controller functions
const authenticateToken = require('../middleware/authenticateToken'); // Ensure middleware is correctly imported

// Log when the movies route is set up
console.log('Setting up movies routes...');

// Apply auth middleware to all routes
router.use(authenticateToken);

// Route to get all movies
router.get('/', (req, res, next) => {
  getMovies(req, res, next);
});

// Route to create a new movie
router.post('/', (req, res, next) => {
  createMovie(req, res, next);
});

// Route to update a movie by ID
router.put('/:id', (req, res, next) => {
  updateMovie(req, res, next);
});

// Route to delete a movie by ID
router.delete('/:id', (req, res, next) => {
  deleteMovie(req, res, next);
});

module.exports = router;
