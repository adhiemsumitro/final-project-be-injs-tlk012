const { Bookmark, Movie, User, sequelize } = require('../models');

exports.addBookmark = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const movieId = req.params.movieId;
    
    // Check if the user exists
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the movie exists
    const movie = await Movie.findByPk(movieId, { transaction });
    if (!movie) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Check if bookmark already exists
    const existingBookmark = await Bookmark.findOne({
      where: { userId, movieId },
      transaction
    });

    if (existingBookmark) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Bookmark already exists' });
    }

    const newBookmark = await Bookmark.create({ userId, movieId }, { transaction });
    
    await transaction.commit();
    res.status(201).json({ 
      message: 'Bookmark added successfully', 
      bookmark: newBookmark 
    });
  } catch (error) {
    await transaction.rollback();
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

    const bookmark = await Bookmark.findOne({
      where: { userId, movieId }
    });

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    await bookmark.destroy();
    res.status(200).json({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};