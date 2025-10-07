# Usa Node.js
FROM node:18

# Carpeta de trabajo
WORKDIR /app

# Copiar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código
COPY . .

# Puerto de desarrollo de Vite o React
EXPOSE 5173

# Comando para iniciar el frontend
CMD ["npm", "run", "dev"]
