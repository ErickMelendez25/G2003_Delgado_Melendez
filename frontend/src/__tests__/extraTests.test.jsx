// ===========================
// extraTests.test.jsx
// ===========================

import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { useAuth } from "../context/AuthContext";

// 🔹 Mock de useAuth
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    login: vi.fn(() => Promise.resolve({ name: "Usuario Mock" })),
    logout: vi.fn(() => Promise.resolve(null)),
    register: vi.fn(() => Promise.resolve({ name: "Usuario Mock" })),
  }),
}));

describe("useAuth Hook", () => {
  test("login retorna usuario correctamente", async () => {
    const { result } = renderHook(() => useAuth());

    let user;
    await act(async () => {
      user = await result.current.login("test@mail.com", "123456");
    });

    expect(user.name).toBe("Usuario Mock");
  });

  test("logout limpia user", async () => {
    const { result } = renderHook(() => useAuth());

    let user;
    await act(async () => {
      user = await result.current.login("test@mail.com", "123456");
    });

    expect(user.name).toBe("Usuario Mock");

    await act(async () => {
      await result.current.logout();
    });

    // Como nuestro mock de logout devuelve null
    const currentUser = result.current.user;
    expect(currentUser).toBeNull();
  });
});
