import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const linkClass = ({ isActive }) =>
    isActive
      ? 'bg-violet-700 text-white px-4 py-2 rounded-md text-base font-semibold shadow'
      : 'text-gray-300 hover:bg-violet-700 hover:text-white px-4 py-2 rounded-md text-base font-semibold';

  if (!user) return null;

  return (
    <nav className="bg-gray-950 border-b border-gray-900 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center h-16">
        <NavLink to="/dashboard" className="text-3xl font-extrabold text-violet-500 tracking-tight">Dev-Insight</NavLink>
        <div className="flex space-x-4 items-center">
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/sessions" className={linkClass}>Sessions</NavLink>
          <NavLink to="/profile" className={linkClass}>Profile</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact Me</NavLink>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;