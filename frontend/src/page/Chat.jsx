import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

import "./style/chat.css";

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [sent, setSent] = useState([]);
  const [image, setImage] = useState(null); // State for the selected image

  const socket = io.connect('http://localhost:9000');
  // https://chat-app-neon-one.vercel.app/
  useEffect(() => {
    socket.on('message', (message) => {
      console.log('Message received:', message);
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, { type: 'text', content: message }];
        console.log('Updated messages:', updatedMessages);
        return updatedMessages;
      });
    });

    socket.on('image', (image) => {
      console.log('Image received:', image);
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, { type: 'image', content: image }];
        console.log('Updated messages with image:', updatedMessages);
        return updatedMessages;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendClick = () => {
    if (message) {
      socket.emit('user-message', message);
      console.log('Message sent:', message);
      setSent((prevMessages) => [...prevMessages, { type: 'text', content: message }]);
      setMessage('');
    }
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        socket.emit('user-image', base64Image);
        console.log('Image sent');
        setSent((prevMessages) => [...prevMessages, { type: 'image', content: base64Image }]);
        setImage(null);
      };
      reader.readAsDataURL(image);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div>
      <div className="all-one">
        <div className="one">
          {sent.map((msg, index) => (
            <div className="message" key={index}>
              {msg.type === 'text' ? (
                <h1 className="sent">sent::{msg.content}</h1>
              ) : (
                <img className="sent" src={msg.content} alt="Sent" />
              )}
            </div>
          ))}
          {messages.map((msg, index) => (
            <div className="message" key={index}>
              {msg.type === 'text' ? (
                <h1 className="received">received::{msg.content}</h1>
              ) : (
                <img className="received" src={msg.content} alt="Received"  width="200px"  height="200px" />
              )}
            </div>
          ))}
        </div>
        <div className="form">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter Message"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <button onClick={handleSendClick}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default Chat;