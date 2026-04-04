# Docker Setup

## Run everything

```bash
docker compose up --build
```

## Services

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`
- Health check: `http://localhost:4000/health`
- Demo data: `http://localhost:4000/api/demo-state`

## Demo account

- Email: `demo@vitatrack.local`
- Password: `123456`

## Notes

- Backend source: `backend/server.js`
- Seed data: `backend/data/db.json`
- Frontend auto-loads demo data from backend if `localStorage` is empty.
