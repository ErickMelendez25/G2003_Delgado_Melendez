import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { api, setAuthToken } from '../services/api';

export const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const inactivityTime = 24 * 60 * 60 * 1000;
  const timerRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
          setAuthToken(token);

          const { data } = await api.get('/auth/profile');


          const userData = {
            ...data.user,
            token,
          };

          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch (err) {
        console.warn("Autologin falló:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // LOGIN
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });

    const userData = {
      ...data.user,
      token: data.token,
    };

    setAuthToken(data.token);
    setUser(userData);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", data.token);

    return userData;
  };

  // REGISTER
  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });

    const userData = {
      ...data.user,
      token: data.token,
    };

    setAuthToken(data.token);
    setUser(userData);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", data.token);

    return userData;
  };

  // LOGOUT
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn("Logout backend falló:", err);
    } finally {
      setUser(null);
      setAuthToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");

    }
  };

  // AUTO LOGOUT POR INACTIVIDAD
  const resetTimer = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      logout();
      alert("⚠️ Sesión cerrada por inactividad");
    }, inactivityTime);
  };

  useEffect(() => {
    if (user) {
      const events = ["mousemove", "keydown", "click", "scroll"];
      events.forEach((ev) => window.addEventListener(ev, resetTimer));
      resetTimer();
      return () => {
        events.forEach((ev) => window.removeEventListener(ev, resetTimer));
        clearTimeout(timerRef.current);
      };
    }
  }, [user]);

  return (
    <AuthCtx.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
