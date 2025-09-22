import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import api from '../api/axiosConfig';

function ProfilePage() {
  const { user, logout } = useAuth();
  // Change password feature removed as per request

  if (!user) return <div className="text-center text-slate-300 mt-10">You must be logged in to view your profile.</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-700">
      <h2 className="text-3xl font-bold text-violet-400 mb-2">Profile</h2>
      <div className="text-2xl text-white mb-6">Hello, <span className="text-violet-300 font-bold">{user.username || user.UserName}</span>!</div>
      <div className="mb-6">
        <div className="text-slate-300 mb-2"><span className="font-semibold">Username:</span> {user.username || user.UserName}</div>
        <div className="text-slate-300"><span className="font-semibold">Email:</span> {user.email || user.Email}</div>
      </div>
      <div className="bg-red-900 text-red-300 border border-red-500 rounded p-4 text-center font-semibold text-lg mb-6">
        <span>IMPORTANT: Please save your password somewhere safe. The change password feature will be added in a future update. Until then, if you lose your password, you will lose access to your data.</span>
      </div>
  <button onClick={logout} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-extrabold py-3 px-4 rounded-lg transition duration-300 text-lg mt-4 shadow-lg tracking-wide">Logout</button>
    </div>
  );
}

export default ProfilePage;
        