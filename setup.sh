#!/bin/bash
set -e

cd "$(dirname "$0")"

if ! docker info >/dev/null 2>&1; then
    echo "Docker is not running. Start Docker Desktop and try again."
    exit 1
fi

echo "==> Building images and starting containers"
docker compose up -d --build

echo "==> Waiting for the API to answer on http://localhost:8000"
for i in $(seq 1 60); do
    if curl -fs -o /dev/null http://localhost:8000/up 2>/dev/null; then
        break
    fi
    if [ "$i" -eq 60 ]; then
        echo "The API did not come up in time. Check: docker compose logs app"
        exit 1
    fi
    sleep 2
done

echo "==> Running the test suite"
docker compose exec -T app php artisan test

cat <<'EOF'

Setup complete.

  API              http://localhost:8000
  API docs         http://localhost:8000/docs/api
  phpMyAdmin       http://localhost:8080
  MySQL from host  localhost:3307  (user: tereni, password: tereni_pass)

Run artisan commands inside the container:

  docker compose exec app php artisan <command>

EOF
