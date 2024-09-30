const { Bookmark, Movie, User, sequelize } = require('../models');

exports.addBookmark = async (req, res) => {
  const userId = req.user.id;
  const movieId = req.params.movieId;
  
  console.log('Received addBookmark request - userId:', userId, 'movieId:', movieId);

  try {

    // Check if bookmark already exists
    const existingBookmark = await Bookmark.findOne({
      where: { userId, movieId }
    });

    if (existingBookmark) {
      console.log('Bookmark already exists:', existingBookmark.id);
      return res.status(400).json({ message: 'Bookmark already exists' });
    }

    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User or Movie not found' });
    }
    console.log('User found:', user.id);

    // Check if the movie exists
    const movie = await Movie.findByPk(movieId);
    if (!movie) {
      console.log('Movie not found:', movieId);
      return res.status(404).json({ message: 'User or Movie not found' });
    }
    console.log('Movie found:', movie.id);



    // Start transaction only when we're ready to create the bookmark
    const transaction = await sequelize.transaction();

    try {
      const newBookmark = await Bookmark.create({ userId, movieId }, { transaction });
      
      await transaction.commit();
      console.log('New bookmark created:', newBookmark.id);
      res.status(201).json({ 
        message: 'Bookmark added successfully', 
        bookmark: newBookmark 
      });
    } catch (error) {
      await transaction.rollback();
      throw error; // Re-throw to be caught by the outer catch block
    }
  } catch (error) {
    console.error('Error in addBookmark:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
exports.getBookmarks = async (req, res) => {
  try {
    console.log('Starting getBookmarks function');
    console.log('Request user:', req.user);

    const userId = req.user.id;
    console.log(`Fetching bookmarks for userId=${userId}`);
    const bookmarks = await Bookmark.findAll({
      where: { userId },
      include: [{ model: Movie, as: 'Movie' }]
    });
    console.log(`Found ${bookmarks.length} bookmarks`);
    res.status(200).json(bookmarks);
  } catch (error) {
    console.error('Error in getBookmarks:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.deleteBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
    const movieId = req.params.movieId;

    console.log('Deleting bookmark - userId:', userId, 'movieId:', movieId);

    const bookmark = await Bookmark.findOne({
      where: { userId, movieId }
    });

    if (!bookmark) {
      console.log('Bookmark not found for deletion');
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    await bookmark.destroy();
    console.log('Bookmark deleted successfully');
    res.status(200).json({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};