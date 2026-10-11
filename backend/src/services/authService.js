const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');
const ApiError = require('../utils/ApiError');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const token = generateToken(user);
  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

const registerUser = async (data) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    throw new ApiError(400, 'User with this email already exists.');
  }

  const user = await User.create(data);
  const token = generateToken(user);
  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

module.exports = {
  generateToken,
  loginUser,
  registerUser
};
