# elabprojekat

Laravel (API) + React (Vite SPA) full-stack projekat.

## Pokretanje preko Docker-a (preporučeno)

```
docker compose up -d --build
```

- Backend: http://localhost:8000
- Frontend: http://localhost:5173
- phpMyAdmin: http://localhost:8080

Backend kontejner pri startu automatski čeka bazu, generiše `APP_KEY` (ako fali) i pokreće migracije.

## Lokalno pokretanje (bez Docker-a)

### Backend

```
cd back
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend

```
cd front
npm install
npm run dev
```

Frontend očekuje `VITE_API_BASE_URL` u `front/.env` (podrazumevano `http://localhost:8000/api`).
