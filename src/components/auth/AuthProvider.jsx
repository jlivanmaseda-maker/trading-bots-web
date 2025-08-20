import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar autenticación al cargar
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const userData = localStorage.getItem('admin_user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    // Simulación de autenticación (en producción sería una API real)
    const validCredentials = [
      { username: 'admin', password: 'TradingBots2025!', role: 'admin', name: 'Administrador' },
      { username: 'manager', password: 'Manager2025!', role: 'manager', name: 'Gestor' }
    ];

    const user = validCredentials.find(
      cred => cred.username === username && cred.password === password
    );

    if (user) {
      const token = btoa(`${username}:${Date.now()}`); // Token simple
      const userData = {
        username: user.username,
        name: user.name,
        role: user.role,
        loginTime: new Date().toISOString()
      };

      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      
      // Log de actividad
      logActivity('login', `Usuario ${user.name} inició sesión`);
      
      return { success: true };
    } else {
      return { success: false, error: 'Credenciales inválidas' };
    }
  };

  const logout = () => {
    if (user) {
      logActivity('logout', `Usuario ${user.name} cerró sesión`);
    }
    
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const logActivity = (action, description) => {
    const logs = JSON.parse(localStorage.getItem('admin_logs') || '[]');
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      user: user?.name || 'Sistema',
      action,
      description,
      ip: 'localhost' // En producción sería la IP real
    };
    
    logs.unshift(newLog);
    // Mantener solo los últimos 100 logs
    if (logs.length > 100) {
      logs.splice(100);
    }
    
    localStorage.setItem('admin_logs', JSON.stringify(logs));
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    logActivity
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

