import React, { useState } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

interface VoteComponentProps {
    conversation: {
        user: string;
        bot: string;
    };
    onVote: (conversation: any, vote: 'up' | 'down') => void;
}

const VoteComponent: React.FC<VoteComponentProps> = ({ conversation, onVote }) => {
    const [voted, setVoted] = useState(false);

    const handleVote = (vote: 'up' | 'down') => {
        if (!voted) {
            onVote(conversation, vote);
            setVoted(true);
        }
    };

    return (
        <div className="vote-component">
            <button onClick={() => handleVote('up')} disabled={voted}>
                <FaThumbsUp />
            </button>
            <button onClick={() => handleVote('down')} disabled={voted}>
                <FaThumbsDown />
            </button>
        </div>
    );
};

export default VoteComponent;