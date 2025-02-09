import { useNavigate } from "react-router-dom";


const MenuBar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = (): void => {
        try {
            // Remove the auth token and user data from local storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('tokenExpiry');
            localStorage.removeItem('user');
            navigate('/');
        } catch (error) {
            console.error('Failed to logout', error);
        }
    };

    const handleDashboardClick = (): void => {
        navigate('/homebase');
    };

    return (
        <div className="menu-bar">
            <div className="menu-bar-title">
                <h1>XCare Management Service</h1>
            </div>
            <div className="menu-bar-options">
                <button onClick={handleDashboardClick}>Dashboard</button>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default MenuBar;