import React, { useState } from 'react';

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (message.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await fetch('http://localhost:5000/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }),
        });
        setMessages(prevMessages => [...prevMessages, message]);
        setMessage('');
      } catch (error) {
        console.error('Failed to submit', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isSubmitting) {
      event.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <div
        style={{
          border: '1px solid #ccc',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          height: '300px',
          padding: '10px',
          marginBottom: '10px',
          overflowY: 'auto',
        }}
      >
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <form onSubmit={(e) => e.preventDefault()}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ flex: 1, padding: '5px' }}
            disabled={isSubmitting}
          />
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;