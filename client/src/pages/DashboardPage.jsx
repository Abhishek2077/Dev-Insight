import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import Dashboard from '../components/Dashboard';

function DashboardPage() {
    const [sessions, setSessions] = useState([]);
    useEffect(() => {
        const fetchSessions = async () => {
            const response = await api.get('/codingsessions');
            setSessions(response.data);
        };
        fetchSessions();
    }, []);

    return <Dashboard sessions={sessions} />;
}
export default DashboardPage;