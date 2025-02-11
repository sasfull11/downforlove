// server/app.js

const http = require('http');
const socketIo = require('socket.io');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);  // Initialize Socket.io

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('send-message', (message) => {
    // Broadcast the message to the intended recipient
    io.to(message.recipientId).emit('receive-message', message);
  });
});

server.listen(5000, () => {
  console.log('Server running on port 5000');
});
