
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
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-slate-100 flex flex-col">
        <div className="px-6 py-5 border-b border-slate-100">
          <span className="text-lg font-bold text-indigo-600">FinTrack</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                 ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`
              }>
              <span>{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-slate-100 text-xs text-slate-400">
          <p className="truncate">{user?.email}</p>
          <button onClick={logout}
            className="mt-2 text-red-400 hover:text-red-600 transition-colors">
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}