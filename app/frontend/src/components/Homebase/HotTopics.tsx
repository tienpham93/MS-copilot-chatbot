import React from "react";
import type { HotTopics as HotTopicsType } from "app/shared";

interface HotTopicsProps {
    onTopicSelect: (topic: string) => void;
};

const HotTopics: React.FC<HotTopicsProps> = ({ onTopicSelect }) => {
    const [topics, setTopics] = React.useState<HotTopicsType[]>([
        { index: 1, title: 'Covid-19', content: 'Covid-19 is a virus that has been spreading rapidly across the world.' },
        { index: 2, title: 'Vaccines', content: 'Vaccines are used to prevent diseases.' },
        { index: 3, title: 'Mental Health', content: 'Mental health is an important aspect of overall health.' },
    ]);

    return (
        <div className="hot-topics-container">
            <h2>Hot Topics</h2>
            <ul>
                {topics.map((topic: HotTopicsType) => (
                    <li key={topic.index} onClick={() => onTopicSelect(topic.content)}>
                        <h3>{topic.title}</h3>
                        <p>{topic.content}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HotTopics;