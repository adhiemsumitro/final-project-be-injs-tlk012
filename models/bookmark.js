'use strict';
module.exports = (sequelize, DataTypes) => {
  const Bookmark = sequelize.define('Bookmark', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true, // Ensure it's an integer
        min: 1       // Ensure it's a positive integer
      }
    },
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true, // Ensure it's an integer
        min: 1       // Ensure it's a positive integer
      }
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['userId', 'movieId'] // Unique constraint to prevent duplicate bookmarks
      }
    ]
  });

  // Define associations
  Bookmark.associate = function(models) {
    Bookmark.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Bookmark.belongsTo(models.Movie, { foreignKey: 'movieId', as: 'Movie' });
  };

  return Bookmark;
};
