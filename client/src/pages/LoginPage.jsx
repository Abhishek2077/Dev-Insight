import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // We use our new security office

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth(); // Get the login function from our security office

    const handleSubmit = async (event) => {
        event.preventDefault();
        const success = await login(email, password);
        if (!success) {
            alert('Login failed. Please check your email and password.');
        }
    };

    return (
        <div className="bg-black text-slate-300 min-h-screen font-sans">
            <div className="flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-md space-y-8 bg-gray-900 border border-gray-700 p-10 rounded-2xl shadow-lg">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
                            Sign in to your account
                        </h2>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input id="email-address" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500" placeholder="Email address" />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500" placeholder="Password" />
                        </div>
                        <div>
                            <button type="submit" className="group relative flex w-full justify-center rounded-md border border-transparent bg-violet-600 py-2 px-4 text-sm font-medium text-white hover:bg-violet-700">
                                Sign in
                            </button>
                        </div>
                    </form>
                    <p className="text-center text-sm text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-violet-400 hover:text-violet-300">
                            Register now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;