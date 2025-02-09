import { useEffect, useState } from "react";
import { checkAuth, loadUserData } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Ticket } from "app/shared";
import { bffUrl } from "../../App";


const Dashboard: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth(navigate);
        loadUserData(setUser, setError, setIsLoading);
        fetchTickets();
    }, []);
 
    const fetchTickets = async () => {
        try {
            const userString = localStorage.getItem('user');
            const user = userString ? JSON.parse(userString) : null;
            const createdBy = user?.username;
            
            const response = await fetch(`${bffUrl}/webchat/tikets?createdBy=${createdBy}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
    
            });
            
            if (response.ok) {
                const data = await response.json();
                setTickets(data);
            } else {
                throw new Error('Failed to fetch tickets');
            }
        } catch (error) {
            setError('Failed to fetch tickets. Please try again later.');
            console.error('Failed to fetch tickets', error);
        } finally {
            setIsLoading(false);
        }
    };

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
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <h2>Dashboard</h2>
            <ul>
                {tickets.map((ticket: Ticket) => (
                    <li key={ticket.id} onClick={() => setSelectedTicket(ticket)}>
                        <h3>{ticket.title}</h3>
                        <p>{ticket.content}</p>
                    </li>
                ))}
            </ul>
            {selectedTicket && (
                <div className="ticket-details">
                    <h3>{selectedTicket.title}</h3>
                    <p>{selectedTicket.createdDate.toString()}</p>
                    <p>Created by: {selectedTicket.createdBy.username}</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;