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

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Por favor selecciona un archivo primero.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Respuesta del servidor:", data);

      // Guardamos el resultado en análisis
      setAnalysis({
        spelling: data.matches?.filter(m => m.rule.issueType === "misspelling").length || 0,
        grammar: data.matches?.filter(m => m.rule.issueType === "grammar").length || 0,
        suggestions: data.matches?.map(m => m.message) || []
      });
    } catch (err) {
      console.error("Error al subir:", err);
      alert("Error al analizar el archivo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">Salir</button>
      </header>

      <div className="welcome-card">
        <h2>👋 Hola, {user?.name || 'Usuario'}</h2>
        <p>Aquí puedes subir tu ensayo y recibir un análisis automático.</p>
      </div>

      <div className="card card-purple">
        <h3>📄 Subir Ensayo</h3>
        <form onSubmit={handleUpload} className="upload-form">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Analizando..." : "Subir y Analizar"}
          </button>
        </form>
      </div>

      {analysis && (
        <div className="card card-green">
          <h3>📊 Resultados del Análisis</h3>
          <p><strong>Ortografía:</strong> {analysis.spelling}</p>
          <p><strong>Gramática:</strong> {analysis.grammar}</p>
          <p><strong>Sugerencias:</strong></p>
          <ul>
            {analysis.suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
