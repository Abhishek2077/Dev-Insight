import { NavLink } from 'react-router-dom';

function PublicNavbar() {
  const linkClass = ({ isActive }) =>
    isActive
      ? 'bg-accent text-white px-6 py-2 rounded-xl text-lg font-bold shadow-lg transition drop-shadow-lg'
      : 'text-white hover:bg-accent hover:text-white px-6 py-2 rounded-xl text-lg font-bold transition drop-shadow-lg';

  return (
    <nav className="bg-gray-950 border-b border-gray-900 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center h-20">
        <NavLink to="/" className="text-4xl font-extrabold tracking-tight" style={{ color: '#6366f1', letterSpacing: '0.05em' }}>Dev-Insight</NavLink>
        <div className="flex space-x-4 items-center">
          <NavLink to="/login" className={linkClass}>Login</NavLink>
          <NavLink to="/register" className={linkClass}>Register</NavLink>
        </div>
      </div>
    </nav>
  );
}
export default PublicNavbar;
