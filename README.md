A production-grade DevOps learning pipeline built from scratch.

![CI](https://github.com/ParsaCE/NodeOps/actions/workflows/ci.yml/badge.svg)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20 + Express |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Proxy | Nginx |
| Container | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Registry | GitHub Container Registry |

## 🏗️ Architecture
Internet → Nginx:80 → Node.js:3000 → PostgreSQL

→ Redis

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/ParsaCE/NodeOps.git
cd NodeOps

# Setup
cp .env.example .env

# Run
docker compose up -d

# Migrate
docker compose exec api node scripts/migrate.js
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /api/todos | Get all todos |
| POST | /api/todos | Create todo |

## 🗺️ Roadmap

- [x] Phase 1: Local Development
- [x] Phase 2: CI/CD Pipeline
- [ ] Phase 3: AWS Deployment
- [ ] Phase 4: Production Ready
- [ ] Phase 5: Monitoring
- [ ] Phase 6: Kubernetes
- [ ] Phase 7: Terraform
