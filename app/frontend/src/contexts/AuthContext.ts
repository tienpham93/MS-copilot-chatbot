import { NavigateFunction } from "react-router-dom";


export const checkAuth = (navigate: NavigateFunction) => {
    const token = localStorage.getItem('authToken');
    const expiry = localStorage.getItem('tokenExpiry');

    if (!token || !expiry || parseInt(expiry) < Date.now()) {
        localStorage.clear();
        navigate('/');
    }
};

export const loadUserData = async (setUser: any, setError: any, setIsLoading: any) => {
    try {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            throw new Error('User data not found');
        }
    } catch (error) {
        setError('Failed to load user data. Please try again.');
        console.error('Failed to load user data', error);
    } finally {
        setIsLoading(false);
    }
};