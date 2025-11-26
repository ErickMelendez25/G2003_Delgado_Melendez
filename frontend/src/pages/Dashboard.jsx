  import React, { useState, useEffect, useRef } from "react";
  import { useAuth } from "../context/AuthContext";
  import { useNavigate } from "react-router-dom";
  import "../styles/dashboard.css";

  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const renderAnnotatedText = (text, annotations = []) => {
    if (!annotations?.length)
      return <pre className="original-text" data-testid="annotated-text">{text}</pre>;

    const sorted = [...annotations].sort((a, b) => b.original.length - a.original.length);
    let output = text;

    sorted.forEach((a) => {
      if (!a.original) return;
      const clsMap = {
        spelling: "hl-spelling",
        grammar: "hl-grammar",
        citation: "hl-citation",
        other: "hl-other",
      };
      const tooltip = `${a.type.toUpperCase()}\n💡 ${a.note}\n👉 ${a.suggestion}`;
      output = output.replace(
        new RegExp(`(${escapeRegex(a.original)})`, "gi"),
        `<mark class="annotation ${clsMap[a.type]}" data-tooltip="${tooltip}">$1</mark>`
      );
    });

    return <pre className="original-text" data-testid="annotated-text" dangerouslySetInnerHTML={{ __html: output }} />;
  };


  export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState("annotated");
    const containerRef = useRef();

    const handleLogout = async () => {
      await logout();
      navigate("/login");
    };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Selecciona un archivo antes de subirlo.");
      return;
    }

    if (!user?.token) {
      alert("Debes iniciar sesión para subir archivos.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/upload`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await res.json();
      console.log("Respuesta del servidor:", data);

      if (res.ok) {
        setAnalysis(data);
      } else {
        alert(data.error || "Error al analizar el archivo.");
      }
    } catch (err) {
      console.error("Error en handleUpload:", err);
    }

    setLoading(false);
  };



    const handleDownload = () => {
      if (!analysis?.correctedText) return alert("No hay texto corregido disponible.");
      const blob = new Blob([analysis.correctedText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "texto_corregido.txt";
      a.click();
    };

    // ====== Ajustar tooltips automáticamente ======
    useEffect(() => {
      const annotations = containerRef.current?.querySelectorAll(".annotation");
      annotations?.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.right + 320 > window.innerWidth) { // 320px = max-width tooltip
          el.setAttribute("data-tooltip-position", "left");
        } else {
          el.removeAttribute("data-tooltip-position");
        }
      });
    }, [analysis, tab]);

    return (
      <div className="dashboard-container" ref={containerRef}>
        <header className="dashboard-header">
          <div>
            <h1>📘 CampusUC — Analizador de Ensayos</h1>
            <p>Hola, <strong>{user?.name || user?.email}</strong></p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Salir</button>
        </header>

        <div className="card upload-card">
          <h3>Subir documento</h3>
          <form onSubmit={handleUpload} className="upload-form">
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              data-testid="file-input"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Analizando..." : "Subir y analizar"}
            </button>

            <button
              type="button"
              className="history-btn"
              onClick={() => navigate("/history")}
            >
              📂 Historial
            </button>

            {user?.role === "admin" && (
            <button
              type="button"
              className="admin-btn"
              onClick={() => navigate("/admin")}
            >
              🛠 Administrador de consultas
            </button>
            )}
          </form>
        </div>

        {analysis && (
          <div className="analysis-fixed">
            <div className="tabs">
              <button className={tab === "annotated" ? "active" : ""} onClick={() => setTab("annotated")}>🔍 Anotado</button>
              <button className={tab === "corrected" ? "active" : ""} onClick={() => setTab("corrected")}>✅ Corregido</button>
            </div>

            <div className="legend">
              <div><span className="legend-box hl-spelling"></span> Spelling</div>
              <div><span className="legend-box hl-grammar"></span> Grammar</div>
              <div><span className="legend-box hl-citation"></span> Citation</div>
              <div><span className="legend-box hl-other"></span> Other</div>
            </div>

            <div className="scroll-card">
              {tab === "annotated"
                ? renderAnnotatedText(analysis.originalText, analysis.annotations)
                : <pre className="corrected-text">{analysis.correctedText}</pre>}
            </div>

            <div className="download-section">
              <button onClick={handleDownload} className="download-btn">⬇️ Descargar</button>
            </div>
          </div>
        )}

        {loading && (
          <div className="loader-backdrop">
            <div className="loader"></div>
          </div>
        )}
      </div>
    );
  }
