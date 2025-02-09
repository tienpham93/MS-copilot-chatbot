import { v4 as uuidv4 } from 'uuid';
import { useState, useRef, useEffect } from "react";
import { Message } from 'app/shared';
import { bffUrl } from '../../App';

const ChatBox: React.FC = () => {
    const [message, setMessage] = useState<string>('');
    const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const ChatDisplayRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Scroll to the bottom of the chat display
        if (ChatDisplayRef.current) {
            ChatDisplayRef.current.scrollTop = ChatDisplayRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const handleMessageSend = async (e: React.FormEvent | React.KeyboardEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newMessage: Message = {
            id: uuidv4(),
            text: message,
            timestamp: new Date(),
            sender: 'user',
        };

        setChatHistory(prev => [...prev, newMessage]);
        setMessage('');
        setIsTyping(true);

        // Check for session expiration or specific user messages
        let sessionId = localStorage.getItem('sessionId');
        let sessionTimestamp = localStorage.getItem('sessionTimestamp');
        const currentTime = new Date().getTime();
        const sessionDuration = 5 * 60 * 1000; // 5 minutes in milliseconds

        if (
            !sessionId || !sessionTimestamp // No session data
            || currentTime - parseInt(sessionTimestamp) > sessionDuration // Session expired
            || ['start over', 'reset', 'new conversation'].includes(message.toLowerCase()) // User wants to start a new conversation
        ) {
            sessionId = uuidv4(); // Generate a new UUID for the session
            localStorage.setItem('sessionId', sessionId);
            localStorage.setItem('sessionTimestamp', currentTime.toString());
            setChatHistory([]);
        }

        // Send the message to the BFF server
        try {
            const response = await fetch(`${bffUrl}/webchat/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({
                    message: message,
                    sessionId: sessionId,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data) {
                    setChatHistory(prev => [...prev, {
                        id: uuidv4(),
                        text: data.message,
                        timestamp: new Date(),
                        sender: 'bot',
                    }]);
                }
            }
            // check token tokenExpiry in localStorage then Clear sessionId and sessionTimestamp
            const tokenExpiry = localStorage.getItem('tokenExpiry');
            if (tokenExpiry && currentTime > parseInt(tokenExpiry)) {
                localStorage.removeItem('sessionId');
                localStorage.removeItem('sessionTimestamp');
            }
        } catch (error) {
            setChatHistory(prev => [...prev, {
                id: uuidv4(),
                text: 'Sorry! something went wrong. Please try again later.',
                timestamp: new Date(),
                sender: 'bot',
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    // Function to start a new conversation
    const startNewConversation = () => {
        localStorage.removeItem('sessionId');
        localStorage.removeItem('sessionTimestamp');
        setChatHistory([]);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleMessageSend(e);
        };
    };

    return (
        <div className="chatbox-container">
            <div className="chat-header">
                <h2>XCare Assistant</h2>
            </div>

            <div className="chat-display" ref={ChatDisplayRef}>
                {chatHistory.map((message, index) => (
                    <div key={index} className={`chat-message ${message.sender}`}>
                        <p>{message.text}</p>
                        <span>{message.timestamp.toLocaleTimeString()}</span>
                    </div>
                ))}
                {isTyping && <div className="chat-message bot">
                    <p>Typing...</p>
                </div>}
                <form onSubmit={handleMessageSend} className="chat-input-form">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        ref={inputRef}
                        onKeyDown={handleKeyDown}
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value)
                        }
                        }
                    />
                    <button type="submit" disabled={isTyping || !message.trim()}>Send</button>
                </form>
            </div>
            <button onClick={startNewConversation}>Start Over</button>
        </div>
    );
};

export default ChatBox;