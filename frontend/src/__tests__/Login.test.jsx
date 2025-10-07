import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthCtx } from "../context/AuthContext";
import Login from "../pages/Login";

test("Formulario de login funciona correctamente", async () => {
  const mockAuthValue = { login: jest.fn().mockResolvedValueOnce({}) };

  render(
    <BrowserRouter>
      <AuthCtx.Provider value={mockAuthValue}>
        <Login />
      </AuthCtx.Provider>
    </BrowserRouter>
  );

  // 🔹 Seleccionamos los inputs
  const emailInput = screen.getByPlaceholderText(/email/i);
  const passwordInput = screen.getByPlaceholderText(/contraseña/i);
  const submitButton = screen.getByRole("button", { name: /entrar/i });

  // 🔹 Simulamos la interacción del usuario
  fireEvent.change(emailInput, { target: { value: "test@example.com" } });
  fireEvent.change(passwordInput, { target: { value: "12345678" } });
  fireEvent.click(submitButton);

  // 🔹 Esperamos que se llame login correctamente
  await waitFor(() =>
    expect(mockAuthValue.login).toHaveBeenCalledWith("test@example.com", "12345678")
  );
});
