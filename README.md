Here tenés un **README.md** completo listo para copiar y pegar en tu repo 👇

---

# FIFA SearchToPlay

Aplicación full-stack para buscar y explorar jugadores de FIFA, con autenticación JWT, exportación a CSV y documentación Swagger. Incluye **Docker Compose** con **MySQL 8**, **Backend Node/Express** y **Frontend Angular servido por Nginx**.

## 🧱 Stack

* **Frontend:** Angular (build estático servido por Nginx, proxy `/api/*` → backend)
* **Backend:** Node.js + Express + Sequelize (MySQL)
* **DB:** MySQL 8
* **Infra:** Docker & Docker Compose

## 📁 Estructura (resumen)

```
.
├─ backend/
│  ├─ data/
│  │  └─ players_import.csv      # Dataset ya listo para importar
│  ├─ routes/ controllers/ models/ config/
│  ├─ index.js                   # Express + Swagger + Health
│  └─ .env                       # Variables del backend (no commitear)
├─ frontend/
│  ├─ Dockerfile
│  └─ nginx.conf                 # Proxy /api hacia backend
└─ docker-compose.yml
```

---

## ▶️ Cómo correr con Docker

> Requisitos: Docker + Docker Compose.

1. **Levantar todo**

```bash
docker compose up -d --build
```

2. **Esperar a que arranque e importe el dataset**
   Mirar estados y logs:

```bash
docker compose ps
docker compose logs -f mysql   # hasta "ready for connections"
docker compose logs -f seed    # debe decir: "Seed: import terminado."
```

3. **Crear usuario demo (1 comando)**

> Necesario para poder loguearse. Si ya existe, la API te lo dirá y podés loguearte igual.

```bash
curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Admin","email":"admin@demo.com","password":"demo1234"}'
```

4. **Abrir la app / API / Docs**

* Frontend: [http://localhost:8080/](http://localhost:8080/)
                                 http://localhost:8080/players 
* Swagger: [http://localhost:8080/api/docs](http://localhost:8080/api/docs)

**Login demo**

* Email: `admin@demo.com`
* Password: `demo1234`

---

## ✅ Chequeos rápidos

```bash
# Salud del backend (vía Nginx)
curl -s http://localhost:8080/api/health

# Primeros 3 jugadores (confirma dataset importado)
curl -s "http://localhost:8080/api/players?limit=3" | head
```

---

## 🔐 Autenticación (API)

* Registro: `POST /api/auth/register` `{ nombre, email, password }`
* Login: `POST /api/auth/login` `{ email, password }` → `token`
* Rutas privadas bajo `/api/*` esperan `Authorization: Bearer <token>`

---

## 🧪 Endpoints principales

* `GET /api/players` — listado con filtros `name`, `club`, `position`, `version`, `page`, `limit`
* `GET /api/players/:id` — detalle con `Skill`
* `GET /api/players/export` — descarga CSV según filtros
* `GET /api/health` — healthcheck
* **Docs:** `GET /api/docs` (Swagger UI)

---

## 🧰 Troubleshooting

**1) Swagger en blanco / 502 Bad Gateway**

* Backend puede estar arrancando. Verificar:

  ```bash
  docker compose ps
  docker compose logs -f backend
  ```
* Recargar después de unos segundos.

**2) “Usuario no encontrado” al loguear**

* Aún no creaste el usuario demo. Ejecutar el comando de registro del paso 3.

**3) MySQL unhealthy o sin datos**

* Volver a crear desde cero (borra volúmenes y reimporta):

  ```bash
  docker compose down -v
  docker compose up -d --build
  docker compose logs -f seed
  ```

  Debe verse `Seed: import terminado.`
* Ver conteo:

  ```bash
  docker exec -it mysql-db mysql -uroot -padmin123 -e \
    "USE fifa_players_db; SELECT COUNT(*) AS players FROM players;"
  ```

**4) Frontend no muestra datos**

* Confirmar que `frontend/nginx.conf` tenga el proxy:

  ```
  location /api/ {
    proxy_pass http://backend-app:3000;
  }
  ```
* Y que el frontend consuma rutas **relativas** (ej.: `/api/players`, `/api/auth/login`).

---

## 🧑‍💻 Desarrollo local (opcional, sin Docker)

> Para usar el backend con MySQL local, ajustá `backend/.env` (host/puerto/credenciales).

```bash
# Backend
cd backend
npm i
node index.js  # http://localhost:3000

# Frontend
cd frontend
npm i
ng serve -o    # http://localhost:4200
```

Asegurate de que tus services en Angular usen rutas **relativas** (`/api/...`) y configurá un **proxy** dev si lo necesitás, o bien cambiá temporalmente la base a `http://localhost:3000/api`.

---

## 🔒 Variables de entorno (backend)

Archivo `backend/.env` (no subir credenciales reales al repo):

```env
DB_HOST=mysql
DB_USER=root
DB_PASSWORD=admin123
DB_NAME=fifa_players_db
DB_PORT=3306

JWT_SECRET=clave_super_secreta_123
PORT=3000
```

> En Docker, `DB_HOST` se inyecta a `mysql` y la importación usa `backend/data/players_import.csv` automáticamente.

---

## 🧹 Comandos útiles

```bash
# Ver estado de servicios
docker compose ps

# Logs de un servicio
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mysql
docker compose logs -f seed

# Reset total (borrar volúmenes + reimportar dataset)
docker compose down -v
docker compose up -d --build
docker compose logs -f seed
```

---

¡Listo! Con esto cualquier persona puede levantar el proyecto, crear un usuario demo con **un solo comando** y probar todo (lista de jugadores + detalle con gráfico + login + Swagger) sin tocar nada más.

