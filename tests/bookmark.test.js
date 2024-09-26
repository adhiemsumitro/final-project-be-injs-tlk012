const { app, clearDatabase, createTestUserInDB } = require('./testSetup');
const request = require('supertest');
const { Movie, Bookmark } = require('../models');

describe('Bookmark Endpoints', () => {
  let token;
  let userId;
  let testMovie;

  beforeAll(async () => {
    // Clear everything including users before all tests
    await clearDatabase(false);
  });

  beforeEach(async () => {
    // Clear everything except users before each test
    await clearDatabase(true);
    
    // Create a test user
    const { user, password } = await createTestUserInDB();
    userId = user.id;
    
    // Log in to get the token
    const loginResponse = await request(app)
      .post('/login')
      .send({
        username: user.username,
        password: password
      });
    
    token = loginResponse.body.accessToken;
    
    // Create a test movie
    testMovie = await Movie.create({
      title: 'Test Movie',
      synopsis: 'A test movie synopsis',
      trailerUrl: 'https://example.com/trailer',
      imgUrl: 'https://example.com/image',
      rating: 4,
      status: 'Released'
    });

    console.log('Test setup - Token:', token);
    console.log('Test setup - UserId:', userId);
    console.log('Test setup - MovieId:', testMovie.id);
  });

  const addBookmarkViaAPI = async () => {
    console.log('Adding bookmark. User ID:', userId, 'Movie ID:', testMovie.id);
    const response = await request(app)
      .post(`/bookmark/${testMovie.id}`)
      .set('Authorization', `Bearer ${token}`);
    console.log('Add bookmark response:', response.status, response.body);
    return response;
  };

  it('should add a bookmark for the authenticated user', async () => {
    const response = await addBookmarkViaAPI();
    console.log('Add bookmark test - Response:', response.status, response.body);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Bookmark added successfully');
    expect(response.body).toHaveProperty('bookmark');
    expect(response.body.bookmark).toHaveProperty('id');
    expect(response.body.bookmark).toHaveProperty('userId', userId);
    expect(response.body.bookmark).toHaveProperty('movieId', testMovie.id);
  });

  it('should fail to add a duplicate bookmark', async () => {
    await addBookmarkViaAPI(); // First bookmark
    const response = await addBookmarkViaAPI(); // Duplicate bookmark

    console.log('Duplicate bookmark response:', response.body);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Bookmark already exists');
  });

  it('should fail to access bookmarks without a valid token', async () => {
    const response = await request(app).get('/mybookmark');
    console.log('No token response:', response.body);

    expect(response.status).toBe(401);
  });

  it('should list all bookmarks for the authenticated user', async () => {
    await addBookmarkViaAPI(); // Add a bookmark first

    const listResponse = await request(app)
      .get('/mybookmark')
      .set('Authorization', `Bearer ${token}`);
    console.log('List bookmarks response:', listResponse.status, listResponse.body);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toBeInstanceOf(Array);
    expect(listResponse.body.length).toBeGreaterThan(0);
    expect(listResponse.body[0]).toHaveProperty('id');
    expect(listResponse.body[0]).toHaveProperty('userId', userId);
    expect(listResponse.body[0]).toHaveProperty('movieId', testMovie.id);
    expect(listResponse.body[0]).toHaveProperty('Movie');
    expect(listResponse.body[0].Movie).toHaveProperty('title', 'Test Movie');
  });

  it('should delete a bookmark for the authenticated user', async () => {
    const createResponse = await addBookmarkViaAPI();
    expect(createResponse.status).toBe(201);

    const deleteResponse = await request(app)
      .delete(`/bookmark/${testMovie.id}`)
      .set('Authorization', `Bearer ${token}`);

    console.log('Delete bookmark response:', deleteResponse.body);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toHaveProperty('message', 'Bookmark deleted successfully');

    // Check if the bookmark was actually deleted
    const checkResponse = await request(app)
      .get('/mybookmark')
      .set('Authorization', `Bearer ${token}`);
    expect(checkResponse.body).toHaveLength(0);
  });

  it('should fail to delete a non-existent bookmark', async () => {
    const nonExistentMovieId = 9999;
    const response = await request(app)
      .delete(`/bookmark/${nonExistentMovieId}`)
      .set('Authorization', `Bearer ${token}`);

    console.log('Delete non-existent bookmark response:', response.body);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Bookmark not found');
  });
});