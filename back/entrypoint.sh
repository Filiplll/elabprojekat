#!/bin/bash
set -e

if [ -n "${APP_KEY+x}" ] || [ -n "${DB_CONNECTION+x}" ]; then
    # Real environment variables are already provided (e.g. Render dashboard).
    # Do not keep a local .env around - its values could otherwise shadow
    # the platform-provided environment when Laravel resolves config.
    if [ -f .env ]; then
        echo "Real environment variables detected - removing local .env so it can't shadow them"
        rm -f .env
    fi
else
    if [ ! -f .env ]; then
        echo "No .env found and no environment variables set - creating one from .env.example (local/dev mode)"
        cp .env.example .env
    fi

    if ! grep -q '^APP_KEY=base64:' .env; then
        php artisan key:generate --force
    fi
fi

read_env() {
    local var="$1"
    if [ -n "${!var+x}" ]; then
        printf '%s' "${!var}"
        return
    fi
    if [ -f .env ]; then
        grep -E "^${var}=" .env | head -1 | cut -d= -f2- | tr -d '"'"'"'' | tr -d '\r'
    fi
}

DB_CONNECTION=$(read_env DB_CONNECTION)
DB_HOST=$(read_env DB_HOST)
DB_PORT=$(read_env DB_PORT)
DB_DATABASE=$(read_env DB_DATABASE)
DB_USERNAME=$(read_env DB_USERNAME)
DB_PASSWORD=$(read_env DB_PASSWORD)

if [ "$DB_CONNECTION" = "pgsql" ]; then
    DSN="pgsql:host=${DB_HOST};port=${DB_PORT:-5432};dbname=${DB_DATABASE};sslmode=prefer"
else
    DSN="mysql:host=${DB_HOST};port=${DB_PORT:-3306}"
fi

echo "Waiting for ${DB_CONNECTION} at ${DB_HOST}:${DB_PORT} ..."
until php -r "new PDO('${DSN}', '${DB_USERNAME}', '${DB_PASSWORD}');" 2>/dev/null; do
    sleep 2
done
echo "Database is up."

php artisan migrate --force
php artisan config:clear

exec "$@"
