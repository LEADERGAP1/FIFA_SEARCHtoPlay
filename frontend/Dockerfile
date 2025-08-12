# Etapa 1: Build de Angular
FROM node:20-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:1.25-alpine

# Copia el build de Angular a la carpeta que sirve Nginx
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# (Opcional) Copiar config de Nginx para SPA
# COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

