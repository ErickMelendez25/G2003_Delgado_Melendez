import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthCtx } from "../context/AuthContext";
import Register from "../pages/Register";

test("Formulario de registro funciona correctamente", async () => {
  const mockAuthValue = { register: jest.fn() };

  render(
    <BrowserRouter>
      <AuthCtx.Provider value={mockAuthValue}>
        <Register />
      </AuthCtx.Provider>
    </BrowserRouter>
  );

  const nameInput = screen.getByPlaceholderText(/nombre/i);
  const emailInput = screen.getByPlaceholderText(/email/i);
  const passwordInput = screen.getByPlaceholderText(/contraseña/i);
  const submitButton = screen.getByRole("button", { name: /registrarse/i });

  fireEvent.change(nameInput, { target: { value: "Erick" } });
  fireEvent.change(emailInput, { target: { value: "test@example.com" } });
  fireEvent.change(passwordInput, { target: { value: "12345678" } });
  fireEvent.click(submitButton);

  expect(mockAuthValue.register).toHaveBeenCalledWith("Erick", "test@example.com", "12345678");
});
