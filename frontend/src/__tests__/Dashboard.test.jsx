import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthCtx } from "../context/AuthContext";
import Dashboard from "../pages/Dashboard";
import "@testing-library/jest-dom";

test("Muestra el dashboard correctamente con usuario autenticado", () => {
  const mockAuthValue = { user: { name: "Test User", email: "test@example.com" }, logout: jest.fn() };

  render(
    <MemoryRouter>
      <AuthCtx.Provider value={mockAuthValue}>
        <Dashboard />
      </AuthCtx.Provider>
    </MemoryRouter>
  );

  expect(screen.getByText(/CampusUC/i)).toBeInTheDocument(); // usa texto real del h1
  expect(screen.getByText(/Subir ensayo/i)).toBeInTheDocument();
});
