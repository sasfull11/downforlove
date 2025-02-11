// client/src/components/ChatPage.js

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');  // Connect to the server

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Listen for incoming messages
    socket.on('receive-message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, []);

  const sendMessage = () => {
    socket.emit('send-message', { text: newMessage, recipientId: 'user2Id' });  // Replace with recipient ID
    setNewMessage('');
  };

  return (
    <div>
      <div>
        <h2>Chat</h2>
        {messages.map((msg, index) => (
          <div key={index}>{msg.text}</div>
        ))}
      </div>
      <input 
        type="text" 
        value={newMessage} 
        onChange={(e) => setNewMessage(e.target.value)} 
        placeholder="Type a message..." 
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatPage;
