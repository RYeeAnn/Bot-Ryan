import React, { useState, useRef, useEffect } from 'react';
import './App.scss';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import { withAuthenticator } from '@aws-amplify/ui-react';
import axios from 'axios';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(awsExports);

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const chatMessagesElement = messagesEndRef.current;
    if (chatMessagesElement) {
      chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;
    }
  }, [messages]);   

  const sendMessage = () => {
    if (message.trim() !== '') {
      const newMessage = { text: message, type: 'user' };
      setMessages([...messages, newMessage]);
  
      // Call chatbot service
      callChatbotAPI(message)
        .then((response) => {
          const botMessage = { text: response, type: 'bot' }; // Update this line
          setMessages((prevMessages) => [...prevMessages, botMessage]);
        })
        .catch((error) => {
          console.error('Error calling chatbot API:', error);
        });
  
      setMessage('');
    }
  };
  

  const callChatbotAPI = (userMessage) => {
    const endpoint = 'http://localhost:3001/'; // Pointing to your backend server

    // The body of the request should match your backend expectations
    const body = {
      inputText: userMessage, // User input text
      userId: 'WebAppUser', // A unique ID for the user, you might want to generate this for each user session
    };

    return axios
      .post(endpoint, body)
      .then((response) => {
        // Handle any kind of response from the backend
        const message = response.data.message;
        return message;
      })
      .catch((error) => {
        console.error('API call failed: ', error);
        // Handle errors gracefully
        return "There was an error processing your message.";
      });
  };

  const forceSignOut = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <div className="App">
      <div className="buttonContainer">
        <button className="button__signout" onClick={forceSignOut}>
          Sign Out
        </button>
      </div>
      <div className="container">
        <div className="chat-window">
          <div className="chat-messages" ref={messagesEndRef}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.type}`}
              >{`${msg.type === 'user' ? 'User' : 'RyanBot'}: ${msg.text}`}</div>
            ))}
          </div>
          <div className="message-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuthenticator(App);
