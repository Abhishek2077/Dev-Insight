import { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [hydrated, setHydrated] = useState(false);

    // Hydrate user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setHydrated(true);
    }, []);
    const navigate = useNavigate();

    const login = async (email, password) => {
        try {
            const response = await api.post('/api/auth/login', { email, password });
            const userData = response.data;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData)); // Save the ticket in the browser's safe
            navigate('/dashboard'); // Go to dashboard after login
            return true;
        } catch (error) {
            console.error('Login failed', error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user'); // Remove the ticket
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, hydrated }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};