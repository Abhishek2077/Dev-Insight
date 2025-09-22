import { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

function FocusSelector({ value, onChange }) {
    const levels = [1, 2, 3, 4, 5];
    return (
        <div className="flex space-x-2">
            {levels.map(level => (
                <button
                    key={level}
                    type="button"
                    onClick={() => onChange(level)}
                    className={`flex-1 text-center py-3 rounded-lg transition ${value === level ? 'bg-violet-600 text-white font-bold shadow-lg' : 'bg-gray-700 hover:bg-gray-600 text-slate-300'}`}
                >
                    {level}
                </button>
            ))}
        </div>
    );
}

function SessionTracker() {
  const [notes, setNotes] = useState('');
  const [focusLevel, setFocusLevel] = useState(3);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const startTime = new Date();
    const newSession = {
      startTime: startTime.toISOString(),
      endTime: startTime.toISOString(),
      duration: "00:00:00",
      focusLevel: focusLevel,
      notes: notes,
    };
    try {
      await api.post('/codingsessions', newSession);
  alert('Session saved successfully!');
  navigate('/sessions');
    } catch (error) {
      alert('Error: Could not save the session.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-gradient-to-br from-gray-900 via-gray-950 to-violet-950 border-2 border-violet-700 p-8 rounded-3xl shadow-2xl mt-8">
      <h2 className="text-4xl font-extrabold text-violet-300 mb-8 text-center tracking-tight drop-shadow">Make a New Session</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label htmlFor="notes" className="block text-lg font-semibold text-violet-200 mb-2">
            What did you work on?
          </label>
          <textarea
            id="notes" value={notes} onChange={(e) => setNotes(e.target.value)}
            className="w-full h-40 bg-gray-800 border-2 border-violet-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-violet-500 focus:outline-none text-lg shadow"
            placeholder="e.g., Fixed the bug in the user authentication flow..."
          />
        </div>
        <div>
          <label className="block text-lg font-semibold text-violet-200 mb-2">
            Focus Level
          </label>
          <FocusSelector value={focusLevel} onChange={setFocusLevel} />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-violet-600 to-violet-800 hover:from-violet-700 hover:to-violet-900 text-white font-extrabold py-4 px-4 rounded-xl transition duration-300 text-xl shadow-lg tracking-wide"
        >
          Save Session
        </button>
      </form>
    </div>
  );
}
export default SessionTracker;