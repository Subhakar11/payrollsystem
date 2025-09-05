
import React, { createContext, useContext, useState } from 'react';
import jwtDecode from 'jwt-decode';
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(()=>{
    const token = localStorage.getItem('token'); if (!token) return null;
    try { return jwtDecode(token); } catch { return null; }
  });
  const login = (token) => {
    localStorage.setItem('token', token);
    try { setUser(jwtDecode(token)); } catch { setUser(null); }
  };
  const logout = () => { localStorage.removeItem('token'); setUser(null); };
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);
