// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Your User model
const router = express.Router();

// Sign-up Route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
// routes/authRoutes.js
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1h' });

    res.json({ token, userId: user._id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});
const express = require('express');
const { signUp, signIn } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);

module.exports = router;
const express = require('express');
const { signUp, signIn } = require('../controllers/authController');
const router = express.Router();

// Sign-up and Sign-in routes
router.post('/signup', signUp);
router.post('/signin', signIn);

module.exports = router;
