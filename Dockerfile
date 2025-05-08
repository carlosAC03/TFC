# Usa una imagen oficial de Node.js
FROM node:18

# Crea el directorio de trabajo
WORKDIR /app

# Copia los archivos del backend
COPY backend/package*.json ./
RUN npm install

# Copia el backend completo (incluido server.js correctamente)
COPY backend/ ./

# Exponer puerto de servidor
EXPOSE 4000

# Ejecutar el servidor
CMD ["node", "server.js"]
