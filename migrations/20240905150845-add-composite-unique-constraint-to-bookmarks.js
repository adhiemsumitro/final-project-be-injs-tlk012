'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Bookmarks', {
      fields: ['userId', 'movieId'], // The fields to be combined for the unique constraint
      type: 'unique',
      name: 'unique_user_movie_constraint' // Name of the unique constraint
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Bookmarks', 'unique_user_movie_constraint'); // Remove the constraint on rollback
  }
};
