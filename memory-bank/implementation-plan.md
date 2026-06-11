# NodeOps - Phase 1 Implementation Plan

This implementation plan outlines **Phase 1: Project Initialization & DevOps Foundation**. 

DevOps is not just about building infrastructure; it is about establishing robust development practices, automated feedback loops, and ensuring that our code is testable, observable, secure, and production-ready from the very first line.

---

## 🎯 Phase 1 Goals
1. **Initialize Workspace**: Establish standard Node.js development configuration using modern ECMAScript Modules (ESM).
2. **Quality Gates**: Configure ESLint and Prettier to enforce consistent styling and high code quality.
3. **Validated Environment Config**: Implement standard configuration management that fails fast on misconfigured environment variables.
4. **Decoupled Server Architecture**: Separate Express application configuration from network binding to allow seamless, friction-free testing.
5. **Observability Foundation**: Integrate structured, production-ready logging and centralize Express error handling.
6. **Self-Healing Capabilities**: Create a Layered Architecture with a live `/health` API endpoint.
7. **Automated Testing Suite**: Set up unit and integration testing workflows using Vitest and Supertest.

---

## 🚀 Step-by-Step Execution Plan

### Step 1: Project Initialization & ESM Transition
In modern Node.js development, ES Modules (ESM) syntax is the preferred standard. It provides native language-level module importing, improving code readability and making build/bundle steps simpler.

#### 🛠️ Action Items
1. Run `npm init -y` inside the workspace root.
2. Modify `package.json` to include `"type": "module"`.
3. Configure the engine limits to target Node.js LTS (e.g., `>= 18.0.0` or `>= 20.0.0`).

#### 🎓 DevOps & Learning Insights
- **What is ESM?** ES Modules use `import { x } from './y.js'` instead of the CommonJS `const x = require('./y')`. 
- **DevOps Value**: ESM has standard static analysis capabilities, which enables better code tree-shaking, fast static optimization, and compatibility with lightweight testing frameworks like Vitest. Using native ESM prevents us from needing heavy transpilors (like Babel) inside our production Docker containers, keeping image sizes small and build times fast.

---

### Step 2: Quality Control & Code Linting (ESLint & Prettier)
Unifying code quality across the team prevents style-related pull request arguments, eliminates common anti-patterns (such as unused imports or implicit globals), and acts as the very first automated check in a CI/CD pipeline.

#### 🛠️ Action Items
1. Install `eslint`, `prettier`, and the integration plugin `eslint-config-prettier` as devDependencies.
2. Initialize and configure ESLint (e.g., `.eslintrc.json` or standard flat configuration `eslint.config.js` targeting ESM).
3. Create a `.prettierrc` configuration file to enforce indentation, semi-colons, and string quote types.
4. Add `.eslintignore` and `.prettierignore` files to bypass node modules and build artifacts.

#### 🎓 DevOps & Learning Insights
- **Standardizing Style**: Writing code is a team sport. Consistency makes code bases easier to read, audit, and debug.
- **DevOps Value**: Running `npm run lint` and `npm run format:check` will serve as the **First Stage** of our automated Continuous Integration (CI) pipeline. If a developer attempts to merge code that contains style violations, the pipeline will immediately fail, protecting the integrity of the main branch.

---

### Step 3: Secure & Validated Environment Configuration
A primary tenet of the [12-Factor App methodology](https://12factor.net/config) is to separate configuration from code. Hardcoding values like ports, database credentials, or secret keys is a major security vulnerability and limits portability across environments (development, staging, production).

#### 🛠️ Action Items
1. Install `dotenv` to load configurations from `.env` files.
2. Install a validation library like `zod` to define a schema for expected environment variables.
3. Create `src/config/index.js` to parse, validate, and export configuration properties.
4. Populate `.env.example` with standard dummy configuration values.
5. Create a local `.env` file containing developer values (never commit this to version control; it must be in `.gitignore`).

#### 🎓 DevOps & Learning Insights
- **Fail-Fast Principle**: In DevOps, we want our applications to crash *immediately* at startup if there is a misconfiguration (such as a missing database URL or an invalid PORT number), rather than letting the application boot up and fail unpredictably during a critical transaction.
- **Self-Documenting Code**: `.env.example` provides an instant checklist for developers or operations engineers setting up the application in a new environment.

---

### Step 4: Split Architecture (`src/app.js` vs `src/server.js`)
To effectively test an API, we must be able to boot and execute requests against our application programmatically, without spinning up physical network interfaces.

#### 🛠️ Action Items
1. Create `src/app.js`:
   - Initialize the Express application.
   - Attach standard middlewares (e.g., JSON parser, security headers, logging wrapper).
   - Define base routes.
   - Export the initialized `app` object **without** calling `app.listen()`.
2. Create `src/server.js`:
   - Import the validated configuration from `src/config/index.js`.
   - Import the initialized `app` object from `src/app.js`.
   - Call `app.listen(PORT)` and log a startup message containing the active environment.

#### 🎓 DevOps & Learning Insights
- **Test Isolation**: By separating the "Express configuration" from the "Network listener," we can import `app` into our integration tests. Frameworks like `supertest` can then run HTTP-like requests directly through the application in-memory.
- **DevOps Value**: Running tests on a bound network port leads to "port in use" collisions when tests run in parallel in a CI environment. Decoupled servers are incredibly fast to test, stable, and completely concurrent-safe.

---

### Step 5: Advanced Centralized Logging & Error Handling
In production environments, containers run headlessly. Developers cannot simply read a terminal or attach debuggers. Observability depends on structured logs, and application stability depends on robust error interception.

#### 🛠️ Action Items
1. Establish a structured JSON logging strategy (using a library like `winston` or custom logger middleware in standard JSON format).
2. Write a centralized global error-handling middleware in `src/app.js` to catch any unhandled routing/controller errors.
3. Ensure that sensitive system paths, raw SQL queries, or stack traces are **never** leaked back to the HTTP client inside production mode (using environment flags like `NODE_ENV === 'production'`).

#### 🎓 DevOps & Learning Insights
- **Structured JSON Logging**: Centralized log-aggregation systems (such as ElasticSearch, Splunk, or AWS CloudWatch) require structured data (JSON) to search, filter, and alert on. A plain string like `Server started on port 3000` is hard to index. A JSON object like `{"level": "info", "message": "Server started", "port": 3000, "timestamp": "..."}` is highly searchable.
- **Resilience**: Without a centralized error-handler, an unhandled exception inside a router would crash the entire Node.js runtime process, resulting in downtime for all connected clients. Structured error boundaries keep the container alive and report context-rich warnings.

---

### Step 6: Router & Controller Separation with a `/health` Endpoint
Structuring our routes, controllers, and services separately ensures a clean flow of data and makes testing isolated parts of the request-response lifecycle straightforward.

#### 🛠️ Action Items
1. Define a standard Layered Directory Structure:
   - `src/routes/`: Paths and routing middleware.
   - `src/controllers/`: Extract data from requests, invoke business logic, and construct HTTP responses.
2. Create `src/routes/health.routes.js` and map `GET /health` to a health controller.
3. Implement `src/controllers/health.controller.js` to return:
   - Status (e.g., `"UP"` or `"OK"`).
   - Current system uptime (using `process.uptime()`).
   - Node environment details.
   - Basic resource usage stats (e.g., `process.memoryUsage()`).
4. Mount the health routes in `src/app.js`.

#### 🎓 DevOps & Learning Insights
- **Separation of Concerns**: Keeping routes independent from controllers ensures that changes to network contracts (like path parameters) can be modified without altering the core controller calculations.
- **Self-Healing Container Orchestration**: A `/health` endpoint is the heartbeat of modern containerization. Orchestrators like **Docker Compose**, **Kubernetes**, or cloud load balancers periodically call `GET /health`. If the endpoint fails or returns a `500` status code, the platform knows the container is dead and automatically terminates and spawns a fresh container instance to keep the system healthy.

---

### Step 7: Automated Testing Suite (Vitest & Supertest)
DevOps rely on high-fidelity, highly automated test suites to ensure that any push to the main branch is safe for automatic deployment.

#### 🛠️ Action Items
1. Install `vitest` (fast, modern test runner) and `supertest` (HTTP assertion library) as devDependencies.
2. Create a `vitest.config.js` configuration file.
3. Write a Unit Test for the Configuration Loader:
   - Ensure the app fails to start if environment schema rules are violated.
4. Write an Integration Test for the Health Route:
   - Import `app` from `src/app.js`.
   - Use `supertest(app)` to hit `/health` and verify HTTP status `200`, expected payload schema, and JSON content-type.

#### 🎓 DevOps & Learning Insights
- **Unit vs. Integration Tests**:
  - **Unit Tests** verify individual functions (such as "does our validator accept valid ports?").
  - **Integration Tests** verify that individual units work together as a single cohesive machine (such as "does a GET request navigate through routing, hit the health controller, and output formatted JSON?").
- **DevOps Value**: Every automated test written is an insurance policy. In Phase 2/3, we will lock these tests into a **GitHub Actions CI runner**, ensuring zero regressions slip into our builds.

---

### Step 8: Standardized Development Scripts
To make development simple, repeatable, and friendly for both manual developers and automated tooling, we need to standardize CLI execution commands.

#### 🛠️ Action Items
1. Open `package.json` and add the following scripts:
   - `"start"`: `node src/server.js` (standard command for production runtimes).
   - `"dev"`: `node --watch src/server.js` (launches server with native file hot-reloading for development).
   - `"test"`: `vitest run` (executes the test suite once; ideal for CI runners).
   - `"test:watch"`: `vitest` (executes the test suite in watch mode; ideal for developers).
   - `"lint"`: `eslint src` (checks for linting compliance).
   - `"format"`: `prettier --write src` (automatically reformats developer code).
   - `"format:check"`: `prettier --check src` (verifies formatting; ideal for CI).

#### 🎓 DevOps & Learning Insights
- **Standardized Entrypoints**: A DevOps platform shouldn't have to guess how to run an application. No matter what tech stack is used (Node.js, Python, Go, Java), standard scripts like `npm start` or `npm test` are standard entry points for orchestration engines and CI pipelines.

---

## 📅 Progress Tracking Matrix

| Step | Milestone Description | Target Files | Status | DevOps Verification |
| :--- | :------------------- | :----------- | :----: | :------------------ |
| **1** | Project ESM Setup | `package.json` | ⬜ *Pending* | Run `node -v` validation |
| **2** | Quality Control Gate | `.eslintrc.json`, `.prettierrc` | ⬜ *Pending* | Run `npm run lint` & format checks |
| **3** | Secure Config Loader | `src/config/index.js`, `.env.example` | ⬜ *Pending* | Configuration schema validation check |
| **4** | Server Decoupling | `src/app.js`, `src/server.js` | ⬜ *Pending* | Successful import checks |
| **5** | Logging & Global Error | `src/utils/logger.js`, `src/app.js` | ⬜ *Pending* | Production structured JSON output |
| **6** | Architecture & Health | `src/routes/health.routes.js`, `src/controllers/health.controller.js` | ⬜ *Pending* | Reachable `/health` route returning telemetry |
| **7** | Integration Suite | `tests/integration/health.test.js` | ⬜ *Pending* | Zero failed tests using `vitest run` |
| **8** | Command Standardization | `package.json` | ⬜ *Pending* | Standard execution of CLI scripts |
