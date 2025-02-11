const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },        // User's name
  email: { type: String, required: true, unique: true },  // User's email (must be unique)
  password: { type: String, required: true },    // User's password
  bio: { type: String },                         // User's bio (optional)
  profilePic: { type: String },                  // Profile picture (optional)
  isPremium: { type: Boolean, default: false },  // Is the user a premium member? Default: false
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatica
