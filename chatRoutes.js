const express = require('express');
const router = express.Router();
const Chat = require('../models/Message');

// Send a message
router.post('/send', async (req, res) => {
  const { fromUserId, toUserId, message } = req.body;
  const newMessage = new Chat({ fromUserId, toUserId, message });
  await newMessage.save();
  res.status(201).json({ message: 'Message sent' });
});

// Get chat history
router.get('/history/:userId', async (req, res) => {
  const userId = req.params.userId;
  const messages = await Chat.find({ $or: [{ fromUserId: userId }, { toUserId: userId }] });
  res.json(messages);
});

module.exports = router;
