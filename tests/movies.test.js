const request = require('supertest');
const { app, clearDatabase, createTestUserInDB } = require('./testSetup');
const { Movie } = require('../models');

describe('Movie Endpoints', () => {
  let token;
  let userId;

  beforeEach(async () => {
    await clearDatabase();
    const { user, password } = await createTestUserInDB();
    userId = user.id;

    const loginResponse = await request(app)
      .post('/login')
      .send({
        username: user.username,
        password: password
      });

    token = loginResponse.body.accessToken;
  });

  const createMovieViaAPI = async (movieData) => {
    const response = await request(app)
      .post('/movies')
      .set('Authorization', `Bearer ${token}`)
      .send(movieData);
    return { status: response.status, body: response.body };
  };
  

  const fetchMoviesViaAPI = async () => {
    return await request(app)
      .get('/movies')
      .set('Authorization', `Bearer ${token}`);
  };

  it('should fetch a list of movies', async () => {
    // Create a test movie first
    await Movie.create({
      title: 'Test Movie',
      synopsis: 'A test movie synopsis',
      trailerUrl: 'https://example.com/trailer',
      imgUrl: 'https://example.com/image',
      rating: 4,
      status: 'Released'
    });

    const response = await fetchMoviesViaAPI();

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('title', 'Test Movie');
  });

  it('should fail to fetch movies without a valid token', async () => {
    const response = await request(app).get('/movies');
  
    expect(response.status).toBe(401);
  });

  it('should add a new movie', async () => {
    const newMovie = {
      title: 'New Test Movie',
      synopsis: 'A new test movie synopsis',
      trailerUrl: 'https://example.com/newtrailer',
      imgUrl: 'https://example.com/newimage',
      rating: 4,
      status: 'Released'
    };

    const response = await createMovieViaAPI(newMovie);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Movie created successfully');
    expect(response.body.movie).toHaveProperty('id');
    expect(response.body.movie).toHaveProperty('title', newMovie.title);
    
  });

  it('should not add a movie with missing required fields', async () => {
    const incompleteMovie = {
      title: 'Incomplete Movie'
      // Missing other required fields
    };

    const response = await createMovieViaAPI(incompleteMovie);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should update an existing movie', async () => {
    const createResponse = await createMovieViaAPI({
      title: 'Original Title',
      synopsis: 'Original synopsis',
      trailerUrl: 'https://example.com/originaltrailer',
      imgUrl: 'https://example.com/originalimage',
      rating: 4,
      status: 'Released'
    });
  
    const movieId = createResponse.body.movie.id;

    // Check if movieId is defined
    if (!movieId) {
      throw new Error('Movie ID is undefined');
    }

    // Now update the movie
    const updateData = {
      title: 'Updated Title',
      synopsis: 'Updated synopsis'
    };

    const updateResponse = await request(app)
      .put(`/movies/${movieId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toHaveProperty('message', 'Movie updated successfully');
    expect(updateResponse.body.movie).toHaveProperty('title', updateData.title);
    expect(updateResponse.body.movie).toHaveProperty('synopsis', updateData.synopsis);
});

it('should delete an existing movie', async () => {
  const createResponse = await createMovieViaAPI({
    title: 'Movie to Delete',
    synopsis: 'This movie will be deleted',
    trailerUrl: 'https://example.com/deletetrailer',
    imgUrl: 'https://example.com/deleteimage',
    rating: 4,
    status: 'Released'
  });

  const movieId = createResponse.body.movie.id;

  // Check if movieId is defined
  if (!movieId) {
    throw new Error('Movie ID is undefined');
  }

  // Now delete the movie
  const deleteResponse = await request(app)
    .delete(`/movies/${movieId}`)
    .set('Authorization', `Bearer ${token}`);

  expect(deleteResponse.status).toBe(200);
  expect(deleteResponse.body).toHaveProperty('message', 'Movie deleted successfully');

  // Verify the movie no longer exists
  const fetchResponse = await request(app)
    .get(`/movies/${movieId}`)
    .set('Authorization', `Bearer ${token}`);

  expect(fetchResponse.status).toBe(404);
});

});