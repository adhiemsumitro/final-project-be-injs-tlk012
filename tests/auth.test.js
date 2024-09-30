const request = require('supertest');
const { app, clearDatabase, createTestUserInDB } = require('./testSetup');
const { User } = require('../models');

describe('Authentication Endpoints', () => {
  beforeEach(async () => {
    await clearDatabase(false); // Clear everything, including users
  });

  const registerUserViaAPI = async (userData) => {
    return await request(app)
      .post('/register')
      .send(userData);
  };

  const loginUserViaAPI = async (credentials) => {
    return await request(app)
      .post('/login')
      .send(credentials);
  };

  it('should register a new user', async () => {
    const userData = {
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'user',
      phoneNumber: '1234567890',
      address: 'Test Address'
    };

    const response = await registerUserViaAPI(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'User registered successfully');
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('username', userData.username);
    expect(response.body.user).toHaveProperty('email', userData.email);
    expect(response.body.user).toHaveProperty('role', userData.role);
    expect(response.body).not.toHaveProperty('password');
  });

  it('should not register a user with an existing username', async () => {
    const userData = {
      name: 'Test User',
      username: 'existinguser',
      email: 'existing@example.com',
      password: 'password123',
      role: 'user',
      phoneNumber: '1234567890',
      address: 'Test Address'
    };

    await registerUserViaAPI(userData);
    const response = await registerUserViaAPI(userData);

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty('message', 'User with this username or email already exists');
  });

  it('should log in a user and return a token', async () => {
    const { user, password } = await createTestUserInDB();
    
    // Verify the user was created
    const createdUser = await User.findByPk(user.id);
    expect(createdUser).not.toBeNull();

    const response = await loginUserViaAPI({
      username: user.username,
      password: password
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('name', user.username);
    expect(response.body).toHaveProperty('role', user.role);
    expect(response.body).toHaveProperty('id', user.id);
  });

  it('should not log in with an invalid password', async () => {
    const { user } = await createTestUserInDB();
    const response = await loginUserViaAPI({
      username: user.username,
      password: 'wrongpassword'
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid credentials');
  });

  it('should not log in with a non-existent username', async () => {
    const response = await loginUserViaAPI({
      username: 'nonexistentuser',
      password: 'password123'
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid credentials');
  });
});