Revisor Automático de Escritura Académica – CAMPUS UC
Sistema Web basado en Inteligencia Artificial para la Universidad Continental
📘 1. Descripción General del Proyecto

El Revisor Automático de Escritura Académica es un sistema web desarrollado como proyecto final del curso Taller de Proyectos 2 – Ingeniería de Sistemas e Informática.
El sistema permite que los estudiantes de la Universidad Continental analicen documentos académicos mediante Inteligencia Artificial, garantizando mejoras en redacción, claridad, coherencia y estilo académico.

Este sistema aplica tecnologías modernas de frontend, backend, base de datos, orquestación de automatizaciones y modelos avanzados de IA (Gemini 1.5 / 2.0).

Su arquitectura está diseñada para ser escalable, segura y de uso práctico, dirigida principalmente a estudiantes y administradores del Campus UC.

📄 2. Acceso al Informe Final del Proyecto

El informe académico completo se encuentra disponible en el siguiente enlace:

👉 Informe Final del Proyecto:
https://docs.google.com/document/d/15pwiBmSXW2h2Jdf7anmdl-GocuVFceeH/edit

🎯 3. Objetivos del Sistema
Objetivo General

Desarrollar un sistema web capaz de revisar automáticamente textos académicos mediante Inteligencia Artificial, optimizando la escritura y brindando retroalimentación inmediata a los estudiantes de la Universidad Continental.

Objetivos Específicos

- Implementar módulos de autenticación y gestión de usuarios.

- Integrar la API Gemini como motor de análisis automático.

- Desarrollar un panel administrativo con métricas y monitoreo.

- Automatizar procesos mediante flujos n8n (reportes, alertas, registros).

- Garantizar una base de datos relacional robusta para la trazabilidad de documentos.

🧠 4. Tecnologías Principales

Frontend

- React + Vite

- TailwindCSS

- Axios

- React Router DOM

Backend

- Node.js

- Express

- JWT (Autenticación)

- Multer (Subida de archivos)

- Prisma ORM

Base de Datos

- PostgreSQL

- Prisma ORM

Inteligencia Artificial

- Google Gemini 1.5 Flash / 2.0 Flash

Automatización

- n8n (envío de reportes, logs, alertas internas)

Infraestructura / DevOps

- Railway / Render (backend)

- Vercel / Netlify (frontend)

- GitHub (control de versiones)


⚙ 5. Arquitectura del Sistema

El sistema sigue una arquitectura cliente-servidor, organizada de la siguiente forma:

- Frontend (Cliente): Interfaz web donde el usuario carga textos y recibe los análisis.

- Backend (Servidor): Procesa solicitudes, valida datos y conecta con IA.

- Inteligencia Artificial: Gemini analiza el documento y genera recomendaciones.

- Base de Datos: Guarda usuarios, documentos, análisis, métricas y logs.

- n8n: Automatiza reportes y alertas al correo.

🚀 6. Instalación y Ejecución

📌 Backend:

cd backend
npm install
npm run dev

Crear archivo .env:

cd backend
npm install
npm run dev

Ejecutar migraciones:
npx prisma migrate dev

📌 Frontend:

cd frontend
npm install
npm run dev

Archivo .env:
VITE_API_URL=http://localhost:3000

📁 7. Estructura del Repositorio:

📦 Proyecto
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── hooks/
│   └── public/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── prisma/
│   │   └── utils/
│   ├── uploads/
│   └── .env
│
└── n8n/
    └── workflows.json

🔎 8. Funcionalidades del Sistema
🧑‍💻 Usuario

- Subida de documentos PDF / texto.
- Análisis automático mediante IA.
- Corrección gramatical en tiempo real.
- Historial completo de documentos analizados.
- Descarga de reportes automáticos.

👨‍💼 Administrador

- Gestión de usuarios.
- Visualización de métricas generales.
- Control de documentos y actividad.
- Monitoreo del sistema y logs.

🔄 Automatización n8n

- Envío automático de reportes al correo.
- Registro de logs internos.
- Alertas sobre errores o fallos.

🗄 9. Modelo de Base de Datos (PostgreSQL)

Tablas principales:

- users
- roles
- documents
- analysis
- activity_logs

Diseñadas para garantizar seguridad, normalización y trazabilidad.

🧪 10. Análisis con IA

- La integración con Gemini permite:
- Identificación de errores gramaticales
- Mejora de estilo y redacción
- Evaluación de estructura académica
- Ranking de claridad
- Recomendaciones automáticas
- Resumen del contenido

📊 11. Estado Actual del Proyecto

El sistema se encuentra implementado al 80%, con:

✔ Autenticación
✔ Análisis IA funcional
✔ Subida de documentos
✔ Base de datos finalizada
✔ Reportes automáticos n8n
✔ Panel administrador funcional
✔ Métricas iniciales
✔ Arquitectura completa
✔ Informe final publicado


5 🛠️ Configuración y Despliegue
Esta sección detalla los pasos para poner en marcha la aplicación, tanto de forma local (para desarrollo) como mediante la contenerización (para despliegue en producción).

5.1. Requisitos Previos
Asegúrate de tener instalados los siguientes softwares en tu sistema:

Node.js (v20 o superior) y npm (para desarrollo local).

PostgreSQL (para desarrollo local sin Docker).

Docker y Docker Compose (para despliegue contenerizado).

Git (para clonar el repositorio).

5.2. Configuración de Variables de Entorno
Ambos modos de ejecución (local y Dockerizado) requieren la configuración de claves de acceso.

1. Copia el archivo de ejemplo:
    cp .env.example .env

2. Edita el archivo .env en la raíz del proyecto, configurando las siguientes variables:

Variable	Descripción	Ejemplo
GEMINI_API_KEY	Clave de acceso a la API de Google Gemini (CRUCIAL).	AIzaSy...XYZ123
DB_USER	Usuario de la base de datos PostgreSQL.	revisor_user
DB_PASSWORD	Contraseña del usuario de la base de datos.	S3cur3P4ss
DB_NAME	Nombre de la base de datos.	revisor_academico_db
SERVER_PORT	Puerto en el que correrá la API de Node.js.	4000

5.3. Opción A: Despliegue Rápido con Docker Compose (Recomendado)
Este método es el más robusto para la evaluación, ya que garantiza que el entorno (Frontend, Backend y PostgreSQL) sea idéntico en cualquier máquina.

Construir las Imágenes: El comando creará las imágenes de los contenedores para el Frontend (servido con Nginx) y el Backend (Node.js).
docker compose build

Ejecutar el Sistema: Este comando levantará los tres servicios en segundo plano (-d) y creará la red interna.
docker compose up -d

Verificación:
- Comprueba que los contenedores estén activos:
    docker compose ps
- Accede a la aplicación en tu navegador: http://localhost:3000

Detener y Limpiar (Opcional):
docker compose down # Detiene y elimina los contenedores y la red

5.4. Opción B: Ejecución Local (Para Desarrollo)
Este método requiere la instalación local de dependencias en cada módulo.

1. Instalar Dependencias: Navega a las carpetas backend y frontend e instala sus dependencias respectivas:
    cd backend && npm install && cd ..
    cd frontend && npm install && cd ..

2. Iniciar Base de Datos: Asegúrate de que tu servicio local de PostgreSQL esté corriendo.
3. Iniciar Backend (API):
    cd backend
    npm run dev  # O el comando que uses para iniciar tu servidor Node.js

La API estará disponible en http://localhost:4000.

4. Iniciar Frontend (React):
    cd frontend
    npm start # O el comando que uses para iniciar tu aplicación React
La interfaz web estará disponible en http://localhost:3000.

6. 🗺️ Diagramas de Arquitectura
Para facilitar la comprensión del diseño del sistema, se adjuntan los diagramas técnicos que detallan la estructura de los componentes y el flujo de los datos.

6.1. Diagrama de Arquitectura (Alto Nivel)
Este diagrama muestra la separación de las capas (Frontend, Backend, Persistencia) y su relación clave con el servicio externo de Inteligencia Artificial (Gemini). Se resalta que el Backend (Node.js) actúa como un proxy seguro y un coordinador de la lógica de negocio.

6.2. Diagrama de Flujo de Datos (Proceso de Análisis)
El siguiente diagrama detalla la secuencia de eventos desde que un usuario sube un documento hasta que recibe el reporte de corrección.

👥 12. Integrantes del Proyecto

- Erick Anderson Meléndez Valenzuela
- Luis Fernando Delgado Camarena

Docente:

- Daniel Gamarra Moreno

📜 13. Licencia

Proyecto académico desarrollado para el curso Taller de Proyectos 2 – Universidad Continental.
Puede ser reutilizado con fines educativos.