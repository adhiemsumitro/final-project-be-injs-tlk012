'use strict';
module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define('Movie', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 100] // Ensures the title is between 2 and 100 characters long
      }
    },
    synopsis: DataTypes.TEXT,
    trailerUrl: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true // Ensures the trailerUrl is a valid URL
      }
    },
    imgUrl: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true // Ensures the imgUrl is a valid URL
      }
    },
    rating: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1, // Minimum rating
        max: 5  // Maximum rating
      }
    },
    status: DataTypes.STRING
  }, {});

  // Define associations
  Movie.associate = function(models) {
    Movie.hasMany(models.Bookmark, { 
      foreignKey: 'movieId', 
      as: 'bookmarks',
      onDelete: 'CASCADE'
    });
  };

  return Movie;
};
