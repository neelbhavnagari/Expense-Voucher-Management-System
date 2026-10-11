const authService = require('../services/authService');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);

  res.status(200).json({
    success: true,
    message: 'Login successful.',
    data: result
  });
});

const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);

  res.status(201).json({
    success: true,
    message: 'User registered successfully.',
    data: result
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  if (req.body.name) user.name = req.body.name;
  if (req.body.department) user.department = req.body.department;
  if (req.body.employeeId) user.employeeId = req.body.employeeId;
  if (req.body.signature) user.signature = req.body.signature;

  await user.save();

  const userObj = user.toObject();
  delete userObj.password;

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    data: userObj
  });
});

module.exports = {
  login,
  register,
  getMe,
  updateProfile
};
