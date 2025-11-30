import { vi } from "vitest";
import React from "react";

// ✅ Creamos el contexto simulado
export const AuthContext = React.createContext();

// ✅ Hook simulado
export const useAuth = () => ({
  user: { name: "Usuario Mock" },
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn(),
});
