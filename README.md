# Seat Query

Seat Query is a full-stack attendee seat lookup system built from the documents in `docs/`.

## Stack

- Backend: Go + Gin
- Database: PostgreSQL
- Data import: Python + pandas
- Frontend: Next.js + Tailwind CSS

## Project Structure

```text
backend/                Gin API service
deployments/postgres/   Database initialization SQL
docs/                   Product, data, schema, and task documents
frontend/               Next.js application
scripts/                Data import and cleaning utilities
docker-compose.yml      Local PostgreSQL service
```

## Quick Start

### 1. Start PostgreSQL

```bash
docker compose up -d postgres
```

### 2. Run the backend

```bash
cd backend
Copy-Item .env.example .env
go mod tidy
go run ./cmd/server
```

### 3. Import attendee data

```bash
cd scripts
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
python import_attendees.py --file ../data/attendees.xlsx
```

### 4. Run the frontend

```bash
cd frontend
Copy-Item .env.example .env.local
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` and queries the backend on `http://localhost:8080` by default.

## API

### `GET /api/seat?name=<keyword>`

Returns a JSON array of matching attendees. Fuzzy search uses PostgreSQL `ILIKE`.

Example response:

```json
[
  {
    "name": "张三",
    "organization": "A公司",
    "display_name": "张三(A公司)",
    "zone": "A区",
    "row": 3,
    "seat": 15
  }
]
```
