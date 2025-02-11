// src/components/ChatPage.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');  // Connect to the backend server

const ChatPage = ({ match }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const userId = match.params.userId;

  useEffect(() => {
    // Fetch chat history for the user
    axios.get(`/api/chat/history/${userId}`)
      .then(response => setMessages(response.data))
      .catch(err => console.log(err));

    // Join the chat room
    socket.emit('join-room', userId);

    // Listen for incoming messages
    socket.on('receive-message', (newMessage) => {
      setMessages(prevMessages => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('receive-message');
    };
  }, [userId]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const message = {
        fromUserId: 'currentUserId',
        toUserId: userId,
        message: messageInput,
        roomId: userId,
      };
      socket.emit('send-message', message);
      setMessageInput('');
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.fromUserId === 'currentUserId' ? 'sent' : 'received'}`}>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatPage;
// server.js (backend)

const socketIo = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Join chat room based on userId
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
  });

  // Send message
  socket.on('send-message', (message) => {
    io.to(message.roomId).emit('receive-message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(5000, () => console.log('Server running'));
