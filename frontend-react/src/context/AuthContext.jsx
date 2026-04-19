// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Map backend role names to frontend role names
        let frontendRole = payload.role;
        if (payload.role === 'tenant_admin' || payload.role === 'superadmin') {
          frontendRole = 'tenant_admin';
        } else if (payload.role === 'org_admin' || payload.role === 'department_admin') {
          frontendRole = 'org_admin';
        } else if (payload.role === 'employee' || payload.role === 'user') {
          frontendRole = 'employee';
        }
        
        setUser({
          id: payload.sub || payload.user_id || payload.id,
          role: frontendRole,
          originalRole: payload.role, // Keep original for debugging
          name: payload.name,
          email: payload.email || payload.sub, // Fallback to sub if email not in token
        });
      } catch (e) {
        console.error('Invalid token:', e);
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = (accessToken, userData) => {
    localStorage.setItem('access_token', accessToken);
    setToken(accessToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token'); // if you have refresh token
    setToken(null);
    setUser(null);
  };

  // Helper to check if user has specific role
  const hasRole = (allowedRoles) => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);