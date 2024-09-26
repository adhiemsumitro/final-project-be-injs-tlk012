const { Movie } = require('../models');

const createMovie = async (req, res) => {
  try {
    const { title, synopsis, trailerUrl, imgUrl, rating, status } = req.body;

    // Basic validation
    if (!title || !synopsis || !trailerUrl || !imgUrl || !rating || !status) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const movie = await Movie.create({
      title,
      synopsis,
      trailerUrl,
      imgUrl,
      rating,
      status
    });

    res.status(201).json({
      message: 'Movie created successfully',
      movie: movie.toJSON() 
    });
    
  } catch (error) {
    console.error('Error creating movie:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const getMovies = async (req, res) => {
  try {
    // Fetch all movies
    const movies = await Movie.findAll();

    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};

const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, synopsis, trailerUrl, imgUrl, rating, status } = req.body;

    // Find the movie by ID
    const movie = await Movie.findByPk(id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Update movie details
    await movie.update({
      title,
      synopsis,
      trailerUrl,
      imgUrl,
      rating,
      status,
    });

    res.status(200).json({
      message: 'Movie updated successfully',
      movie,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the movie by ID
    const movie = await Movie.findByPk(id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Delete the movie
    await movie.destroy();

    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};

module.exports = { createMovie, getMovies, updateMovie, deleteMovie };
