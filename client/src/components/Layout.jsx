
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Define the navigation links for the sidebar, each with a path, label, and icon.
const links = [
  { to: '/',             label: 'Dashboard',    icon: '📊' },
  { to: '/transactions', label: 'Transactions', icon: '💳' },
  { to: '/budgets',      label: 'Budgets',      icon: '🎯' },
];

// Layout component that defines the overall structure of the app, including the sidebar and main content area.
export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-blue-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              💰
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">FinTrack</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                 ${isActive 
                   ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600' 
                   : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'}`
              }>
              <span className="text-lg">{l.icon}</span>
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="px-4 py-4 border-t border-slate-100 bg-slate-50">
          <div className="px-3 py-2 rounded-lg bg-white border border-slate-200">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Logged in as</p>
            <p className="text-sm font-semibold text-slate-800 truncate mt-1">{user?.email || 'User'}</p>
          </div>
          <button onClick={logout}
            className="w-full mt-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 border border-red-200">
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <div className="min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
}