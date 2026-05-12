// client/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute   from './components/ProtectedRoute';
import Layout           from './components/Layout';
import Dashboard        from './pages/Dashboard';
import Transactions     from './pages/Transactions';
import Budgets          from './pages/Budgets';
import Login            from './pages/Login';
import Register         from './pages/Register';

// Main application component that sets up routing and authentication context.
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index          element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="budgets"      element={<Budgets />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}