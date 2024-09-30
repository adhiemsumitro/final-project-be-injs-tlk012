const { app, clearDatabase, createTestUserInDB } = require('./testSetup');
const request = require('supertest');
const { Movie, Bookmark, User } = require('../models');

describe('Bookmark Endpoints', () => {
  let token;
  let userId;
  let testMovie;

  beforeEach(async () => {
    await clearDatabase(false);
    //await new Promise(resolve => setTimeout(resolve, 100));  // 500ms delay

    try {
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
      
      if (loginResponse.status !== 200) {
        throw new Error('Failed to log in test user');
      }
      
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

      console.log('Created user:', user.toJSON());
      console.log('Created movie:', testMovie.toJSON());
      console.log('Test setup - Token:', token);
      console.log('Test setup - UserId:', userId);
      console.log('Test setup - MovieId:', testMovie.id);
    } catch (error) {
      console.error('Error in test setup:', error);
      throw error;
    }
  });

  const addBookmarkViaAPI = async (movieId = testMovie.id) => {
    console.log('Sending bookmark request - userId:', userId, 'movieId:', movieId, 'token:', token);
    return await request(app)
      .post(`/bookmark/${movieId}`)
      .set('Authorization', `Bearer ${token}`);
  };

  it('should add a bookmark for the authenticated user', async () => {
    const response = await addBookmarkViaAPI();
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Bookmark added successfully');
    expect(response.body).toHaveProperty('bookmark');
    expect(response.body.bookmark).toHaveProperty('userId', userId);
    expect(response.body.bookmark).toHaveProperty('movieId', testMovie.id);
  });

  it('should fail to add a bookmark for a non-existent movie', async () => {
    const nonExistentMovieId = 9999;
    const response = await addBookmarkViaAPI(nonExistentMovieId);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'User or Movie not found');
  });

  it('should fail to add a duplicate bookmark', async () => {
    await addBookmarkViaAPI(); // First bookmark
    const response = await addBookmarkViaAPI(); // Duplicate bookmark
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Bookmark already exists');
  });

  it('should fail to access bookmarks without a valid token', async () => {
    const response = await request(app).get('/mybookmark');
    expect(response.status).toBe(401);
  });

  it('should list all bookmarks for the authenticated user', async () => {
    await addBookmarkViaAPI(); // Add a bookmark first

    const listResponse = await request(app)
      .get('/mybookmark')
      .set('Authorization', `Bearer ${token}`);

    expect(listResponse.status).toBe(200);
    expect(Array.isArray(listResponse.body)).toBe(true);
    if (listResponse.body.length > 0) {
      expect(listResponse.body[0]).toHaveProperty('userId', userId);
      expect(listResponse.body[0]).toHaveProperty('movieId', testMovie.id);
      expect(listResponse.body[0]).toHaveProperty('Movie');
      expect(listResponse.body[0].Movie).toHaveProperty('title', 'Test Movie');
    }
  });

  it('should delete a bookmark for the authenticated user', async () => {
    const createResponse = await addBookmarkViaAPI();
    expect(createResponse.status).toBe(201);

    const deleteResponse = await request(app)
      .delete(`/bookmark/${testMovie.id}`)
      .set('Authorization', `Bearer ${token}`);

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

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Bookmark not found');
  });
});