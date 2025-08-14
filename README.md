# FIFA_SEARCHtoPlay

Aplicación full-stack (Angular + Node/Express + MySQL) para buscar jugadores de FIFA, ver detalle con gráfico de skills y exportar CSV.  
El proyecto está dockerizado: un comando levanta MySQL, backend y frontend (Nginx).



## 🔗 URLs

- App (frontend): http://localhost:8080  
- API (Swagger): http://localhost:8080/api/docs  
- Health (vía Nginx): http://localhost:8080/api/health

> Nginx sirve el build de Angular y hace **proxy** de todas las llamadas a `/api/*` hacia el backend.



 🚀 Levantar con Docker

 Requisitos
- Docker Desktop o Docker Engine + Docker Compose.

 1) Clonar
bash
git clone <URL_DE_REPO> FIFA_SEARCHtoPlay
cd FIFA_SEARCHtoPlay

docker compose up -d --build
