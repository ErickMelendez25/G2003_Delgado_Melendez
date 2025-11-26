// pages/History.jsx
import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/history.css";

export default function History() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/history").then(res => setItems(res.data));
  }, []);

  return (
    <div className="history-wrapper">
      <div className="history-card">
        <h2 className="history-title">📂 Historial de Análisis</h2>

        <table className="history-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Archivo</th>
              <th>Fecha</th>
              <th>Ver</th>
            </tr>
          </thead>
          <tbody>
            {items.map(h => (
              <tr key={h.id}>
                <td>{h.id}</td>
                <td>{h.file_name}</td>
                <td>{new Date(h.uploaded_at).toLocaleString()}</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => navigate(`/history/${h.id}`)}
                  >
                    📖 Abrir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ⬅ Volver
        </button>
      </div>
    </div>
  );
}
