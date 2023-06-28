import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function MessageContainer({ messages }) {
  const responseRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    responseRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="message-container">
      {messages.map((msg) => (
        <div className={`message ${msg.sender}`} key={msg.id}>
          <div className="logo-container">
            {msg.sender === 'bot' ? (
              <img src="logo192.png" alt="bot-img" className="logo" />
            ) : (
              <img src="icons8-user-100-2.png" alt="user-img" className="logo" />
            )}
          </div>
          <div className="text-container">{msg.content}</div>
        </div>
      ))}
      <div ref={responseRef}></div>
    </div>
  );
}

function MessageInput({ inputValue, loading, onMessageChange, onSubmit }) {
  return (
    <div className="bottom-container">
      <form onSubmit={onSubmit} className="input-form">
        <input
          type="text"
          value={inputValue}
          onChange={onMessageChange}
          placeholder="Enter your message"
          disabled={loading}
          className="input-text"
        />
        <button type="submit" disabled={loading} className="button-send">
          <i className="fas fa-check"></i>
        </button>
      </form>
    </div>
  );
}

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch initial message when the component mounts
    fetchMessage('Hello myGPT!');
  }, []);

  const fetchMessage = async (message) => {
    setLoading(true);

    // Make a POST request to the backend endpoint
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    // Update the messages with the received response
    const updatedMessages = [
      ...messages,
      { content: message, sender: 'user', id: messages.length },
      { content: data.response, sender: 'bot', id: messages.length + 1 },
    ];
    setMessages(updatedMessages);

    setInputValue('');
    setLoading(false);
  };

  const handleMessageChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (inputValue.trim() === '') {
      return;
    }

    // Fetch response when the user sends a message
    await fetchMessage(inputValue);
  };

  return (
    <div className="App">
      <h1>MyGPT</h1>

      <MessageContainer messages={messages} />

      <MessageInput
        inputValue={inputValue}
        loading={loading}
        onMessageChange={handleMessageChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default App;