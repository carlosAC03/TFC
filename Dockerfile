# Usa una imagen oficial de Node.js
FROM node:18

# Crea el directorio de trabajo
WORKDIR /app

# Copia los archivos del backend
COPY backend/package*.json ./
RUN npm install

COPY backend/ ./backend
COPY server.js .

# Expone el puerto
EXPOSE 4000

# Comando para ejecutar el servidor
CMD ["node", "server.js"]
