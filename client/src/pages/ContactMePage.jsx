import React from 'react';

export default function ContactMePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-lg p-10 max-w-lg w-full">
        <h2 className="text-3xl font-bold text-violet-400 mb-6 text-center">Contact Me</h2>
        <div className="space-y-4 text-lg text-slate-200">
          <div>
            <span className="font-semibold">Email:</span> <a href="mailto:abhishek.tripathi5432@gmail.com" className="text-violet-300 hover:underline">abhishek.tripathi5432@gmail.com</a>
          </div>
          <div>
            <span className="font-semibold">Phone:</span> <a href="tel:7701859650" className="text-violet-300 hover:underline">7701859650</a>
          </div>
          <div>
            <span className="font-semibold">GitHub:</span> <a href="https://github.com/Abhishek2077" target="_blank" rel="noopener noreferrer" className="text-violet-300 hover:underline">Abhishek2077</a>
          </div>
          <div>
            <span className="font-semibold">LinkedIn:</span> <a href="https://www.linkedin.com/in/abhishektripathi-ai/" target="_blank" rel="noopener noreferrer" className="text-violet-300 hover:underline">abhishektripathi-ai</a>
          </div>
        </div>
      </div>
    </div>
  );
}
