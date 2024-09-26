const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController'); // Import controller functions

router.post('/register', registerUser); // Use controller for register
router.post('/login', loginUser); // Use controller for login

module.exports = router;
