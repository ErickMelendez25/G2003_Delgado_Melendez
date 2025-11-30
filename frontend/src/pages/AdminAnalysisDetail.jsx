import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminAnalysisDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [tab, setTab] = useState("original");

  useEffect(() => {
    api.get(`/admin/history/${id}`).then(res => setData(res.data));
  }, []);

  if (!data) return <p>Cargando...</p>;

  return (
    <div className="admin-dashboard-wrapper">
      <div className="admin-card">
        <h2 className="admin-title">📘 Análisis completo #{id}</h2>

        <div className="tabs">
          <button className={tab === "original" ? "active" : ""} onClick={() => setTab("original")}>Original</button>
          <button className={tab === "corrected" ? "active" : ""} onClick={() => setTab("corrected")}>Corregido</button>
        </div>

        <pre className="scroll-card">
          {tab === "original" ? data.originalText : data.correctedText}
        </pre>

        <button className="back-btn" onClick={() => navigate(-1)}>⬅ Volver</button>
      </div>
    </div>
  );
}
