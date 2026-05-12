import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';
 
const AuthContext = createContext(null);// Create a React context for authentication state and actions.
 
// AuthProvider component that wraps the app and provides authentication state and functions to its children.
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
 
  // On component mount, check localStorage for existing user data to maintain login state across page refreshes.
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);
 
  // Function to handle user login. Calls the auth API, stores tokens and user info in localStorage, and updates the user state.
  async function login(email, password) {
    const data = await authApi.login({ email, password });
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }
 
  // Function to handle user registration. Calls the auth API and returns the registration result.
  async function register(email, password, full_name) {
    return authApi.register({ email, password, full_name });
  }
 
  // Function to handle user logout. Calls the auth API and clears all stored tokens and user info.
  async function logout() {
    await authApi.logout();
    localStorage.clear();
    setUser(null);
  }
 
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
 
export const useAuth = () => useContext(AuthContext);