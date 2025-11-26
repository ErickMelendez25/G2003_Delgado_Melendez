// src/__tests__/App.test.jsx
import { render, screen } from "@testing-library/react";
import App from "../App";

describe("App", () => {
  test("se renderiza correctamente", () => {
    render(<App />);
    // Ajustamos el test al contenido que sí aparece
    expect(screen.getByText(/Iniciar sesión/i)).toBeInTheDocument();
  });
});
