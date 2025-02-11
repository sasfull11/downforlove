// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Set up file storage and handling for profile pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to filename
  },
});

const upload = multer({ storage: storage });

// Fetch user profile
router.get('/:userId', async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json(user);
});

// Update user profile
router.put('/:userId', upload.single('profilePic'), async (req, res) => {
  const { name, bio } = req.body;  // Assume these fields for simplicity
  let updatedData = { name, bio };

  // Check if a profile picture was uploaded
  if (req.file) {
    updatedData.profilePicture = req.file.path;  // Store the file path
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.userId, updatedData, { new: true });

  res.json(updatedUser);
});

module.exports = router;
