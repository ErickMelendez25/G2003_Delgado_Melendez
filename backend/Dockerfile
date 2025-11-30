# 🏗️ Etapa base: usar Node.js oficial
FROM node:18

# 📁 Crear carpeta de trabajo dentro del contenedor
WORKDIR /app

# 📦 Copiar package.json y package-lock.json primero (mejor cache)
COPY package*.json ./

# 🔧 Instalar dependencias
RUN npm install

# 📂 Copiar el resto del proyecto
COPY . .

# 🌍 Exponer el puerto (por defecto 4000 en tu server.js)
EXPOSE 4000

# ⚙️ Comando para arrancar tu servidor
CMD ["node", "server.js"]
