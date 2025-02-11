const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');  // Correctly import the http module
const socketIo = require('socket.io');  // Import socket.io properly
const userRoutes = require('./routes/userRoutes');
const matchRoutes = require('./routes/matchRoutes');
const chatRoutes = require('./routes/chatRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Initialize express app
const app = express();

// Create the HTTP server with Express
const server = http.createServer(app);

// Set up socket.io with the created HTTP server
const io = socketIo(server);

// Set up middleware
app.use(cors());
app.use(express.json());  // For parsing application/json

// Set up routes
app.use('/api/user', userRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/payment', paymentRoutes);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/down-for-love', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Socket.io setup for real-time communication
io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);

  // Join the room for a user (chat with specific person)
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`${socket.id} joined room: ${roomId}`);
  });

  // Send message
  socket.on('send-message', (message) => {
    io.to(message.roomId).emit('receive-message', message);  // Broadcast to the room
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected: ' + socket.id);
  });
});

// Start the server and listen on port 5000
server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
