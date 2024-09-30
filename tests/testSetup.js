const request = require('supertest');
const http = require('http');
const app = require('../server');
const { sequelize, User, Movie, Bookmark } = require('../models');
const bcrypt = require('bcrypt');
const { registerUser, loginUser } = require('../controllers/authController');

let server;

async function clearDatabase(skipUsers = false) {
  console.log('Clearing database...');
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    // Disable foreign key checks
    await sequelize.query('SET CONSTRAINTS ALL DEFERRED');
    
    // Delete records in reverse order of dependencies
    await Bookmark.destroy({ where: {}, force: true });
    await Movie.destroy({ where: {}, force: true });
    if (!skipUsers) {
      await User.destroy({ where: {}, force: true });
      await sequelize.query("ALTER SEQUENCE \"Users_id_seq\" RESTART WITH 1");
    }

    // Reset sequences
    await sequelize.query("ALTER SEQUENCE \"Movies_id_seq\" RESTART WITH 1");
    await sequelize.query("ALTER SEQUENCE \"Bookmarks_id_seq\" RESTART WITH 1");

    // Re-enable foreign key checks
    await sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');

    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Unable to clear database:', error);
    console.error('Error details:', error.message);
    if (error.parent) {
      console.error('Parent error:', error.parent.message);
    }
    throw error;
  }
}

function generateUniqueUsername() {
  return `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

async function createTestUserInDB() {
  try {
    const username = generateUniqueUsername();
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      console.log('User already exists, generating new username');
      return createTestUserInDB(); // Recursively try again
    }

    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      name: 'Test User',
      username: username,
      email: `${username}@example.com`,
      password: hashedPassword,
      role: 'admin',
      phoneNumber: '081319023264',
      address: 'Test Address',
    });

    console.log('Created test user:', user.toJSON());
    return { user, password };

  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
}

async function authenticateUserViaAPI() {
  const { user, password } = await createTestUserInDB();
  const response = await request(app)
    .post('/login')
    .send({
      username: user.username,
      password: password,
    });
  return { token: response.body.accessToken, userId: user.id };
}

beforeAll(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    await clearDatabase(false);  // Clear everything including users

    server = http.createServer(app);
    await new Promise((resolve) => {
      server.listen(0, () => {
        console.log(`Test server is running on port ${server.address().port}`);
        resolve();
      });
    });
  } catch (error) {
    console.error('Unable to set up test environment:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    await sequelize.close();
    console.log('Database connection closed.');
    if (server) {
      await new Promise((resolve) => {
        server.close(() => {
          console.log('Test server closed.');
          resolve();
        });
      });
    }
  } catch (error) {
    console.error('Error during cleanup:', error);
    throw error;
  }
});

module.exports = {
  getServerPort: () => server.address().port,
  clearDatabase,
  createTestUserInDB,
  authenticateUserViaAPI,
  generateUniqueUsername,
  app
};