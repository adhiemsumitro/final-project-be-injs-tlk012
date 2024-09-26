const app = require('./index'); // Import the Express app from index.js

const port = process.env.PORT || 3000; // Define the port

if (process.env.NODE_ENV !== 'test') { // Prevent server from starting during tests
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
console.log('JWT_SECRET is set:', !!process.env.JWT_SECRET);

module.exports = app; // Export the app for testing
