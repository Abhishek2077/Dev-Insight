
function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-slate-200 p-4">
      <h1 className="text-5xl font-bold text-violet-400 mb-6">Welcome to Dev-Insight</h1>
      <div className="w-full max-w-4xl mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Project Details Card */}
        <div className="bg-gray-900 border-2 border-violet-700 rounded-2xl shadow-2xl p-8 flex flex-col items-center hover:scale-105 transition-transform duration-300">
          <h2 className="text-3xl font-extrabold text-violet-300 mb-4 tracking-tight">What is Dev-Insight?</h2>
          <p className="text-lg text-slate-300 mb-2 text-center">
            Dev-Insight is a modern productivity tool to track your coding sessions, analyze your focus, and help you improve your workflow. Log your sessions, view analytics, and stay motivated!
          </p>
          <div className="mt-4 text-left w-full">
            <div className="bg-violet-950 border border-violet-700 rounded-lg p-4 text-violet-200 text-base font-medium shadow">
              <span className="block mb-2">Features:</span>
              <ul className="list-disc list-inside space-y-1">
                <li>Session tracking with notes and focus level</li>
                <li>Real-time updates with SignalR</li>
                <li>Personal dashboard and analytics</li>
                <li>Profile management</li>
                <li>Modern, responsive UI</li>
              </ul>
            </div>
          </div>
        </div>
        {/* Tech Stack Card */}
        <div className="bg-gray-900 border-2 border-violet-700 rounded-2xl shadow-2xl p-8 flex flex-col items-center hover:scale-105 transition-transform duration-300">
          <h3 className="text-2xl font-extrabold text-violet-200 mb-4 tracking-tight">Tech Stack</h3>
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-gray-800 rounded-lg p-4 text-violet-300 font-semibold text-center shadow">React.js</div>
            <div className="bg-gray-800 rounded-lg p-4 text-violet-300 font-semibold text-center shadow">Vite</div>
            <div className="bg-gray-800 rounded-lg p-4 text-violet-300 font-semibold text-center shadow">Tailwind CSS</div>
            <div className="bg-gray-800 rounded-lg p-4 text-violet-300 font-semibold text-center shadow">.NET 9 (ASP.NET Core API)</div>
            <div className="bg-gray-800 rounded-lg p-4 text-violet-300 font-semibold text-center shadow">Entity Framework Core</div>
            <div className="bg-gray-800 rounded-lg p-4 text-violet-300 font-semibold text-center shadow">SQL Server</div>
            <div className="bg-gray-800 rounded-lg p-4 text-violet-300 font-semibold text-center shadow">SignalR</div>
            <div className="bg-gray-800 rounded-lg p-4 text-violet-300 font-semibold text-center shadow">Axios</div>
            <div className="bg-gray-800 rounded-lg p-4 text-violet-300 font-semibold text-center shadow">JWT Auth</div>
            <div className="bg-gray-800 rounded-lg p-4 text-violet-300 font-semibold text-center shadow">ESLint</div>
            <div className="bg-gray-800 rounded-lg p-4 text-violet-300 font-semibold text-center shadow">PostCSS</div>
            <div className="bg-gray-800 rounded-lg p-4 text-violet-300 font-semibold text-center shadow">GitHub Actions</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
