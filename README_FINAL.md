# Revisor Automático de Escritura Académica

Proyecto: Revisor Automático de Escritura Académica  
Ubicación: Huancayo, Perú  
Autores: Erick Meléndez, Luis Fernando Delgado  
Repositorio: G2003_Delgado_Melendez  
Gestión del Proyecto: [Jira Cloud - PRC Board](https://continental-team-w91ojuoe.atlassian.net/jira/software/c/projects/PRC/boards/4/backlog)

---

## Descripción General
El proyecto Revisor Automático de Escritura Académica** busca asistir a estudiantes y docentes universitarios mediante el uso de técnicas de Procesamiento de Lenguaje Natural (NLP) y modelos de Inteligencia Artificial, para revisar textos académicos en español.  
El sistema detecta errores gramaticales, ortográficos, de redacción y citas, y ofrece retroalimentación automatizada, fomentando la mejora continua en la escritura académica.

Desarrollado bajo la arquitectura MERN (MongoDB, Express, React, Node.js) e integrando OpenAI y HuggingFace para el análisis de texto, además de n8n para la automatización de flujos y envío de reportes.

---

## Estado del Proyecto (Cuantificado)

| Indicador                   | Métrica                             |Estado|
| Periodo del informe         | 25/08/2025 – 15/09/2025             |  —   |
| Requisitos completados      | 15 de 25 historias de usuario (60%) | 🟢  |
| Porcentaje de avance total  | 62.5%                               | 🟢  |
| **Cumplimiento del cronograma| 2 de 5 sprints completados (40%)   | 🟡  |
| Defectos encontrados        | 5 reportados / 4 corregidos (80%)   | 🟢  |
| Riesgos activos             | 3 de 7 (43%)                        | 🟡  |
| Presupuesto ejecutado       | S/ 350 de S/ 1200 (29%)             | 🟢  |
| Satisfacción del equipo     | 8/10                                | 🟢  |

---

##  Arquitectura (Walking Skeleton MERN)

```
[Frontend React] ⇄ [Express API] ⇄ [MongoDB]
            ↕
          [n8n Flows]
```

**Estructura del proyecto:**
```
/frontend -> React + Vite
/backend  -> Node.js + Express
/database -> MongoDB (Atlas)
/automation -> n8n (automatización de flujos)
```

---

##  Progreso por Sprint

| Sprint       | Objetivo                          | % Avance | Historias Completadas |
| *Sprint 1*   | Walking Skeleton + Login + Upload | 100%     | 4                     |
| *Sprint 2*   | Notificaciones + Claridad + Citas | 90%      | 3                     |
| *Sprint 3*   | Roles + Plagio + Historial        | 75%      | 3                     |
| *Sprint 4*   | Integración IA + Automatización   | 60%      | 2                     |
| *Sprint 5*   | Estadísticas + UI Final           | 40%      | 1                     |

---

##  Riesgos y Estrategias (Cuantificado y Categorizado)

| ID | Riesgo                                   | Categoría     | Probabilidad     | Impacto     | Puntuación | Estado      |Estrategia                                 
| R1 | Fallos en conexión con API de OpenAI     | Técnico       |       Media      |     Alta    |     4.5    |  ✅ Cerrado | Configurar fallback con HuggingFace|
| R2 | Hosting gratuito con baja concurrencia   | Recursos      |       Alta       |    Media    |     6.0    | 🟡 En curso | Migrar a VPS económico                   |
| R3 | Falta de métricas de calidad académica   | Calidad       |       Media      |     Alta    |     5.5    |  🟡 Activo  | Establecer métricas de precisión y recall|
| R4 | Sobrecarga de tareas para integrar n8n   | Cronograma    |       Media      |    Media    |     4.0    |  🟡 Activo  | Reorganizar backlog y priorizar tareas críticas|
| R5 | Riesgo de pérdida de variables de entorno| Seguridad     |       Baja       |     Alta    |     3.0    | 🟢 Mitigado | Incluir `.env` en `.gitignore`|


Promedio de riesgo general: 4.6 / 10 (Riesgo moderado)

---

##  Instalación y Ejecución

### 1️ Clonar el repositorio
```bash
git clone https://github.com/ErickMelendez25/G2003_Delgado_Melendez/
```

### Instalar dependencias
```bash
cd backend && npm install
cd ../frontend && npm install
```

### Configurar variables de entorno

#### Backend (.env)
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/revisor
JWT_SECRET=tu_secreto_jwt
OPENAI_API_KEY=sk-xxxx
HUGGINGFACE_API_KEY=hf_xxx
NODE_ENV=development
```

#### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:4000/api
```

### Ejecutar proyecto
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

---

## Buenas Prácticas del Repositorio

- No subir node_modules/
- Documentar siempre en README.md
- Usar ramas `feature/` para nuevas funciones
- Mantener código limpio y versionado
- Definición de Hecho (DoD) aplicada en cada sprint



## Herramientas y Tecnologías
- Frontend: React + Vite + TailwindCSS  
- Backend: Node.js + Express.js  
- Base de Datos: MongoDB Atlas  
- Automatización: n8n  
- IA / NLP: OpenAI API + HuggingFace Transformers  
- Gestión: Jira Cloud, GitHub Projects



## Próximos Avances
- Integración completa de IA con métricas de precisión.  
- Implementar panel de estadísticas de uso (Sprint 5).  
- Refinar interfaz visual y dashboard de usuario.  
- Desplegar MVP en entorno público (Render / Vercel).



## Contacto
- Erick Meléndez – correo institucional  
- Luis Fernando Delgado – correo institucional  



## Licencia
Proyecto bajo licencia MIT.  
Desarrollado como parte del curso Taller de Proyectos II – Ingeniería de Sistemas.
