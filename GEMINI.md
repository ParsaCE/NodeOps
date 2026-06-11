# NodeOps - Project Instructions & Guidelines

Welcome to **NodeOps**, a structured hands-on environment designed to help you master DevOps engineering starting from a blank slate. 

This document (`GEMINI.md`) defines the core conventions, technology choices, architectural decisions, and workflows for this repository. In a collaborative team environment, this file serves as the "source of truth" for engineering and DevOps standards.

---

## 🛠️ Tech Stack & Architecture

We will build and deploy a modern Node.js application designed with DevOps principles in mind (testability, observability, scalability, and security).

### 1. The Application Layer
* **Language & Runtime:** **Node.js (LTS)** with modern ES Modules (ESM) syntax.
* **Framework:** **Express.js** (lightweight, highly customisable, standard for learning).
* **Architecture:** **Layered Architecture** (Clean separation of concerns):
  * `src/config/`: Configuration management, environment variable validation.
  * `src/routes/`: Route definitions, mapping URLs to controllers.
  * `src/controllers/`: Request handling, response formatting, status codes.
  * `src/app.js` & `src/server.js`: Application bootstrapping and server listener separation (essential for integration testing).
* **Database:** **SQLite** or **In-Memory Store** (to keep local development simple without cloud dependency, transitioning to PostgreSQL in Docker Compose for database-orchestration learning).
* **Testing:** **Vitest** or **Jest** (for unit/integration testing of API endpoints and utilities).

### 2. The DevOps & Infrastructure Layer
* **Containerization:** **Docker**
  * Development: Volume-mounted live-reload for seamless DX.
  * Production: Multi-stage, distroless/alpine-based, non-root builds for performance and security.
* **Orchestration:** **Docker Compose**
  * Local multi-container simulation: Web App + PostgreSQL database + Redis cache.
* **Continuous Integration (CI):** **GitHub Actions**
  * Automated linting, type-checking, test running, and Docker image build-validation on every commit.
* **Continuous Delivery (CD) & Deployment:** **Local Deployment & GitHub Container Registry (GHCR)**
  * Automatic multi-architecture container builds (buildx) pushed to a registry.
* **Observability:** **Winston/Morgan (Logging) & Prometheus/Grafana (Metrics)**
  * Structured JSON logs (best for production log aggregators) and Prometheus metrics endpoint.

---

## 📐 Coding & Formatting Standards

To ensure clean, maintainable, and uniform code, we adhere to the following standards:

1. **Linting & Formatting:** 
   * **ESLint** for code quality.
   * **Prettier** for consistent code style.
   * *Rule:* Never commit code with failing linter checks. Run linting before pushing.
2. **Environment Variables:**
   * Never hardcode sensitive credentials.
   * All configurations must be loaded from `process.env` through `src/config/index.js` with validation (e.g., using `zod` or simple validation functions).
   * A `.env.example` must be kept updated with all required keys (dummy values only).
3. **Async / Error Handling:**
   * Always catch rejected promises. Use `async/await` with `try/catch` block patterns or standard Express middleware wrapper.
   * Centralized Express error handler to prevent stack traces from leaking to clients in production.

---

## 🐳 Dockerization Best Practices

DevOps emphasizes production-grade security, optimization, and repeatability. We enforce these Docker rules:

1. **Multi-Stage Builds:**
   * Separate the build environment (which needs npm, compilers, devDependencies) from the production runtime environment (which only needs production dependencies and Node runtime).
   * Reduces image size from ~1GB to ~100MB.
2. **Security & Non-Root Execution:**
   * By default, Docker runs processes as `root`. If an attacker compromises the app, they gain root access to the host.
   * We will explicitly use a non-root user (e.g., `node`) inside our Dockerfiles.
3. **Layer Caching Optimization:**
   * Copy `package.json` and `package-lock.json` and run `npm install` **before** copying the application source code.
   * This ensures Docker caches dependencies, making subsequent builds instant unless dependencies change.

---

## 🚀 Git and Workflow Conventions

1. **Semantic Commit Messages:**
   * Format: `<type>(<scope>): <short description>`
   * Types: `feat` (new feature), `fix` (bug fix), `docs` (documentation), `style` (formatting), `refactor` (code change), `test` (adding/updating tests), `chore` (build/tooling/dev).
2. **Pull Requests & Code Reviews:**
   * All code changes go through a pull request (PR).
   * PRs must pass the CI workflow (linting, tests, container builds) before merging.

