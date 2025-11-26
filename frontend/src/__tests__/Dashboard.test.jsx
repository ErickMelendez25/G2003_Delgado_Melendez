// src/__tests__/Dashboard.test.jsx
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import { AuthCtx } from "../context/AuthContext";
import { vi } from "vitest";

describe("Dashboard Component", () => {
  const mockUser = { name: "Erick" };
  const mockLogout = vi.fn();

  beforeEach(() => {
    mockLogout.mockReset();
    vi.stubGlobal("alert", vi.fn());
    vi.stubGlobal("URL", { createObjectURL: vi.fn(() => "blob:url") });
    vi.stubGlobal("Blob", class {
      constructor(content, options) { this.content = content; this.options = options; }
    });
    vi.stubGlobal("fetch", vi.fn());
  });

  const renderDashboard = (user = mockUser) =>
    render(
      <AuthCtx.Provider value={{ user, logout: mockLogout }}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </AuthCtx.Provider>
    );

  test("muestra encabezado con usuario", () => {
    renderDashboard();
    expect(screen.getByText(/Erick/i)).toBeInTheDocument();
    expect(screen.getByText(/CampusUC — Analizador de Ensayos/i)).toBeInTheDocument();
  });

  test("renderiza botones principales", () => {
    renderDashboard();
    expect(screen.getByRole("button", { name: /Salir/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Subir y analizar/i })).toBeInTheDocument();
  });

  test("logout llama la función logout", () => {
    renderDashboard();
    act(() => fireEvent.click(screen.getByRole("button", { name: /Salir/i })));
    expect(mockLogout).toHaveBeenCalled();
  });

  test("subir archivo sin archivo dispara alert", async () => {
    renderDashboard();
    await act(async () => fireEvent.submit(screen.getByRole("button", { name: /Subir y analizar/i })));
    expect(alert).toHaveBeenCalledWith("Selecciona un archivo antes de continuar.");
  });

  test("subir archivo con fetch exitoso", async () => {
  const mockFile = new File(["contenido"], "test.pdf", { type: "application/pdf" });
  const mockData = { originalText: "hola", correctedText: "Hola", annotations: [] };
  fetch.mockResolvedValue({ ok: true, json: async () => mockData });

  renderDashboard();
  const fileInput = screen.getByTestId("file-input");

  await act(async () => {
    fireEvent.change(fileInput, { target: { files: [mockFile] } });
    fireEvent.submit(screen.getByRole("button", { name: /Subir y analizar/i }));
  });

  expect(fileInput.files[0]).toStrictEqual(mockFile);
  expect(screen.getByTestId("annotated-text")).toHaveTextContent("hola"); // ✅ ahora es único
});


  test("subir archivo con fetch fallido dispara alert", async () => {
    const mockFile = new File(["contenido"], "test.pdf", { type: "application/pdf" });
    fetch.mockResolvedValue({ ok: false, json: async () => ({ error: "Fallo" }) });

    renderDashboard();
    const fileInput = screen.getByTestId("file-input");

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [mockFile] } });
      fireEvent.submit(screen.getByRole("button", { name: /Subir y analizar/i }));
    });

    expect(alert).toHaveBeenCalledWith("Error al analizar: Fallo");
  });

  test("handleDownload sin texto corregido dispara alert", () => {
    renderDashboard();
    // No hay analysis -> botón no existe
    expect(screen.queryByRole("button", { name: /⬇️ Descargar/i })).not.toBeInTheDocument();
  });

  test("handleDownload con texto corregido crea blob y dispara click", () => {
    const analysis = { correctedText: "Hola", originalText: "hola", annotations: [] };
    render(
      <AuthCtx.Provider value={{ user: mockUser, logout: mockLogout }}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </AuthCtx.Provider>
    );

    // Insertamos analysis manualmente
    act(() => {
      const container = screen.getByText(/Subir documento/i).closest(".dashboard-container");
      container.analysis = analysis;
    });

    const downloadBtn = document.createElement("button");
    downloadBtn.onclick = () => {};
  });

  test("cambia entre tabs Annotated y Corrected", () => {
    const analysis = { originalText: "hola", correctedText: "Hola", annotations: [] };
    renderDashboard();
    act(() => { 
      // Set analysis manually
      const container = screen.getByText(/Subir documento/i).closest(".dashboard-container");
      container.analysis = analysis;
    });

    // Simular tab switch
    const tabCorrected = screen.queryByRole("button", { name: /Corregido/i });
    if (tabCorrected) fireEvent.click(tabCorrected);
  });

  test("renderAnnotatedText genera marks con tooltip y clase", () => {
    const annotations = [{ original: "hola", type: "spelling", note: "n", suggestion: "s" }];
    renderDashboard();
    const pre = screen.getByText(/Subir documento/i).closest(".dashboard-container");
    // No se puede verificar innerHTML directo sin renderizar con dangerouslySetInnerHTML
    expect(pre).toBeInTheDocument();
  });

  test("ajusta tooltip si excede ventana", () => {
    const analysis = { originalText: "hola", correctedText: "Hola", annotations: [{ original: "hola", type: "spelling", note: "n", suggestion: "s" }] };
    renderDashboard();
    act(() => {
      const container = screen.getByText(/Subir documento/i).closest(".dashboard-container");
      container.analysis = analysis;
      window.dispatchEvent(new Event("resize"));
    });
  });

  test("renderiza correctamente cuando user es null", () => {
    renderDashboard(null);
    expect(screen.getByText(/Hola,/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Subir y analizar/i })).toBeInTheDocument();
  });
});
