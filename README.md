# GarmiQ 🌡️

> Extreme Heat Risk Monitoring & Alert Platform

GarmiQ is an end-to-end intelligent heat stress intelligence platform designed to protect citizens and support municipal authorities during extreme temperature events.

## Monorepo Layout

```
GarmiQ/
├── frontend/
│   ├── web-dashboard/       # Admin & Municipal authority dashboard
│   └── citizen-app/         # Citizen-facing alert & guidance web app
├── backend/                 # Python FastAPI backend & services
├── packages/                # Shared TypeScript libraries
│   ├── api-client/          # Typed API client
│   ├── ui/                  # Reusable UI component kit
│   └── types/               # Shared domain TypeScript types
├── contracts/               # OpenAPI specs & JSON Schemas
├── infra/                   # Docker, Postgres, deployment configs
└── docs/                    # Architecture, API, and setup documentation
```

## Quick Start

### 1. Prerequisites
- Node.js >= 18 and [pnpm](https://pnpm.io/)
- Python >= 3.11
- Docker & Docker Compose (optional, for local database & full-stack containerization)

### 2. Backend Setup
```bash
cd backend
python -m venv .venv
# Activate virtualenv (Windows: .venv\Scripts\activate | Linux/macOS: source .venv/bin/activate)
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Interactive API documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

### 3. Frontend Setup
```bash
# From repository root
pnpm install

# Run authority web dashboard
pnpm dev:dashboard

# Run citizen mobile-web app
pnpm dev:citizen
```

### 4. Infrastructure with Docker
```bash
docker compose -f infra/docker-compose.yml up -d
```
