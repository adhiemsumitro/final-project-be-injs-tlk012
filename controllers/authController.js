const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { Op } = require('sequelize');

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Step 1: Check if username or email already exists
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ username }, { email }] },
      attributes: ['id'] // Only fetch the ID, not the whole user object
    });

    if (existingUser) {
      return res.status(409).json({ message: 'User with this username or email already exists' });
    }

    // Step 2: Hash the password
    const saltRounds = 10; // Optimal balance between security and performance
    console.time('bcryptHash');
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.timeEnd('bcryptHash');

    // Step 3: Create a new user
    console.time('User creation');
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role
    });
    console.timeEnd('User creation');

    // Step 4: Generate a JWT token for the new user
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Step 5: Return success response
    res.status(201).json({
      message: 'User registered successfully',
      accessToken: token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Login an existing user
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`Login attempt for username: ${username}`);

    // Validate username and password input
    if (!username || !password) {
      console.log('Missing username or password');
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Step 1: Check if the user exists
    const user = await User.findOne({ where: { username } });
    if (!user) {
      console.log(`User not found: ${username}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Step 2: Verify the password
    console.time('bcryptCompare');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.timeEnd('bcryptCompare');

    if (!isPasswordValid) {
      console.log(`Invalid password for user: ${username}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Step 3: Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log(`Login successful for user: ${username}`);
    res.status(200).json({
      accessToken: token,
      name: user.username,
      role: user.role,
      id: user.id
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};

module.exports = { registerUser, loginUser };
