import { useState, useEffect } from 'react';
import api from '../api/axiosConfig'; 

function EditSessionModal({ session, onClose, onSessionUpdated }) {
  const [notes, setNotes] = useState('');
  const [focusLevel, setFocusLevel] = useState(3);

  useEffect(() => {
    if (session) {
      setNotes(session.notes);
      setFocusLevel(session.focusLevel);
    }
  }, [session]);

  if (!session) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedSession = { ...session, notes, focusLevel };
    try {
        
        await api.put(`/codingsessions/${session.id}`, updatedSession);
        onSessionUpdated(); 
        onClose(); 
    } catch (error) {
        alert("Failed to update session.");
        console.error("Update failed:", error); 
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl p-6 w-full max-w-lg mx-4">
        <h2 className="text-2xl font-bold text-violet-400 mb-4">Edit Session</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-notes" className="block text-sm font-medium text-slate-400 mb-1">Notes:</label>
            <textarea
              id="edit-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-32 bg-gray-800 border border-gray-700 rounded-md p-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Focus Level:</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFocusLevel(level)}
                  className={`flex-1 text-center py-2 rounded-lg ${focusLevel === level ? 'bg-violet-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button type="button" onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
            <button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-lg">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default EditSessionModal;