import { useEffect, useState } from "react";
import React from "react";
import MenuBar from "./MenuBar/MenuBar";
import UserInfo from "./UserInfo/UserInfo";
import ChatBox from "./Chatbox/Chatbox";
import HotTopics from "./HotTopics/HotTopics";
import { useNavigate } from "react-router-dom";
import { checkAuth, loadUserData } from "../../contexts/AuthContext";
import { User } from "../../types";
import './Homebase.css';

const Homebase: React.FC = () => {
    const [selectedTopic, setSelectedTopic] = useState('');
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth(navigate);
        loadUserData(setUser, setError, setIsLoading);
    }, []);

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>{error}</p>
                <button onClick={() => navigate('/')}>Return Login page</button>
            </div>
        );
    }

    const handleTopicClick = (topic: string) => {
        setSelectedTopic(topic);
      };

    return (
        <div className="homebase-container">
            <MenuBar />
            <div className="homebase-content">
                <div className="left-panel">
                    {user && <UserInfo user={user} />}
                </div>
                <div className="center-panel">
                    <ChatBox inputValue={selectedTopic} setInputValue={setSelectedTopic} />
                </div>
                <div className="right-panel">
                    <HotTopics onTopicSelect={handleTopicClick} />
                </div>
            </div>
        </div>
    );
};

export default Homebase;