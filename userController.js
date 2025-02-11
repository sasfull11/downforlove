const cloudinary = require('../config/cloudinary'); // Assuming cloudinary config is set up correctly
const User = require('../models/User'); // User model

const updateProfile = async (req, res) => {
  try {
    const { bio } = req.body;
    let profilePicUrl = ''; // Default empty profile picture URL

    // Check if profilePic is being uploaded
    if (req.files && req.files.profilePic) {
      // Upload the file to Cloudinary and get the URL
      const result = await cloudinary.uploader.upload(req.files.profilePic.tempFilePath);
      profilePicUrl = result.secure_url;
    }

    // Update the user's profile (bio and profile picture)
    const updatedUser = await User.findByIdAndUpdate(
      req.userId, // Assuming userId is passed through middleware or session
      { bio, profilePic: profilePicUrl }, // Fields to update
      { new: true } // Return the updated user object
    );
    
    res.status(200).json(updatedUser); // Send back the updated user object
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

module.exports = { updateProfile };
