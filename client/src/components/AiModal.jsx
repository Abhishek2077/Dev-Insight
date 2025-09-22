import React, { useState } from 'react';

function AiModal({ advice, isLoading, onClose }) {
  const [chat, setChat] = useState(advice ? [{ role: 'ai', content: advice }] : []);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  // Update chat if advice changes (new analysis)
  React.useEffect(() => {
    if (advice) setChat([{ role: 'ai', content: advice }]);
  }, [advice]);

  if (!isLoading && !advice) return null;

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setChatLoading(true);
    setChat((c) => [...c, { role: 'user', content: input }]);
    try {
      // Replace with your backend endpoint for chat
      const res = await fetch('http://localhost:5021/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, history: chat }),
      });
      const data = await res.json();
      setChat((c) => [...c, { role: 'ai', content: data.reply }]);
    } catch {
      setChat((c) => [...c, { role: 'ai', content: 'AI is unavailable.' }]);
    }
    setInput('');
    setChatLoading(false);
  };

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div onClick={(e) => e.stopPropagation()} className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl p-6 w-full max-w-2xl relative flex flex-col">
        <h3 className="font-bold text-xl text-violet-400 mb-4">AI Helper says:</h3>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">&times;</button>
        <div className="max-h-[40vh] overflow-y-auto pr-2 mb-4 flex-1">
          {isLoading ? (
            <p className="text-slate-300">🤖 AI is thinking...</p>
          ) : (
            <div className="space-y-2">
              {chat.map((msg, i) => (
                <div key={i} className={msg.role === 'ai' ? 'text-slate-300' : 'text-accent text-right'}>
                  <span className="block whitespace-pre-wrap">{msg.content}</span>
                </div>
              ))}
            </div>
          )}
          {chatLoading && <p className="text-slate-400">AI is thinking...</p>}
        </div>
        {/* Chat input */}
        {!isLoading && (
          <form onSubmit={sendMessage} className="flex gap-2 mt-2">
            <input
              type="text"
              className="flex-1 border border-gray-700 rounded px-3 py-2 bg-gray-800 text-accent"
              placeholder="Type your question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={chatLoading}
            />
            <button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-4 py-2 rounded" disabled={chatLoading || !input.trim()}>
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
export default AiModal;