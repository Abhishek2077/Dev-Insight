import { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate, useLocation } from 'react-router-dom';

function VerifyEmailPage() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.post('/api/auth/confirm-email', { email, code });
      setMessage('Email confirmed! You can now log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to confirm email.');
    }
  };

  return (
    <div className="bg-black text-slate-300 min-h-screen font-sans flex items-center justify-center">
      <div className="w-full max-w-md space-y-8 bg-gray-900 border border-gray-700 p-10 rounded-2xl shadow-lg">
        <h2 className="text-center text-3xl font-bold tracking-tight text-white mb-4">Verify Your Email</h2>
        <p className="text-center text-gray-400 mb-6">Check your email for a confirmation code and enter it below.</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
          />
          <input
            type="text"
            placeholder="Confirmation code"
            value={code}
            onChange={e => setCode(e.target.value)}
            required
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
          />
          <button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded font-semibold">Verify Email</button>
        </form>
        {message && <div className="text-green-400 text-center mt-2">{message}</div>}
        {error && <div className="text-red-400 text-center mt-2">{error}</div>}
      </div>
    </div>
  );
}

export default VerifyEmailPage;
