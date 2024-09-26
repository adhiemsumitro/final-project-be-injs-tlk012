'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      validate: {
        len: [2, 50] // Ensures the name is between 2 and 50 characters long
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 30] // Ensures the username is between 3 and 30 characters long
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true // Ensures the email is in a valid format
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: [6, 100] // Ensures the password is between 6 and 100 characters long
      }
    },
    role: {
      type: DataTypes.STRING,
      validate: {
        len: [2, 20] // Ensures the role is between 2 and 20 characters long
      }
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        len: [5, 255] // Ensures the address is between 5 and 255 characters long
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      validate: {
        is: /^[0-9]+$/ // Ensures the phoneNumber contains only digits
      }
    }
  }, {});

  // Define associations
  User.associate = function(models) {
    User.hasMany(models.Bookmark, { foreignKey: 'userId', as: 'bookmarks' });
  };

  return User;
};
