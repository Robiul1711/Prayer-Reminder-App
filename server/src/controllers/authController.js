const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const QazaLog = require('../models/QazaLog');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'prayer_reminder_super_secret_jwt_key_2026', {
    expiresIn: '365d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, location } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name || 'Muslim Servant',
      email,
      password: hashedPassword,
      location: location || { city: 'Dhaka', country: 'Bangladesh', latitude: 23.8103, longitude: 90.4125 }
    });

    // Initialize Qaza Log for user
    await QazaLog.create({ userId: user._id });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        preferences: user.preferences,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          location: user.location,
          preferences: user.preferences,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user preferences & location
// @route   PUT /api/auth/preferences
const updatePreferences = async (req, res) => {
  try {
    const { preferences, location, name } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
      if (name) user.name = name;
      if (location) user.location = { ...user.location, ...location };
      if (preferences) user.preferences = { ...user.preferences, ...preferences };

      const updatedUser = await user.save();
      res.json({ success: true, data: updatedUser });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updatePreferences
};
