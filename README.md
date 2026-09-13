# Iznajmljivanje sportskih terena – Informacioni sistem za online rezervaciju

Produkcijska verzija aplikacije:
https://iznajmljivanje-terena-frontend-latest.onrender.com

API dokumentacija (Swagger/Scramble): `/docs/api` na backend URL-u

---

## Pregled sistema

Tradicionalan način rezervisanja sportskih terena oslanja se na telefonske pozive, poruke na društvenim mrežama ili papirnu evidenciju, što dovodi do preklapanja termina i gubitka vremena na koordinaciju. Aplikacija "Iznajmljivanje sportskih terena" digitalizuje i centralizuje ceo proces – korisnici u realnom vremenu vide slobodne termine i rezervišu ih u nekoliko klikova, dok vlasnici terena dobijaju alat za upravljanje objektima, radnim vremenom i rezervacijama.

Pored osnovne rezervacije, sistem igračima omogućava kreiranje **javnih poziva** za dopunu ekipe kada im nedostaju saigrači, kao i uvid u **vremensku prognozu** za odabrani teren i datum, čime se olakšava planiranje aktivnosti na otvorenim terenima.

---

## Ciljne grupe

### Igrači
- Pretraga i filtriranje terena po sportu, gradu, tipu i ceni
- Pregled slobodnih termina i kreiranje/otkazivanje rezervacija
- Ostavljanje i izmena recenzija za odigrane termine
- Kreiranje javnih poziva i prijava na tuđe pozive kad nedostaju igrači za meč
- Uvid u vremensku prognozu za termin na otvorenom terenu

### Vlasnici terena
- Dodavanje, izmena i brisanje sopstvenih terena
- Definisanje radnog vremena, cena i dostupnih sportova po terenu
- Pregled i upravljanje statusom rezervacija na svojim terenima

### Administratori
- Upravljanje korisničkim nalozima (aktivacija/banovanje)
- Upravljanje šifarnikom sportova (dodavanje, izmena, brisanje)
- Moderacija recenzija (odobravanje/odbijanje)

---

## Funkcionalnosti sistema

- Registracija, prijava i RBAC autorizacija (Igrač / Vlasnik / Admin)
- Katalog terena sa filtriranjem, pretragom i sortiranjem
- Rezervacija termina u realnom vremenu uz sprečavanje duplih rezervacija
- Javni pozivi za popunu ekipe, sa prijavom i odjavom učesnika
- Recenzije i ocene terena, uz administratorsku moderaciju
- Integracija vremenske prognoze za odabrani grad i datum
- Konverzija cena terena u različite valute u realnom vremenu
- Administratorski panel za korisnike, sportove i recenzije

---

## Tehnološki stek

### Backend
- Laravel 12 (REST API arhitektura), PHP 8.3
- Eloquent ORM, Laravel Sanctum (autentifikacija putem tokena)
- MySQL 8 (lokalno okruženje), PostgreSQL (cloud baza)
- Pest 4 (automatizovani testovi), dedoc/scramble (Swagger dokumentacija)

### Frontend
- React 18 + Vite
- Tailwind CSS
- React Router DOM
- Axios za komunikaciju sa API-jem

### DevOps i infrastruktura
- Docker i Docker Compose
- GitHub Actions (CI/CD)
- GitHub Container Registry (ghcr.io)
- Render (cloud hosting)

---

## Integracije

- **Open-Meteo** – vremenska prognoza za odabrani teren i datum
- **ExchangeRate-API** (`open.er-api.com`) – konverzija cena iz RSD u druge valute
- **Nominatim (OpenStreetMap)** – geokodiranje adrese terena u geografske koordinate

---

# Pokretanje aplikacije

## Pokretanje pomoću Docker-a (preporučeno)

Iz root direktorijuma projekta:

```bash
docker compose up -d --build
```

Alternativno, isto se može uraditi i preko priložene skripte, koja pored podizanja kontejnera sačeka da API postane dostupan i pokrene test suite:

```bash
./setup.sh
```

| Servis | URL |
|---|---|
| Backend API | http://localhost:8000 |
| API dokumentacija | http://localhost:8000/docs/api |
| Frontend | http://localhost:5173 |
| phpMyAdmin | http://localhost:8080 |
| MySQL sa hosta | localhost:3307 |

Podaci za konekciju na bazu (lokalno, iz `back/.env.example`): baza `tereni`, korisnik `tereni`, lozinka `tereni_pass`.

Za gašenje kontejnera:

```bash
docker compose down
```

Docker konfiguracija podiže kompletno okruženje: backend, frontend, MySQL bazu i phpMyAdmin, povezane preko zajedničke bridge mreže, uz `mysql_data` named volume za trajnost podataka.

## Svakodnevne komande (Docker)

Iz root direktorijuma:

```bash
docker compose logs -f app
docker compose exec app php artisan migrate
docker compose exec app php artisan test
docker compose exec app php artisan tinker
docker compose exec app composer require <paket>
```

Nakon `composer require`, potrebno je ponovo build-ovati image kako bi paket bio "upečen" u njega:

```bash
docker compose build app
```

## Lokalno pokretanje (bez Docker-a)

### Backend

```bash
cd back
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Backend će biti dostupan na http://127.0.0.1:8000

### Frontend

```bash
cd front
npm install
npm run dev
```

Frontend će biti dostupan na http://localhost:5173

---

## Strategija grananja

Projekat koristi strukturisani Git workflow sa jasno razdvojenim granama:

### 🔹 main
Stabilna, produkciona verzija aplikacije. Push na `main` pokreće CD pipeline koji gradi i objavljuje Docker slike i pokreće deployment na Render.

### 🔹 dev
Glavna razvojna (integraciona) grana. Sve feature grane granaju se iz `dev` i po završetku i testiranju vraćaju nazad u nju putem pull request-a. Kada je `dev` stabilan i sve provere prolaze, spaja se u `main`, čime se pokreće CD pipeline.

### 🔹 Feature grane
Nove funkcionalnosti razvijaju se izolovano u zasebnim granama koje polaze od `dev`:

- `feature/rezervacija` – kreiranje, izmena i otkazivanje rezervacija termina
- `feature/pozivi` – javni pozivi za popunu ekipe (kreiranje, izmena, prijava i odjava učesnika)
- `feature/recenzije` – ostavljanje i izmena recenzija za odigrane termine
- `feature/vlasnik` – upravljanje terenima i rezervacijama od strane vlasnika
- `feature/admin` – administratorski panel (sportovi, korisnici, tereni, moderacija recenzija)

Po završetku razvoja i pregledu koda, feature grana se spaja nazad u `dev` putem pull request-a, nakon čega se briše. Nove funkcionalnosti prate istu konvenciju imenovanja: `feature/<naziv-funkcionalnosti>`.

---

## Arhitektura sistema

Aplikacija je implementirana kao troslojno full-stack rešenje:

- **React SPA** (prezentacioni sloj) – korisnički interfejs i vizuelni prikaz
- **Laravel REST API** (sloj poslovne logike) – autentifikacija, validacija i poslovna pravila
- **MySQL / PostgreSQL** (sloj podataka) – trajno skladištenje i upravljanje podacima

Komunikacija između React klijenta i Laravel servera ostvarena je REST API-jem preko HTTP-a (GET, POST, PUT, PATCH, DELETE), sa razmenom podataka u JSON formatu. Ceo sistem je kontejnerizovan pomoću Docker-a (backend, frontend, MySQL, phpMyAdmin).

---

## CI/CD pipeline

- **CI** (`.github/workflows/ci.yml`) – pokreće se na svaki pull request ka `main`: instalira zavisnosti, pokreće Laravel (Pest) testove protiv SQLite in-memory baze, radi lint i build frontenda.
- **CD** (`.github/workflows/cd.yml`) – pokreće se na svaki push na `main`: ponavlja backend i frontend provere, zatim gradi i objavljuje Docker slike (backend i frontend) na GitHub Container Registry, i na kraju putem Render Deploy Hook-a pokreće automatski, zero-downtime deployment.

---

## Bezbednost aplikacije

- Token-based autentifikacija i autorizacija (Laravel Sanctum)
- Zaštita od SQL injekcije putem Eloquent ORM-a (parametrizovani upiti)
- Konfigurisana CORS politika (`back/config/cors.php`) – pristup API-ju dozvoljen samo sa verifikovanih domena
- Heširanje korisničkih lozinki (bcrypt)

---

## Automatizovani testovi

Backend testovi pisani su u **Pest**-u i pokrivaju kritične tačke aplikacije (CRUD operacije, poslovna pravila, autorizaciju). Testovi se izvršavaju protiv SQLite in-memory baze i nikad ne diraju razvojnu bazu.

```bash
docker compose exec app php artisan test
```

Testovi su i "kapija" u CI pipeline-u – ako bilo koja provera ne prođe, kod ne prolazi u fazu build-a i deploy-a.

---

## Preduslovi

Za pokretanje pomoću Docker-a potrebno je imati:
- Docker
- Docker Compose

Za lokalno pokretanje bez Docker-a potrebno je imati:
- PHP 8.3 i Composer
- Node.js i npm
- MySQL

---

## Struktura projekta

```
.
├── back/                   # Laravel REST API
│   ├── app/
│   │   ├── Http/{Controllers,Requests,Resources}
│   │   ├── Models/
│   │   └── Services/
│   ├── database/{factories,migrations,seeders}
│   ├── routes/api.php
│   └── tests/
├── front/                  # React (Vite) SPA
│   └── src/{api,components,hooks,pages}
└── docker-compose.yml
```
