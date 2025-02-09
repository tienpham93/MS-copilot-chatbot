import { useEffect, useState } from "react";
import React from "react";
import MenuBar from "./MenuBar";
import UserInfo from "./UserInfo";
import ChatBox from "./Chatbox";
import HotTopics from "./HotTopics";
import { useNavigate } from "react-router-dom";
import { checkAuth, loadUserData } from "../../contexts/AuthContext";
import { User } from "app/shared";

const Homebase: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [chatInput, setChatInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth(navigate);
        loadUserData(setUser, setError, setIsLoading);
    }, []);

    const handleTopicSelect = (topic: string) => {
        setChatInput(topic);
    }

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

    return (
        <div className="homebase-container">
            <MenuBar />
            <h1>Welcome, {user?.fullname}</h1>
            <div className="homebase-container">
                <div className="left-panel">
                    {user && <UserInfo user={user} />}
                </div>
                <div className="center-panel">
                    <ChatBox />
                </div>
                <div className="right-panel">
                    <HotTopics onTopicSelect={handleTopicSelect}/>
                </div>
            </div>
        </div>
    );
};

export default Homebase;