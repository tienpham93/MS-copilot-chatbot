
export interface User {
    id: string;
    fullname: string;
    username: string;
    gender: string;
    age: string;
}

export interface UserCredential {
    username: string;
    password: string;
}

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export interface Ticket {
    id: string;
    title: string;
    content: string;
    createdBy: User;
    createdDate: Date;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface HotTopics {
    index: number;
    title: string;
    content: string;
}