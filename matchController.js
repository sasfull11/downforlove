// server/controllers/matchController.js

const Match = require('../models/Match');
const User = require('../models/User');
const mongoose = require('mongoose');

const createMatch = async (user1Id, user2Id) => {
  // Ensure valid ObjectId type
  user1Id = mongoose.Types.ObjectId(user1Id);
  user2Id = mongoose.Types.ObjectId(user2Id);

  // Ensure a match doesn't already exist
  const existingMatch = await Match.findOne({
    $or: [
      { user1: user1Id, user2: user2Id },
      { user1: user2Id, user2: user1Id },
    ]
  });

  if (existingMatch) {
    return null; // Match already exists
  }

  const match = new Match({
    user1: user1Id,
    user2: user2Id,
  });

  await match.save();
  
  return match;
};

module.exports = { createMatch };
