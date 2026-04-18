const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { sendVerificationEmail } = require('../utils/email');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields required' });
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password });
    try { await sendVerificationEmail(user.email, user._id); } catch (e) {}
    res.status(201).json({
      message: 'Account created. Check your email to verify.',
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, lastActive: user.lastActive, emergencyContact: user.emergencyContact }
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });
    user.lastActive = Date.now();
    user.inactiveAlertSent = false;
    await user.save();
    res.json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, lastActive: user.lastActive, emergencyContact: user.emergencyContact }
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/auth/verify/:id
router.get('/verify/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isVerified = true;
    await user.save();
    res.json({ message: 'Email verified successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/auth/profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/auth/profile — update name + emergency contact
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, emergencyContact } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (name) user.name = name.trim();
    if (emergencyContact !== undefined) user.emergencyContact = emergencyContact.trim();
    await user.save();
    res.json({
      message: 'Profile updated',
      user: { id: user._id, name: user.name, email: user.email, lastActive: user.lastActive, emergencyContact: user.emergencyContact }
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
