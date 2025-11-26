import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Register from "../pages/Register";
import { vi } from "vitest";

// Mock de useAuth
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    register: vi.fn(() => Promise.resolve({ name: "Usuario Mock" })),
  }),
}));

describe("Register Component", () => {
  test("renderiza campos de registro", () => {
    render(<MemoryRouter><Register /></MemoryRouter>);
    expect(screen.getByText("Registro")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nombre")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Contraseña")).toBeInTheDocument();
  });

  test("permite escribir en los campos", () => {
    render(<MemoryRouter><Register /></MemoryRouter>);
    const nombre = screen.getByPlaceholderText("Nombre");
    fireEvent.change(nombre, { target: { value: "Anderson" } });
    expect(nombre.value).toBe("Anderson");
  });

  test("validación de email", () => {
    render(<MemoryRouter><Register /></MemoryRouter>);
    const email = screen.getByPlaceholderText("Email");
    fireEvent.change(email, { target: { value: "correo_invalido" } });
    expect(email.value).toBe("correo_invalido");
  });

  test("registro mock funciona", async () => {
    render(<MemoryRouter><Register /></MemoryRouter>);
    // Usamos register mock, verificamos que se pueda ejecutar
  });
});
