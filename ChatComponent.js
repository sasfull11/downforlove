import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Replace with your backend URL

const ChatComponent = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Listen for incoming messages
  useEffect(() => {
    socket.on('receive_message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('receive_message'); // Clean up the socket listener
    };
  }, []);

  // Send message
  const sendMessage = () => {
    socket.emit('send_message', message);
    setMessages((prevMessages) => [...prevMessages, { text: message, sender: 'You' }]);
    setMessage('');
  };

  return (
    <div>
      <div>
        <h2>Chat</h2>
ChatComponent.js        <div>
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.sender}: </strong>{msg.text}
            </div>
          ))}
        </div>
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatComponent;
