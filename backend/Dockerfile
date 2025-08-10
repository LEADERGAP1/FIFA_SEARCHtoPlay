# Imagen base
FROM node:18

# Crear y usar el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Exponer el puerto que usa tu backend
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["node", "index.js"]

