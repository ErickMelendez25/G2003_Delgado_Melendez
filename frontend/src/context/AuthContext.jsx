import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { api } from '../services/api';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔑 tiempo de inactividad permitido (1 minuto = 60000 ms)
  const inactivityTime = 60000;
  const timerRef = useRef(null);

  // 🚀 obtener usuario al cargar
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 👇 función de logout
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // incluso si falla en backend, limpiamos sesión en frontend
    }
    setUser(null);
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    setUser(data);
    return data;
  };

  // 🔥 manejar inactividad
  const resetTimer = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      logout();
      alert('⚠️ Sesión cerrada por inactividad');
    }, inactivityTime);
  };

  useEffect(() => {
    if (user) {
      const events = ['mousemove', 'keydown', 'click', 'scroll'];

      events.forEach(event =>
        window.addEventListener(event, resetTimer)
      );

      resetTimer(); // inicia temporizador cuando hay sesión activa

      return () => {
        events.forEach(event =>
          window.removeEventListener(event, resetTimer)
        );
        clearTimeout(timerRef.current);
      };
    }
  }, [user]);

    return (
    <AuthCtx.Provider value={{ user, loading, login, register, logout }}>
        {console.log("AuthProvider montado, user:", user)}
        {children}
    </AuthCtx.Provider>
    );
}
