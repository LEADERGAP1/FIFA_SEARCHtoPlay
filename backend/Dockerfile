# Etapa base (más liviana)
FROM node:20-alpine AS base
WORKDIR /app

# Solo manifiestos primero (cache eficiente)
COPY package*.json ./
RUN npm ci --only=production

# Copiamos el resto del código
COPY . .

# Variables de entorno típicas
ENV NODE_ENV=production \
    PORT=3000

EXPOSE 3000

# Si tenés script start en package.json, dejá:
CMD ["node","index.js"]
# o si no:
# CMD ["node","index.js"]

