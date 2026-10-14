# Developer Setup Guide

## 1. Monorepo Setup
Run the following from the project root:
```bash
pnpm install
```

## 2. Running Frontend Applications
```bash
# Web Dashboard
pnpm dev:dashboard

# Citizen Application
pnpm dev:citizen
```

## 3. Running Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
