import { render, act } from "@testing-library/react";
import AuthProvider, { AuthCtx } from "../context/AuthContext";
import { vi } from "vitest";

// Mock completo del api
vi.mock("../services/api", () => {
  return {
    api: {
      defaults: { headers: { common: {} } },
      post: vi.fn((url) => {
        if (url === "/auth/login") {
          return Promise.resolve({
            data: { token: "123", user: { name: "Usuario Mock" } },
          });
        }
      }),
      get: vi.fn(),
    },
    setAuthToken: (token) => {
      if (token) {
        localStorage.setItem("token", token); // ✅ ahora sí guarda
      } else {
        localStorage.removeItem("token");
      }
    },
  };
});

describe("AuthContext", () => {
  test("user inicial null", () => {
    let contextValue;
    render(
      <AuthProvider>
        <AuthCtx.Consumer>
          {(value) => { contextValue = value; return null; }}
        </AuthCtx.Consumer>
      </AuthProvider>
    );
    expect(contextValue.user).toBeNull();
  });

  test("login mock funciona", async () => {
    let contextValue;
    render(
      <AuthProvider>
        <AuthCtx.Consumer>
          {(value) => { contextValue = value; return null; }}
        </AuthCtx.Consumer>
      </AuthProvider>
    );

    await act(async () => {
      await contextValue.login("test@mail.com", "123456");
    });

    expect(contextValue.user.name).toBe("Usuario Mock");
  });

  test("logout limpia user", async () => {
    let contextValue;
    render(
      <AuthProvider>
        <AuthCtx.Consumer>
          {(value) => { contextValue = value; return null; }}
        </AuthCtx.Consumer>
      </AuthProvider>
    );

    await act(async () => {
      await contextValue.login("test@mail.com", "123456");
      await contextValue.logout();
    });

    expect(contextValue.user).toBeNull();
  });

  test("token se guarda en localStorage", async () => {
    localStorage.clear();
    let contextValue;
    render(
      <AuthProvider>
        <AuthCtx.Consumer>
          {(value) => { contextValue = value; return null; }}
        </AuthCtx.Consumer>
      </AuthProvider>
    );

    await act(async () => {
      await contextValue.login("test@mail.com", "123456");
    });

    expect(localStorage.getItem("token")).toBe("123");
  });
});
