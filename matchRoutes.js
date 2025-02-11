// routes/matchRoutes.js
const express = require('express');
const router = express.Router();
const Match = require('../models/Match');

// Match a user with another user
router.post('/swipe', async (req, res) => {
  const { user1Id, user2Id, action } = req.body;  // action can be 'like' or 'dislike'

  const existingMatch = await Match.findOne({
    $or: [
      { user1: user1Id, user2: user2Id },
      { user1: user2Id, user2: user1Id },
    ]
  });

  if (existingMatch) {
    // If both users like each other, mark as matched
    if (action === 'like') {
      existingMatch.isMatched = true;
      await existingMatch.save();
    }
    return res.json({ message: 'Match found!' });
  }

  // If no existing match, create a new record
  const newMatch = new Match({ user1: user1Id, user2: user2Id, isMatched: action === 'like' });
  await newMatch.save();

  res.status(201).json({ message: 'Swipe recorded' });
});

module.exports = router;
