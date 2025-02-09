import { v4 as uuidv4 } from 'uuid';
import { useState, useRef, useEffect } from "react";
import { bffUrl } from '../../../App';
import { Message } from '../../../types';
import './Chatbox.css';
import { useNavigate } from 'react-router-dom';
import { parseAnswer } from '../../../utils/stringFormatter';

interface ChatboxProps {
    inputValue: string;
    setInputValue: (value: string) => void;
}

const ChatBox: React.FC<ChatboxProps> = ({ inputValue, setInputValue }) => {
    const [message, setMessage] = useState<string>('');
    const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const ChatDisplayRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Scroll to the bottom of the chat display
        if (ChatDisplayRef.current) {
            ChatDisplayRef.current.scrollTop = ChatDisplayRef.current.scrollHeight;
        }
    }, [chatHistory]);

    // Set the input value to the selected topic
    useEffect(() => {
        if (inputValue) {
            setMessage(inputValue);
            inputRef.current?.focus();
        }
    }, [inputValue]);

    // Nagivate to login page when token is expired
    useEffect(() => {
        const tokenExpiry = localStorage.getItem('tokenExpiry');
        if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('tokenExpiry');
            localStorage.removeItem('user');
            localStorage.removeItem('sessionId');
            localStorage.removeItem('sessionTimestamp');
            navigate('/');
        }
    }, []);

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
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000); // 10 seconds timeout

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
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                const botResponse = data.conversation.message[1].content;
                const rawAnwser = parseAnswer(botResponse);
                const content = rawAnwser ? rawAnwser : 'Sorry! something went wrong. Please try again later.';

                if (data) {
                    setChatHistory(prev => [...prev, {
                        id: uuidv4(),
                        text: content,
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
                    <p>Wait me a sec...</p>
                </div>}
            </div>
            <form onSubmit={handleMessageSend} className="chat-input-form">
                <input
                    type="text"
                    placeholder="Type a message..."
                    ref={inputRef}
                    onKeyDown={handleKeyDown}
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                        setInputValue(e.target.value);
                    }
                    }
                />
                <button type="submit" disabled={!message.trim()}>Send</button>
            </form>
        </div>
    );
};

export default ChatBox;