const express = require('express');
const router = express.Router();
const { addBookmark, getBookmarks, deleteBookmark } = require('../controllers/bookmarkController'); // Import controller functions
const authenticateToken = require('../middleware/authenticateToken'); // Import the authentication middleware

// Log when the bookmark route is set up
console.log('Setting up bookmark routes...');

// Apply auth middleware to all routes
router.use(authenticateToken);

// Route to add a bookmark with a movie ID in the URL
router.post('/:movieId', addBookmark);

// Route to get all bookmarks
router.get('/', getBookmarks);

// Route to delete a bookmark by ID
router.delete('/:movieId', deleteBookmark);

module.exports = router;
