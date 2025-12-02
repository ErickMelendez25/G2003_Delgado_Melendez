import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/admin/history").then(res => setRecords(res.data));
  }, []);

  return (
    <div className="page-content">   {/* ⭐ AQUI EL FIX */}

      <div className="admin-dashboard-wrapper">

        <div className="admin-card">

          <div className="admin-header">
            <h2 className="admin-title">
              📊 Historial global de documentos (Admin)
            </h2>
            <button className="back-btn-top" onClick={() => navigate("/dashboard")}>
              ⬅ Volver
            </button>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Archivo</th>
                  <th>Usuario</th>
                  <th>Fecha</th>
                  <th>Ver</th>
                </tr>
              </thead>

              <tbody>
                {records.map(r => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.file_name}</td>
                    <td>{r.user_email}</td>
                    <td>{new Date(r.uploaded_at).toLocaleString()}</td>
                    <td>
                      <button onClick={() => navigate(`/admin/history/${r.id}`)}>
                        🔎 Abrir
                      </button>

                      <button 
                        style={{ marginLeft: "8px", background: "red", color: "white" }}
                        onClick={async () => {
                          if (window.confirm("¿Seguro que quieres eliminar este registro?")) {
                            await api.delete(`/admin/history/${r.id}`);
                            setRecords(records.filter(rec => rec.id !== r.id)); // quita del frontend
                          }
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                      <button 
                        style={{ marginLeft: "8px", background: "orange", color: "white" }}
                        onClick={async () => {
                          const newName = prompt("Nuevo nombre de archivo:", r.file_name);
                          if (newName) {
                            await api.put(`/admin/history/${r.id}`, { file_name: newName });
                            setRecords(records.map(rec => rec.id === r.id ? { ...rec, file_name: newName } : rec));
                          }
                        }}
                      >
                        ✏️ Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </div>
      </div>

    </div>
  );
}
