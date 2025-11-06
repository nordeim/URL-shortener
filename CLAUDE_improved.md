# CLAUDE: The Ultimate AI Briefing Document

**Project:** Production-Ready URL Shortener with Analytics  
**Tech Stack:** Next.js 14 + TypeScript + Supabase + Docker  
**Generated:** 2025-11-06  
**Purpose:** AI coding agent-optimized technical reference for the URL Shortener project.

---

## 🎯 1. PROJECT OVERVIEW

### Mission Statement
To provide a highly available, scalable, and secure URL shortening service with comprehensive analytics. This project serves as a production-grade reference implementation for modern web applications, designed for seamless maintenance and enhancement by AI development assistants.

### Technical Objectives
- **High Performance:** Sub-200ms API response times and fast redirect speeds.
- **Scalability:** Stateless application architecture ready for horizontal scaling.
- **Security:** Robust protection against common web vulnerabilities (XSS, SQLi, CSRF) and DDoS attacks.
- **Maintainability:** Clean, well-documented, and strongly-typed codebase.
- **Developer Experience:** A fully containerized development environment with extensive automation and testing.
- **Reliability:** 99.9% uptime with robust monitoring.
- **Extensibility:** Modular architecture to easily accommodate new features.

### Architecture Type
The system employs a **JAMstack architecture** with a **serverless backend**, leveraging the following principles:
- **Decoupled Frontend and Backend:** The Next.js frontend is decoupled from the backend services (Supabase and Next.js API Routes).
- **Stateless API Layer:** All state is managed in the database, allowing the application tier to be scaled horizontally without session management complexities.
- **Component-Driven UI:** The user interface is built with reusable, modular components.
- **Infrastructure as Code:** The entire environment, from local development to production, is defined and managed through code (`docker-compose.yml`, `Dockerfile`).

### Key Features and Capabilities
- **URL Shortening:** Generate unique, short identifiers for long URLs.
- **Custom Aliases:** Users can define their own custom short URLs.
- **Analytics Dashboard:**
    - Total number of links and clicks.
    - Top-performing links by click count.
    - Click trends over the last 7 days.
- **QR Code Generation:** Automatically generate a QR code for each shortened URL.
- **Link Management:**
    - Paginated view of all shortened links.
    - Ability to delete links.
- **Rate Limiting:** Protects the API from abuse and brute-force attacks.
- **Security:**
    - Input validation and sanitization.
    - Environment-based secrets management.
    - Secure headers and Content Security Policy (CSP).

### Architectural Choices Rationale
- **Next.js 14 (App Router):** Chosen for its hybrid rendering capabilities (SSR and SSG), automatic code splitting, and integrated API routes, which simplify development and enhance performance. The App Router provides a modern, streamlined approach to building React applications.
- **TypeScript:** Enforces type safety across the entire stack, from the database to the frontend, reducing runtime errors and improving developer productivity.
- **Supabase (PostgreSQL):** Provides a scalable, managed PostgreSQL database with a generous free tier, along with auto-generated APIs and real-time capabilities. This simplifies backend development and data management.
- **Docker & Docker Compose:** Ensures a consistent and reproducible development environment, and simplifies the deployment process. Multi-stage Docker builds create optimized, lightweight production images.
- **Tailwind CSS & shadcn/ui:** Offers a utility-first approach to styling, enabling rapid UI development while maintaining a consistent design system. shadcn/ui provides accessible and reusable components.
- **Vitest & Testing Library:** A modern, fast, and reliable testing stack that encourages a comprehensive testing strategy, including unit, integration, and component tests.
- **Stateless Architecture:** A critical decision to ensure the application can be easily scaled horizontally behind a load balancer.

## ⚙️ 2. TECHNOLOGY STACK

This section details the complete technology stack, including framework versions, database systems, and development tools. All components are chosen for their performance, scalability, and robust ecosystems.

### Core Framework & Language
- **Framework:** Next.js ^14.0.0
  - **Architecture:** App Router
  - **Rendering:** Hybrid Server-Side Rendering (SSR) and Client-Side Rendering (CSR)
  - **Output:** Standalone mode for optimized production deployment.
- **Language:** TypeScript 5.2.0
  - **Configuration:** Strict mode enabled (`tsconfig.json`).
  - **Coverage:** End-to-end type safety from database to UI.
- **Runtime:** Node.js 22.x
  - **Compatibility:** Requires Node.js 18+.
  - **Package Manager:** npm 10.x

### Database System
- **Provider:** Supabase 3.0
  - **Type:** Backend-as-a-Service (BaaS)
  - **Underlying Database:** PostgreSQL 14.1.0
  - **Features:**
    - Managed PostgreSQL instance.
    - Auto-generated RESTful API.
    - Real-time capabilities via websockets.
    - Authentication and authorization services.
- **Integration:**
  - **Client:** `@supabase/supabase-js` ^2.38.0
  - **Pattern:** Repository pattern (`lib/supabase.ts`) with multiple clients (anonymous and service role).

### Frontend Technologies
- **UI Library:** React 18.2.0
- **Styling:**
  - **Framework:** Tailwind CSS 3.3.0
  - **Component Library:** shadcn/ui
    - **Purpose:** Accessible, customizable, and reusable UI components.
    - **Implementation:** Located in `components/ui/`.
- **Form Management:**
  - **Library:** React Hook Form ^7.48.0
  - **Schema Validation:** Zod ^3.22.0
    - **Usage:** Enforces strict data validation on both client and server.
- **Data Visualization:**
  - **Library:** Chart.js & react-chartjs-2
  - **Purpose:** Used for rendering analytics charts on the dashboard.
- **QR Code Generation:**
  - **Library:** `qrcode.react`
  - **Functionality:** Client-side generation of QR codes for shortened URLs.

### Development & Build System
- **Build Tool:** Next.js CLI (via `npm run build`)
- **Local Development:** Next.js Dev Server (via `npm run dev`)
  - **Features:** Hot Module Replacement (HMR) for instant feedback.
- **Code Quality & Formatting:**
  - **Linter:** ESLint (`eslint.config.cjs`)
  - **Formatter:** Prettier (`.prettierrc`)
  - **Automation:** Husky & lint-staged for pre-commit hooks.

### Testing Framework & Tools
- **Testing Framework:** Vitest ^0.34.0
  - **Purpose:** Unit and integration testing.
  - **Configuration:** `vitest.config.ts`
- **Component Testing:**
  - **Library:** React Testing Library
  - **Purpose:** Testing React components' behavior from a user's perspective.
- **End-to-End (E2E) Testing:**
  - **Framework:** Playwright
  - **Purpose:** Testing critical user flows in a real browser environment.
- **Test Coverage:**
  - **Goal:** 95%+
  - **Reporting:** `vitest --coverage` generates reports in the `coverage/` directory.

### Deployment & Containerization
- **Containerization:**
  - **Engine:** Docker 20.10+
  - **Orchestration:** Docker Compose (`docker-compose.yml`)
- **Deployment Platform:**
  - **Primary:** Vercel (recommended for seamless Next.js deployment)
  - **Alternatives:** Any platform supporting Docker containers (AWS, Google Cloud, Azure, VPS).
- **Container Registry:** Docker Hub, GitHub Container Registry, or any other private registry.
- **CI/CD:** GitHub Actions
  - **Workflow:** Defined in `.github/workflows/ci-cd.yml`
  - **Pipeline:** Automates testing, building, and deployment.

## 🏗️ 3. SYSTEM ARCHITECTURE

This section provides a detailed breakdown of the system's architecture, including component relationships, data flow patterns, and database schema.

### Component Hierarchy and Relationships

The architecture is layered to ensure a clear separation of concerns:

1.  **Presentation Layer (Frontend):**
    -   **Framework:** Next.js with React 18.
    -   **Components:** Located in `/components`, built using shadcn/ui.
    -   **Responsibilities:** Renders the UI, manages client-side state, and communicates with the API layer.

2.  **Application Layer (Backend):**
    -   **Framework:** Next.js API Routes.
    -   **Location:** `/app/api/`.
    -   **Responsibilities:** Handles business logic, processes API requests, and interacts with the data layer.

3.  **Data Layer (Database):**
    -   **Provider:** Supabase (PostgreSQL).
    -   **Access Pattern:** Abstracted through a repository pattern in `lib/supabase.ts`.
    -   **Responsibilities:** Data persistence, querying, and integrity.

```
┌───────────────────────┐      ┌──────────────────────────┐      ┌────────────────────────┐
│   Presentation Layer  │      │    Application Layer     │      │       Data Layer       │
│ (Next.js / React UI)  │──────│ (Next.js API Routes)     │──────│ (Supabase / PostgreSQL)│
└───────────────────────┘      └──────────────────────────┘      └────────────────────────┘
           │                            │                                 │
           ▼                            ▼                                 ▼
┌───────────────────────┐      ┌──────────────────────────┐      ┌────────────────────────┐
│      Components       │      │   API Route Handlers     │      │      Database Tables   │
│  (e.g., url-form.tsx) │      │ (e.g., /api/shorten)     │      │       (e.g., links)    │
└───────────────────────┘      └──────────────────────────┘      └────────────────────────┘
```

### Data Flow Patterns

**1. URL Shortening (Write Flow):**
```
1. User submits URL in `url-form.tsx`.
2. Client-side validation using Zod.
3. `POST` request is sent to `/api/shorten`.
4. API route receives the request.
5. Rate limiter (`lib/rateLimiter.ts`) checks the request IP.
6. Zod performs server-side validation.
7. A unique `shortId` is generated (or custom alias is used).
8. `supabaseService` client inserts a new record into the `links` table.
9. On success, a QR code is generated.
10. API returns a `201 Created` response with the short URL and QR code.
11. The UI updates to display the result.
```

**2. URL Redirection (Read Flow):**
```
1. User accesses a short URL (e.g., `http://localhost:3000/abc123`).
2. Next.js dynamic route `app/[shortId]/page.tsx` handles the request.
3. The `shortId` is extracted from the URL.
4. `supabaseService` client queries the `links` table for the matching `shortId`.
5. If found, the `click_count` is atomically incremented in the `links` table.
6. The application returns an HTTP `302 Found` redirect to the `original_url`.
7. If not found, the `not-found.tsx` page is rendered (HTTP 404).
```

**3. Analytics Display (Read Flow):**
```
1. User navigates to the `/analytics` page.
2. The `Analytics` component sends a `GET` request to `/api/analytics`.
3. The API route queries the `links` table for aggregated data:
   - Total link count.
   - Total click count.
   - Top 5 most clicked links.
   - Click data for the last 7 days (calculated from `created_at` and `click_count`).
4. The API returns a `200 OK` response with the analytics data.
5. The `AnalyticsChart` component uses Chart.js to render the data.
```

### Database Schema and Relationships

- **`links` Table:** The primary table for storing URL data and analytics.

**`links` Table Schema:**
```sql
CREATE TABLE public.links (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMPTZ DEFAULT now(),
    original_url TEXT NOT NULL,
    short_id VARCHAR(255) UNIQUE NOT NULL,
    click_count INT DEFAULT 0,
    custom_alias BOOLEAN DEFAULT false,
    last_accessed TIMESTAMPTZ,
    metadata JSONB
);
```
- **Indexes:**
  - `PRIMARY KEY` on `id`.
  - `UNIQUE` constraint on `short_id`.
  - `INDEX` on `created_at` for time-based queries.

### Security Implementation and Validation Layers

Security is multi-layered, providing defense in depth:

1.  **Client-Side Validation:**
    -   `Zod` schemas in forms provide immediate feedback to the user.
2.  **API Input Validation:**
    -   All API endpoints re-validate inputs using `Zod` schemas on the server.
    -   This prevents malformed data from reaching the business logic.
3.  **Rate Limiting:**
    -   `lib/rateLimiter.ts` implements a token bucket algorithm based on IP address.
    -   Protects against brute-force attacks and API abuse.
    -   Returns `429 Too Many Requests` when the limit is exceeded.
4.  **SQL Injection Prevention:**
    -   The Supabase client automatically uses parameterized queries, neutralizing SQL injection risks.
5.  **Cross-Site Scripting (XSS) Prevention:**
    -   React's automatic JSX escaping prevents user-supplied data from being executed as HTML.
    -   Strict Content Security Policy (CSP) headers are configured in `next.config.mjs`.
6.  **Secrets Management:**
    -   All sensitive keys (Supabase API keys) are managed through environment variables.
    -   `SUPABASE_SERVICE_ROLE_KEY` is strictly used on the server and never exposed to the client.

### Performance Optimization Strategies

- **Database Performance:**
  - **Indexing:** Strategic indexing on frequently queried columns (`short_id`, `created_at`).
  - **Connection Pooling:** Managed automatically by Supabase.
  - **Query Optimization:** Queries are written to be efficient, selecting only the necessary columns.
- **Application Performance:**
  - **Caching:** Next.js provides automatic caching for static assets. `Cache-Control` headers are used for API responses.
  - **Code Splitting:** Next.js automatically splits code by page, so users only download the JavaScript needed for the current route.
  - **Lazy Loading:** Components like the QR code generator are lazy-loaded to reduce the initial bundle size.
- **Build Optimization:**
  - **Multi-stage Docker Builds:** Creates a minimal production image by separating build dependencies from the final runtime environment.
  - **Standalone Output:** `output: 'standalone'` in `next.config.mjs` produces a self-contained deployment package.

## 📁 4. CRITICAL FILE REFERENCE

This section provides a guide to the most important files and directories in the project. Understanding their purpose is essential for effective development and maintenance.

### Core Application Structure

-   **`/app/`**: The heart of the Next.js application, following the App Router convention.
    -   **`layout.tsx`**: The root layout of the application. **Modify with caution**, as changes affect the entire site. It's the place for global context providers and metadata.
    -   **`page.tsx`**: The main landing page of the application, containing the primary URL shortener form.
    -   **`[shortId]/page.tsx`**: Dynamic route handler for URL redirection. This is a critical file for the core functionality of the shortener.
    -   **`not-found.tsx`**: Custom 404 page.

### API Route Handlers

-   **`/app/api/`**: Contains all backend API logic.
    -   **`shorten/route.ts`**: Handles the creation of new short URLs. **Dependencies:** `lib/supabase.ts`, `lib/rateLimiter.ts`, `zod`. **Modification:** Be careful when changing the ID generation logic or database insertion.
    -   **`analytics/route.ts`**: Provides data for the analytics dashboard. **Dependencies:** `lib/supabase.ts`. **Modification:** Optimize queries here to keep the dashboard fast.
    -   **`links/route.ts`**: Manages the listing and pagination of links. **Dependencies:** `lib/supabase.ts`.
    -   **`delete/route.ts`**: Handles the deletion of a link. **Dependencies:** `lib/supabase.ts`. Requires service role authentication.

### Reusable Components

-   **`/components/`**: Contains all reusable React components.
    -   **`/ui/`**: Components from the `shadcn/ui` library. These are foundational UI elements.
    -   **`url-form.tsx`**: The main form for submitting URLs. **Dependencies:** `react-hook-form`, `zod`.
    -   **`link-table.tsx`**: Displays the list of shortened URLs.
    -   **`analytics-chart.tsx`**: The Chart.js component for the dashboard.
    -   **`qr-code.tsx`**: Component for displaying the generated QR code.

### Shared Libraries & Utilities

-   **`/lib/`**: Contains shared business logic and utilities.
    -   **`supabase.ts`**: The Supabase client configuration. **Crucial for database connectivity.** It exports multiple clients for different security contexts (anonymous and service role).
    -   **`rateLimiter.ts`**: The rate limiting logic. **Modification:** Adjust the rate limit parameters here as needed.
    -   **`utils.ts`**: A collection of utility functions (e.g., URL validation).
    -   **`constants.ts`**: Application-wide constants.

### Configuration Files

-   **`next.config.mjs`**: Next.js configuration file. **Key settings:** `output: 'standalone'`, security headers, and environment variable exposure.
-   **`tsconfig.json`**: TypeScript compiler options. Contains strict mode settings.
-   **`tailwind.config.ts`**: Tailwind CSS configuration, including theme and plugins.
-   **`package.json`**: Defines project scripts and dependencies. Use `npm install` to add new dependencies.

### Containerization & Deployment

-   **`Dockerfile`**: Defines the multi-stage build process for the production Docker image. **Modification:** Update this file if the build process or runtime environment changes.
-   **`docker-compose.yml`**: Orchestrates the local development environment, including the application container and the Supabase database.
-   **`.github/workflows/ci-cd.yml`**: The CI/CD pipeline definition for GitHub Actions. It automates testing and deployment.

### Environment Configuration

-   **`.env.local.example`**: A template for the local environment variables. **Action:** Copy this to `.env.local` and fill in your Supabase credentials.
-   **`.env.docker`**: A template for the Docker environment variables. Used by `docker-compose`.

### Database Schema & Migrations

-   **`scripts/db-init.sql`**: A script to initialize the database schema. Use this for setting up new environments quickly.
-   **`supabase/migrations/`**: Contains version-controlled database schema changes. New schema changes should be added as new migration files for iterative updates.

## 🚀 5. DEVELOPMENT OPERATIONS

This section outlines the commands and procedures for local development, testing, and building the application.

### Environment Setup Commands

**1. Clone the Repository:**
```bash
# Clone the project from GitHub
git clone https://github.com/nordeim/URL-shortener.git
cd URL-shortener
```

**2. Install Dependencies:**
```bash
# Install all required packages from package.json
npm install
```

**3. Configure Environment Variables:**
```bash
# Create your local environment file
cp .env.local.example .env.local
```
-   **Action:** Edit the `.env.local` file with your Supabase project URL and API keys.

**4. Set Up the Database:**
-   Navigate to your Supabase project's SQL Editor.
-   Open the `scripts/db-init.sql` file.
-   Copy and execute the SQL script to create the necessary tables and indexes.

### Development Server Startup

-   **Start the development server:**
    ```bash
    npm run dev
    ```
-   The application will be available at `http://localhost:3000`.
-   The development server features Hot Module Replacement (HMR), so changes to the code will be reflected in the browser almost instantly.

### Testing Procedures and Commands

The project uses Vitest for testing. The following commands are available:

-   **Run all tests:**
    ```bash
    # Execute all unit and integration tests
    npm run test
    ```

-   **Run tests in watch mode:**
    ```bash
    # Re-run tests automatically when files change
    npm run test:watch
    ```

-   **Generate a test coverage report:**
    ```bash
    # The report will be saved in the `coverage/` directory
    npm run test:coverage
    ```

-   **Run End-to-End (E2E) tests:**
    ```bash
    # Executes the Playwright test suite
    npm run test:e2e
    ```

### Build and Compilation Processes

-   **Create a production-ready build:**
    ```bash
    # This will generate an optimized build in the .next/ directory
    npm run build
    ```
-   **Analyze the bundle size:**
    ```bash
    # This will open a browser window with a visualization of the bundle
    npm run build:analyze
    ```
-   **Start the production server:**
    ```bash
    # Run this command after building the application
    npm run start
    ```

### Code Quality and Linting Commands

These commands help maintain code quality and consistency. They are also run automatically as a pre-commit hook.

-   **Run ESLint to find potential issues:**
    ```bash
    npm run lint
    ```

-   **Automatically fix ESLint errors:**
    ```bash
    npm run lint:fix
    ```

-   **Format the entire codebase with Prettier:**
    ```bash
    npm run format
    ```

-   **Perform a TypeScript type check:**
    ```bash
    npm run typecheck
    ```

## 🔌 6. API INTEGRATION GUIDE

This section provides a complete reference for the URL Shortener's REST API, including endpoints, request/response formats, and error handling.

**Base URL:** `/api`

### 1. Create a Short Link

-   **Endpoint:** `POST /api/shorten`
-   **Description:** Creates a new short link.

**Request Body:**
```json
{
  "url": "string (required)",
  "customAlias": "string (optional)"
}
```

**Response (201 Created):**
```json
{
  "shortId": "string",
  "shortUrl": "string",
  "qrDataUrl": "string (Base64-encoded image)",
  "originalUrl": "string",
  "customAlias": "boolean",
  "createdAt": "string (ISO 8601)",
  "message": "URL shortened successfully"
}
```

### 2. Get Analytics Data

-   **Endpoint:** `GET /api/analytics`
-   **Description:** Retrieves aggregated analytics data for the dashboard.

**Response (200 OK):**
```json
{
  "totalLinks": "number",
  "totalClicks": "number",
  "topLinks": [
    {
      "shortId": "string",
      "originalUrl": "string",
      "clickCount": "number",
      "createdAt": "string (ISO 8601)"
    }
  ],
  "clicksLast7Days": [
    {
      "date": "string (YYYY-MM-DD)",
      "count": "number"
    }
  ]
}
```

### 3. List All Links

-   **Endpoint:** `GET /api/links`
-   **Description:** Retrieves a paginated list of all short links.

**Query Parameters:**
-   `page`: The page number to retrieve (default: 1).
-   `limit`: The number of items per page (default: 10).

**Response (200 OK):**
```json
{
  "data": [
    {
      "shortId": "string",
      "originalUrl": "string",
      "clickCount": "number",
      "createdAt": "string (ISO 8601)"
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "totalPages": "number"
  }
}
```

### 4. Delete a Link

-   **Endpoint:** `DELETE /api/links/delete`
-   **Description:** Deletes a short link.
-   **Authentication:** Requires the `SUPABASE_SERVICE_ROLE_KEY` to be configured.

**Request Body:**
```json
{
  "shortId": "string (required)"
}
```

**Response (200 OK):**
```json
{
  "message": "Link deleted successfully"
}
```

### Authentication and Security

-   The API uses a combination of rate limiting and service role keys for security.
-   The `DELETE` endpoint is protected and can only be called from a trusted server-side environment where the `SUPABASE_SERVICE_ROLE_KEY` is available.

### Rate Limiting

-   The API is rate-limited by IP address.
-   The default limit is 5 requests per minute.
-   If the limit is exceeded, the API will respond with an HTTP `429 Too Many Requests` status code.

### Error Handling and Status Codes

-   **`200 OK`**: The request was successful.
-   **`201 Created`**: The resource was successfully created (used for `POST /api/shorten`).
-   **`400 Bad Request`**: The request was malformed (e.g., invalid JSON, validation error).
-   **`404 Not Found`**: The requested resource could not be found.
-   **`409 Conflict`**: The requested custom alias already exists.
-   **`429 Too Many Requests`**: The rate limit has been exceeded.
-   **`500 Internal Server Error`**: An unexpected error occurred on the server.

**Example Error Response (400 Bad Request):**
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Invalid URL format",
  "code": 400
}
```

## 🐳 7. DEPLOYMENT PROCEDURES

This section covers the procedures for deploying the URL Shortener application to various platforms.

### Docker Containerization Commands

Deploying with Docker is the recommended approach for self-hosting, as it provides a consistent and isolated environment.

**1. Build the Docker Image:**
```bash
# This command builds the production-ready image using the multi-stage Dockerfile
docker build -t url-shortener .
```

**2. Run the Docker Container:**
```bash
# Run the container, mapping port 3000 and providing the environment file
docker run -p 3000:3000 --env-file .env.local url-shortener
```

**Using Docker Compose (Recommended for local production simulation):**

**1. Configure the Docker Environment:**
```bash
# Create the Docker-specific environment file
cp .env.docker .env.docker.local
```
-   **Action:** Edit `.env.docker.local` with your production Supabase credentials.

**2. Start the Services:**
```bash
# Build and start the application and database containers in detached mode
docker-compose --env-file .env.docker.local up -d --build
```

**3. Monitor the Services:**
```bash
# View the logs for the application container
docker-compose logs -f app
```

**4. Stop the Services:**
```bash
# Stop and remove the containers
docker-compose down
```

### Platform-Specific Deployment Steps

**Vercel (Recommended for ease of use):**

1.  Fork the repository to your GitHub, GitLab, or Bitbucket account.
2.  Create a new project on Vercel and connect it to your forked repository.
3.  Configure the following environment variables in the Vercel project settings:
    -   `NEXT_PUBLIC_SUPABASE_URL`
    -   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    -   `SUPABASE_SERVICE_ROLE_KEY`
4.  Vercel will automatically build and deploy the application. Subsequent pushes to the `main` branch will trigger new deployments.

**VPS (e.g., DigitalOcean, Linode) with Nginx:**

1.  Install Docker and Docker Compose on your VPS.
2.  Clone the repository and set up your `.env.docker.local` file.
3.  Start the application using `docker-compose up -d --build`.
4.  Install Nginx (`sudo apt-get install nginx`).
5.  Configure Nginx as a reverse proxy to forward requests to the Docker container (running on port 3000).
6.  Set up an SSL certificate using Let's Encrypt (`certbot`).

### Environment Configuration

-   Ensure that all required environment variables are set correctly for the target environment (development, staging, or production).
-   **Never hard-code secrets** like API keys directly in the code. Use environment variables exclusively.
-   For production deployments, ensure `NODE_ENV` is set to `production` to enable all of Next.js's performance optimizations.

### Database Migration Procedures

-   When deploying to a new environment, the database schema must be initialized.
-   Run the `scripts/db-init.sql` script in the Supabase SQL Editor to create the tables and indexes.
-   For schema updates, create a new migration file in the `supabase/migrations/` directory and apply it to your database.

## 🛡️ 8. SECURITY & TESTING IMPLEMENTATION

This section details the security architecture, implementation, and the comprehensive testing strategy employed in the project.

### Security Implementation
The application incorporates a multi-layered security approach to protect against common threats.

- **Input Validation and Sanitization:** All user inputs are rigorously validated on both the client and server using `Zod`. This prevents malformed data and injection attacks. URLs are sanitized to allow only `http` and `https` protocols.
- **Rate Limiting:** A token bucket algorithm, implemented in `lib/rateLimiter.ts`, protects against brute-force attacks and API abuse. The system limits requests to 5 per minute per IP address.
- **Content Security Policy (CSP):** A strict CSP is configured in `next.config.mjs` to mitigate XSS and other injection attacks by controlling which resources the browser is allowed to load.
- **SQL Injection Prevention:** The use of the Supabase client library ensures that all database queries are automatically parameterized, preventing SQL injection vulnerabilities.
- **Secrets Management:** All sensitive information, such as API keys and database credentials, is managed via environment variables and is never exposed to the client-side.

### Testing Strategy
The project follows a comprehensive testing pyramid strategy to ensure code quality, reliability, and maintainability.

- **Unit Testing:** `Vitest` is used for unit tests, focusing on individual functions and utilities in isolation. These tests are located in the `tests/` directory and cover business logic, utility functions, and helper modules.
- **Integration Testing:** Integration tests also use `Vitest` to verify the interactions between different parts of the application, such as API routes and the database layer. These tests ensure that components work together as expected.
- **Component Testing:** `React Testing Library` is used to test React components in a way that resembles how users interact with them. This ensures the UI is accessible, functional, and behaves correctly.
- **End-to-End (E2E) Testing:** `Playwright` is used for E2E tests, which simulate real user scenarios by running tests in a headless browser. These tests cover critical user flows, such as URL shortening, redirection, and viewing analytics.
- **Test Coverage:** The project aims for a test coverage of over 95%. Coverage reports can be generated by running `npm run test:coverage`.

### Quality Assurance and Performance Testing
- **Static Analysis:** ESLint and Prettier are integrated into the development workflow with pre-commit hooks to enforce code style and catch potential errors early.
- **Type Checking:** TypeScript's strict mode is enabled to ensure type safety across the entire codebase.
- **Performance Testing:** Bundle size is analyzed using `webpack-bundle-analyzer`. Lighthouse scores are monitored to ensure high performance, accessibility, and SEO.

## 🔧 9. MAINTENANCE & TROUBLESHOOTING

This section provides guidance on common maintenance tasks and troubleshooting procedures.

### Common Issues and Solutions

**Issue: Supabase connection errors.**
-   **Solution:**
    1.  Verify that the `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` environment variables are correct in your `.env.local` or `.env.docker.local` file.
    2.  Check the Supabase project status page to ensure the service is active.
    3.  If connecting from a local machine, ensure your IP address is whitelisted in Supabase's network settings if you have restrictions enabled.

**Issue: Rate limiting errors (HTTP 429).**
-   **Solution:**
    1.  The default rate limit is 5 requests per minute per IP. Wait for the limit to reset.
    2.  For development or testing, you can adjust the `RATE_LIMIT_PER_MINUTE` environment variable.

**Issue: Custom alias already exists (HTTP 409).**
-   **Solution:** Choose a different custom alias. The one you selected is already in use.

**Issue: Docker container fails to start.**
-   **Solution:**
    1.  Check the container logs for specific errors: `docker-compose logs -f app`.
    2.  Ensure that the `.env.docker.local` file exists and is correctly populated with your Supabase credentials.
    3.  Make sure that port 3000 is not already in use by another application on your host machine.

### Debugging Commands and Techniques

-   **Check Environment Variables in a Running Container:**
    ```bash
    docker-compose exec app printenv
    ```

-   **Access the Application Container's Shell:**
    ```bash
    docker-compose exec app sh
    ```

-   **Test an API Endpoint from the Command Line:**
    ```bash
    curl -X POST http://localhost:3000/api/shorten \
      -H "Content-Type: application/json" \
      -d '{"url":"https://example.com"}'
    ```

### Performance Monitoring

-   **Database Query Performance:** Use the Supabase dashboard to identify and analyze slow queries. Ensure appropriate indexes are in place for frequently queried columns.
-   **API Response Times:** For production environments, integrate with an Application Performance Monitoring (APM) tool like Sentry or Datadog to monitor API response times and identify bottlenecks.
-   **Bundle Size Analysis:** Use the `npm run build:analyze` command to visualize the application's JavaScript bundle size and identify large dependencies that could be optimized.

### Log Analysis and Management

-   In a Docker environment, all application logs are sent to `stdout` and can be viewed with `docker-compose logs -f app`.
-   For production deployments, it is recommended to configure a log drain to forward logs to a centralized logging service (e.g., Logtail, Datadog, Sentry) for long-term storage, analysis, and alerting.

### Update and Upgrade Procedures

-   **Update Dependencies:**
    ```bash
    # Check for outdated packages
    npm outdated

    # Interactively update packages
    npm update
    ```
-   **Upgrade Next.js:** Follow the official Next.js upgrade guides. This typically involves updating the `next` package version in `package.json` and running `npm install`.
-   **Upgrade Supabase:** Supabase manages its own backend upgrades. To update the client library, simply update the `@supabase/supabase-js` package via npm.

## 📋 10. QUICK REFERENCE

This section provides a quick reference for common commands and configurations.

### Common Commands
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm run test         # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage# Generate test coverage report
npm run test:e2e     # Run end-to-end tests

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Automatically fix ESLint errors
npm run format       # Format code with Prettier
npm run typecheck    # Run TypeScript compiler

# Docker
docker-compose up -d --build  # Start all services in detached mode
docker-compose logs -f app    # View logs for the application container
docker-compose down           # Stop and remove containers
```

### Key Environment Variables
-   `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
-   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase project's anonymous key.
-   `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase project's service role key (for admin operations).
-   `RATE_LIMIT_PER_MINUTE`: The number of allowed requests per minute per IP (defaults to 5).

### Key File Locations
-   **Next.js Pages & API Routes:** `/app/`
-   **React Components:** `/components/`
-   **Shared Logic & Utilities:** `/lib/`
-   **Tests:** `/tests/`
-   **Public Assets:** `/public/`
-   **Database Schema Script:** `scripts/db-init.sql`
-   **Docker Configuration:** `Dockerfile`, `docker-compose.yml`
-   **Next.js Configuration:** `next.config.mjs`
-   **Dependencies:** `package.json`
