import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../styles/dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState("txt");

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Selecciona un archivo.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Respuesta:", data);
      setAnalysis(data);
    } catch (err) {
      console.error("Error al subir:", err);
      alert("Error al analizar el archivo.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!analysis?.correctedText) return;
    const blob = new Blob([analysis.correctedText], {
      type:
        downloadFormat === "txt"
          ? "text/plain"
          : downloadFormat === "docx"
          ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          : "application/pdf",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `texto_corregido.${downloadFormat}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard — 📚 CampusUC — Análisis de Ensayos</h1>

        <button onClick={handleLogout} className="logout-btn">Salir</button>
      </header>

      <div className="card">
        <h3>📄 Subir ensayo</h3>
        <form onSubmit={handleUpload}>
          <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={(e) => setFile(e.target.files[0])} />
          <button type="submit" disabled={loading}>
            {loading ? "Analizando..." : "Subir y analizar"}
          </button>
        </form>
      </div>

      {analysis && (
        <div className="analysis-container">
          <div className="card results-card">
            <h3>📊 Resultado del análisis</h3>
            <textarea
              value={analysis.correctedText}
              readOnly
              className="corrected-text"
            />
            <div className="download-section">
              <label>Formato de descarga: </label>
              <select
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value)}
              >
                <option value="txt">.txt</option>
                <option value="docx">.docx</option>
                <option value="pdf">.pdf</option>
              </select>
              <button onClick={handleDownload} className="download-btn">
                ⬇️ Descargar archivo corregido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
