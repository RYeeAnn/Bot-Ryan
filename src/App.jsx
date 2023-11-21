import React, { useState } from 'react';
import './App.scss';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import { withAuthenticator } from '@aws-amplify/ui-react';

Amplify.configure(awsExports);

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (message.trim() !== '') {
      const newMessage = { text: message, type: 'user' };
      setMessages([...messages, newMessage]);
  
      // Echo message
      setTimeout(() => {
        const echoMessage = { text: message, type: 'echo' };
        setMessages((prevMessages) => [...prevMessages, echoMessage]);
      }, 500);
  
      setMessage('');
    }
  };
  

  const forceSignOut = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <div className="App">
      <div className="chat-window">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.type}`}>{msg.type === 'user' ? 'You' : 'Echo'}: {msg.text}</div>
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
        <button onClick={forceSignOut}>Force Sign Out</button>
      </div>
    </div>
  );
}

export default withAuthenticator(App);
