import { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMsg('');
        if (password !== confirmPassword) {
            setErrorMsg('Passwords do not match.');
            return;
        }
        try {
            await api.post('/api/auth/register', {
                username,
                email,
                password
            });
            // Registration successful, redirect to login
            navigate('/login');
        } catch (error) {
            let msg = 'Registration failed. Please try again.';
            if (error.response && error.response.data) {
                if (Array.isArray(error.response.data)) {
                    msg = error.response.data.map(e => e.description || e).join(' ');
                } else if (typeof error.response.data === 'object') {
                    msg = error.response.data.message || JSON.stringify(error.response.data);
                } else if (typeof error.response.data === 'string') {
                    msg = error.response.data;
                }
            }
            setErrorMsg(msg);
        }
    };

    return (
        <div className="bg-black text-slate-300 min-h-screen font-sans">
            <div className="flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-md space-y-8 bg-gray-900 border border-gray-700 p-10 rounded-2xl shadow-lg">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
                            Create a New Account
                        </h2>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username" className="sr-only">Username</label>
                            <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} type="text" required className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:z-10 focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm" placeholder="Username" />
                        </div>
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input id="email-address" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="relative block w-full appearance-none rounded-none border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:z-10 focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm" placeholder="Email address" />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="relative block w-full appearance-none rounded-none border-b-0 rounded-t-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:z-10 focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm" placeholder="Password (min 6 chars, with uppercase & number)" />
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                            <input id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" required className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:z-10 focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm" placeholder="Confirm Password" />
                        </div>
                        {errorMsg && <div className="text-red-400 text-center text-sm font-semibold">{errorMsg}</div>}
                        <div>
                            <button type="submit" className="group relative flex w-full justify-center rounded-md border border-transparent bg-violet-600 py-2 px-4 text-sm font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                                Register
                            </button>
                        </div>
                    </form>
                    <p className="text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-violet-400 hover:text-violet-300">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;