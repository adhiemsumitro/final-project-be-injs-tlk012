require('dotenv').config(); // Load environment variables from .env file

const { Sequelize } = require('sequelize');

// Initialize Sequelize with your database configuration
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres', // Replace with your DB dialect
  port: process.env.DB_PORT,
  logging: false, // Disable logging; set to console.log to debug
});

module.exports = sequelize;
