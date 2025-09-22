import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import * as signalR from "@microsoft/signalr";
import SessionList from '../components/SessionList';

function SessionsPage() {
  const [sessions, setSessions] = useState([]);

  // ...existing code...
  const fetchSessions = async () => {
    const response = await api.get('/codingsessions');
    setSessions(response.data);
  };

  useEffect(() => {
    fetchSessions();
    const connection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5021/sessionHub")
        .withAutomaticReconnect().build();
    connection.on("ReceiveNewSession", fetchSessions);
    connection.start();
  }, []);

  return <SessionList sessions={sessions} fetchSessions={fetchSessions} />;
}
export default SessionsPage;