import React, { useEffect, useState, useRef } from "react";
import { api } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/historyDetail.css";

// ====== Función para escapar regex ======
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ====== Renderizar texto ANOTADO ======
const renderAnnotatedText = (text, annotations = []) => {
  if (!annotations?.length)
    return <pre className="original-text">{text}</pre>;

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

  return (
    <pre
      className="original-text"
      dangerouslySetInnerHTML={{ __html: output }}
    />
  );
};

export default function HistoryDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("annotated");
  const navigate = useNavigate();
  const ref = useRef();

  useEffect(() => {
    api.get(`/history/${id}`).then((res) => {
        let fixed = { ...res.data };

        // Forzar que annotations sea array SIEMPRE
        if (typeof fixed.annotations === "string") {
            try {
            fixed.annotations = JSON.parse(fixed.annotations);
            } catch {
            fixed.annotations = [];
            }
        }

        setData(fixed);
        });

  }, []);

  if (!data) return <p className="loading">Cargando...</p>;

  return (
    <div className="history-detail-wrapper">
      <div className="history-card" ref={ref}>
        <h2 className="history-title">📘 Análisis del archivo #{id}</h2>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={tab === "annotated" ? "active" : ""}
            onClick={() => setTab("annotated")}
          >
            🔍 Anotado
          </button>
          <button
            className={tab === "corrected" ? "active" : ""}
            onClick={() => setTab("corrected")}
          >
            ✅ Corregido
          </button>
        </div>

        {/* Leyenda */}
        <div className="legend">
          <div><span className="legend-box hl-spelling"></span> Spelling</div>
          <div><span className="legend-box hl-grammar"></span> Grammar</div>
          <div><span className="legend-box hl-citation"></span> Citation</div>
          <div><span className="legend-box hl-other"></span> Other</div>
        </div>

        {/* Contenido */}
        <div className="scroll-card">
          {tab === "annotated"
            ? renderAnnotatedText(data.originalText, data.annotations)
            : <pre className="corrected-text">{data.correctedText}</pre>}
        </div>

        <button className="back-btn" onClick={() => navigate(-1)}>
          ⬅ Volver
        </button>
      </div>
    </div>
  );
}
