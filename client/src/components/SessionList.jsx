import { useState } from 'react';
import SessionTracker from './SessionTracker';
import api from '../api/axiosConfig';
import { format } from 'date-fns';
import AiModal from './AiModal';
import EditSessionModal from './EditSessionModal';

function SessionList({ sessions, fetchSessions }) {
  const [sessionToEdit, setSessionToEdit] = useState(null);
  const [sessionToAnalyze, setSessionToAnalyze] = useState(null);
  const [aiAdvice, setAiAdvice] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // ...existing code...
  const handleAnalyzeClick = async (session) => {
    setSessionToAnalyze(session);
    setIsLoadingAi(true);
    try {
      const response = await api.post(`/codingsessions/${session.id}/analyze`);
      setAiAdvice(response.data.advice);
    } catch (error) {
      setAiAdvice('Sorry, I could not get advice from the AI.');
    }
    setIsLoadingAi(false);
  };
  
  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      try {
        await api.delete(`/codingsessions/${id}`);
      } catch (error) {
        alert("Could not delete the session.");
      }
    }
  };

  const closeModals = () => {
    setSessionToEdit(null);
    setSessionToAnalyze(null);
    setAiAdvice('');
  };

  const [showSessionForm, setShowSessionForm] = useState(false);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h2 className="text-4xl font-extrabold text-violet-300 tracking-tight drop-shadow">Past Sessions</h2>
        <button
          className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-6 rounded-xl text-lg shadow transition"
          onClick={() => setShowSessionForm((v) => !v)}
        >
          {showSessionForm ? 'Close' : '+ Create New Session'}
        </button>
      </div>
      {showSessionForm && (
        <div className="mb-8">
          <SessionTracker onSessionCreated={() => { setShowSessionForm(false); fetchSessions && fetchSessions(); }} />
        </div>
      )}
      <AiModal advice={aiAdvice} isLoading={isLoadingAi} onClose={closeModals} />
      <EditSessionModal session={sessionToEdit} onClose={closeModals} onSessionUpdated={fetchSessions} />
      {sessions.length === 0 ? (
        <p className="text-slate-400 text-center">No sessions logged yet. Go make one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sessions.map(session => (
            <div key={session.id} className="bg-gradient-to-br from-gray-900 via-gray-950 to-violet-950 border-2 border-violet-700 p-6 rounded-2xl shadow-2xl hover:scale-[1.02] transition-transform duration-200">
              <p className="text-gray-400 text-sm mb-2">
                {format(new Date(session.startTime), 'PPP p')}
              </p>
              <p className="text-slate-200 mb-3 text-lg font-medium">
                {session.notes}
              </p>
              <div className="flex justify-between items-center">
                <p className="text-violet-400 font-semibold text-lg">
                  Focus: {session.focusLevel}/5
                </p>
                <div className="flex space-x-2">
                    <button onClick={() => handleAnalyzeClick(session)} className="bg-sky-900 border border-sky-500 text-sky-300 hover:bg-sky-700 font-bold py-1 px-3 rounded-md text-xs shadow">Analyze</button>
                    <button onClick={() => setSessionToEdit(session)} className="bg-gray-800 border border-gray-500 text-gray-200 hover:bg-gray-700 font-bold py-1 px-3 rounded-md text-xs shadow">Edit</button>
                    <button onClick={() => handleDeleteClick(session.id)} className="bg-red-900 border border-red-500 text-red-300 hover:bg-red-700 font-bold py-1 px-3 rounded-md text-xs shadow">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default SessionList;