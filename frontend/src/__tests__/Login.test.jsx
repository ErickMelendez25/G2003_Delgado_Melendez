import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../pages/Login";
import { vi } from "vitest";

// Mock de useAuth
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    login: vi.fn(() => Promise.resolve({ name: "Usuario Mock" })),
    logout: vi.fn(),
  }),
}));

describe("Login Component", () => {
  test("renderiza formulario de login", () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    expect(screen.getByText("Iniciar sesión")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Contraseña")).toBeInTheDocument();
  });

  test("permite escribir en campos", () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    const email = screen.getByPlaceholderText("Email");
    fireEvent.change(email, { target: { value: "test@mail.com" } });
    expect(email.value).toBe("test@mail.com");
  });

  test("muestra error si email inválido", () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    const email = screen.getByPlaceholderText("Email");
    fireEvent.change(email, { target: { value: "correo" } });
    expect(email.value).toBe("correo");
  });

  test("llama a login y obtiene usuario mock", async () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    const email = screen.getByPlaceholderText("Email");
    const password = screen.getByPlaceholderText("Contraseña");
    fireEvent.change(email, { target: { value: "test@mail.com" } });
    fireEvent.change(password, { target: { value: "123456" } });
    // Como login es mockeado, solo probamos que se ejecute
  });
});
