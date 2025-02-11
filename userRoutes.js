const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// User Sign-up
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  
  // Check if user already exists
  const user = await User.findOne({ email });
  if (user) return res.status(400).json({ message: 'User already exists' });

  // Hash password and create new user
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();

  res.status(201).json({ message: 'User created successfully' });
});

// User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
