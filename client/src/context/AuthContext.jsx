import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api, { setUnauthorizedHandler } from '../api.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // While a saved token is being checked we don't know yet whether the user is logged in.
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('token')));

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);
    if (!localStorage.getItem('token')) return;
    api
      .get('/auth/profile')
      .then((res) => setUser(res.data))
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, [logout]);

  const authenticate = async (path, body) => {
    const { data } = await api.post(path, body);
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const login = (email, password) => authenticate('/auth/login', { email, password });
  const register = (details) => authenticate('/auth/register', details);

  const updateProfile = async (details) => {
    const { data } = await api.put('/auth/profile', details);
    setUser(data);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
