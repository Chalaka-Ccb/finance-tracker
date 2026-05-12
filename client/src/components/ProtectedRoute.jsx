
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Component that protects routes by checking authentication state. 
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center text-slate-400">Loading…</div>;
  if (!user)   return <Navigate to="/login" replace />;

  return children;
}