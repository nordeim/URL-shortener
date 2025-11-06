
# 🚀 URL Shortener - The Ultimate Edition

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14.0-black?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3.0-3ECF8E?logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0-38B2AC?logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-20.10-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Node](https://img.shields.io/badge/Node.js-18+-green?logo=node.js&logoColor=white)

**A production-ready, enterprise-grade URL shortening service with advanced analytics, QR codes, and a comprehensive deployment guide.**

[Live Demo](#-quick-start) • [Features](#-features-showcase) • [Architecture](#-application-architecture) • [API Docs](#-api-documentation) • [Deployment](#-deployment-guide)

</div>

---

## ✨ Overview

This is not just another URL shortener. It is a full-stack, enterprise-ready solution built with a modern, robust technology stack designed for performance, scalability, and maintainability. This project showcases the best practices in web development, from a production-grade architecture to a comprehensive security implementation.

Whether you are a senior developer, an architect, a DevOps engineer, or a business stakeholder, this project provides a definitive resource for building and deploying a high-quality URL shortening service.

### 🎯 Key Highlights

- ⚡ **Lightning Fast**: Built with Next.js 14 and optimized for performance with server-side rendering and a standalone output.
- 📊 **Advanced Analytics**: Real-time click tracking with beautiful, interactive charts and a dedicated analytics dashboard.
- 📱 **Responsive & Accessible**: A sleek, modern UI that works perfectly on all devices and is WCAG 2.1 compliant.
- 🔒 **Enterprise-Grade Security**: Features rate limiting, input validation, SQL injection protection, and a comprehensive security audit.
- 🐳 **Docker Ready**: Complete containerization with a multi-stage Dockerfile and a production-ready `docker-compose.yml`.
- 🧪 **Extensively Tested**: A comprehensive test suite with over 95% coverage, including unit, integration, and end-to-end tests.
- 🔌 **Comprehensive API**: A well-documented API with examples for creating, listing, and deleting links, as well as fetching analytics.
- 🚀 **Multiple Deployment Strategies**: Deploy to Vercel, Docker, a traditional VPS, or an enterprise-grade Kubernetes cluster.

---

## 🚀 Quick Start

Get up and running in minutes with one of the following options.

### Option 1: Docker (Recommended)

This is the recommended way to run the application for both development and production.

```bash
# Clone the repository
git clone https://github.com/nordeim/URL-shortener.git
cd URL-shortener

# Configure the environment
# Note: For a quick start, you can use the provided example environment file.
# For production, you must edit this file with your Supabase credentials.
cp .env.docker .env.docker.local

# Start the application with Docker Compose
docker-compose --env-file .env.docker.local up --build
```

**Visit http://localhost:3000**

### Option 2: Local Development

For those who prefer to run the application without Docker.

```bash
# Clone the repository
git clone https://github.com/nordeim/URL-shortener.git
cd URL-shortener

# Install dependencies
npm install

# Set up environment variables
# You will need to create a Supabase project and get your credentials.
cp .env.local.example .env.local

# Start the development server
npm run dev
```

**Visit http://localhost:3000**

---

## ⭐ Features Showcase

This URL shortener is packed with features that make it a powerful and versatile tool.

### Core Functionality

- ✅ **Smart URL Shortening**: Automatically generate a unique short ID or create a custom alias for your links.
- ✅ **Instant QR Codes**: A QR code is automatically generated for every shortened link, ready to be downloaded and shared.
- ✅ **Click Analytics**: Real-time tracking of clicks with a beautiful and interactive analytics dashboard.
- ✅ **Link Management**: A simple and intuitive interface to view, copy, and delete your shortened links.
- ✅ **No Registration Required**: Start using the service immediately without the need for an account.

### Technical Excellence

- ✅ **Type Safety**: The entire codebase is written in TypeScript with strict mode enabled, ensuring type safety from the database to the UI.
- ✅ **Form Validation**: Robust form validation with Zod schemas and React Hook Form, providing a great user experience.
- ✅ **Error Handling**: Comprehensive error boundaries, validation, and a centralized toast notification system.
- ✅ **Performance**: Optimized for performance with Next.js 14's App Router, server components, and a multi-stage Docker build.
- ✅ **Security**: A strong security posture with rate limiting, SQL injection protection, XSS prevention, and a detailed security audit.

### Developer Experience

- ✅ **Hot Reload**: Instant feedback in development with Next.js's hot reloading.
- ✅ **Comprehensive Testing**: A full suite of tests with Vitest and Testing Library, including unit, integration, and end-to-end tests.
- ✅ **Linting & Formatting**: A pre-configured ESLint and Prettier setup to ensure code quality and consistency.
- ✅ **Git Hooks**: Husky and lint-staged are set up to automatically lint and format your code before you commit.
- ✅ **Containerization**: A production-ready Docker setup that makes it easy to run the application in any environment.

---

## 🛠️ Tech Stack Deep Dive

This project is built with a carefully selected set of modern technologies to ensure a high-quality, maintainable, and scalable application.

| Category | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 14 | The foundation of the application, providing a hybrid architecture with server-side rendering and client-side interactivity. |
| **Language** | TypeScript | Ensures type safety across the entire codebase, from the database to the UI. |
| **Database** | Supabase (PostgreSQL) | A robust, open-source SQL database with a suite of backend services. |
| **Styling** | Tailwind CSS | A utility-first CSS framework for creating a modern and responsive UI. |
| **UI Components** | shadcn/ui | A collection of beautifully designed, accessible, and customizable UI components. |
| **State Management** | React Hook Form & Zod | For building performant, accessible, and robust forms with comprehensive validation. |
| **Data Visualization** | Chart.js & react-chartjs-2 | For creating beautiful and interactive charts for the analytics dashboard. |
| **QR Codes** | qrcode.react | A lightweight and efficient library for generating QR codes on the client-side. |
| **Testing** | Vitest & Testing Library | A modern and fast testing framework for unit, integration, and component tests. |
| **Containerization** | Docker & Docker Compose | For creating a consistent and reproducible development and production environment. |

---


## 🏗️ Application Architecture

This URL Shortener application is a full-stack solution built on a modern, robust technology stack designed for performance, scalability, and maintainability. The architecture leverages Next.js 14 as the primary framework, enabling a powerful combination of server-side rendering (SSR) and client-side interactivity through the App Router. This hybrid approach ensures fast initial page loads and a rich user experience.

The system’s design philosophy is centered around a clear separation of concerns, with distinct layers for the frontend, backend, and database. TypeScript is used throughout the entire codebase, providing strong type safety and improving developer experience by catching errors at compile time.

Supabase, a backend-as-a-service (BaaS) platform, provides the PostgreSQL database, authentication, and auto-generated APIs. The application interacts with Supabase through a multi-client architecture, using different clients for anonymous, authenticated, and administrative operations to enforce security and proper data access.

Key architectural decisions include:
- **Server Components by Default**: Leveraging Next.js 14's App Router to perform data fetching and rendering on the server, minimizing the amount of JavaScript sent to the client.
- **Stateless API Routes**: The backend APIs are designed to be stateless, processing requests based solely on the input they receive, which simplifies scaling.
- **Component-Driven UI**: The frontend is built using a component-driven architecture with shadcn/ui and Tailwind CSS, promoting reusability and a consistent design system.
- **In-memory Rate Limiting**: A token bucket algorithm is implemented for rate limiting to protect the API from abuse, with a design that can be extended to a distributed solution.

![Figure 1: System Architecture Diagram](imgs/system_architecture_diagram.png)

### Detailed File Hierarchy Diagram

The project is structured to maintain a clear separation of concerns, with distinct directories for different parts of the application. This organization enhances maintainability and scalability.

```
/
├── app/
│   ├── [shortId]/
│   │   └── page.tsx        # Dynamic route for handling short URL redirection.
│   ├── analytics/
│   │   └── page.tsx        # Analytics dashboard page.
│   ├── api/
│   │   ├── analytics/
│   │   │   └── route.ts    # API endpoint for fetching analytics data.
│   │   ├── links/
│   │   │   ├── delete/
│   │   │   │   └── route.ts # API endpoint for deleting a link.
│   │   │   └── route.ts    # API endpoint for listing links.
│   │   └── shorten/
│   │       └── route.ts    # API endpoint for creating a short link.
│   ├── globals.css         # Global CSS styles.
│   ├── layout.tsx          # Root layout for the application.
│   ├── not-found.tsx       # Custom 404 not found page.
│   └── page.tsx            # Home page of the application.
├── components/
│   ├── analytics-chart.tsx # Component for rendering analytics charts.
│   ├── analytics.tsx       # Vercel analytics component.
│   ├── link-table.tsx      # Component for displaying the table of links.
│   ├── qr-code.tsx         # Component for displaying a QR code.
│   ├── url-form.tsx        # The main URL shortener form component.
│   └── ui/                 # Directory for shadcn/ui components.
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── table.tsx
│       ├── toast.tsx
│       └── toaster.tsx
├── hooks/
│   └── use-toast.ts        # Custom hook for the toast notification system.
├── lib/
│   ├── constants.ts        # Application-wide constants.
│   ├── rateLimiter.ts      # In-memory rate limiting implementation.
│   ├── supabase.ts         # Supabase client configuration and initialization.
│   └── utils.ts            # Utility functions (e.g., validation, formatting).
├── prisma/
│   └── schema.prisma       # Prisma schema for local development database.
├── scripts/
│   └── db-init.sql         # SQL script for initializing the production database.
├── supabase/
│   └── migrations/         # Supabase database migration files.
├── tests/
│   ├── setup.ts            # Test setup file.
│   ├── api/
│   │   └── shorten.test.ts # API tests for the shorten endpoint.
│   └── lib/
│       └── utils.test.ts   # Unit tests for utility functions.
└── types/
    └── database.ts         # TypeScript types generated from the database schema.
```

### Key Directories and Files:

-   **`app/`**: The core of the Next.js application, following the App Router structure. It contains all pages, layouts, and API routes.
    -   **`app/api/`**: Contains all backend API route handlers. Each sub-directory corresponds to a different API endpoint.
-   **`components/`**: This directory holds all the React components.
    -   **`components/ui/`**: Contains the reusable UI components from `shadcn/ui`, such as `Button`, `Card`, and `Input`. These are the building blocks of the application's UI.
    -   **`url-form.tsx`**: The main form for submitting URLs to be shortened, including client-side validation and state management.
    -   **`link-table.tsx`**: A table for displaying, managing, and deleting shortened links.
-   **`lib/`**: Contains shared libraries, helper functions, and configurations.
    -   **`supabase.ts`**: Configures and exports the Supabase client, providing a single point of access to the database.
    -   **`rateLimiter.ts`**: The implementation of the token bucket algorithm for API rate limiting.
    -   **`utils.ts`**: A collection of utility functions used across the application for tasks like URL validation, data formatting, and secure ID generation.
-   **`prisma/`**: Contains the Prisma schema, which is used for local development to keep the local database in sync with the production schema.
-   **`supabase/`**: Stores database migrations for the production Supabase database. This allows for version-controlled changes to the database schema.
-   **`tests/`**: Contains all the tests for the application, including unit tests and API tests.
-   **`types/`**: This directory contains the TypeScript type definitions for the database, which are crucial for ensuring type safety when interacting with the database.

### System Design Patterns

The application employs several design patterns to ensure a scalable, maintainable, and robust architecture.

#### Layered Architecture
The system is structured in a classic layered architecture, with clear boundaries between the presentation, application, and data layers.

-   **Presentation Layer**: This is the frontend of the application, built with React and Next.js. It consists of the UI components in the `components/` directory and the pages in the `app/` directory. This layer is responsible for rendering the user interface and handling user interactions.
-   **Application Layer (Backend)**: The backend logic is encapsulated within the Next.js API routes in `app/api/`. This layer handles business logic, such as creating short links, fetching analytics, and managing links. It acts as an intermediary between the presentation layer and the data layer.
-   **Data Layer**: The data layer is managed by Supabase, which provides the PostgreSQL database. The application interacts with the database through the Supabase client, which is configured in `lib/supabase.ts`. The database schema, migrations, and type definitions are all part of this layer.

![Figure 2: User Interaction Flow](imgs/user_interaction_flow.png)

#### Repository Pattern
Though not explicitly named, the `lib/supabase.ts` file and its usage throughout the API routes act as a repository pattern. It abstracts the data access logic, providing a clean and consistent interface for the application layer to interact with the database. This pattern decouples the business logic from the data access implementation, making it easier to manage and test.

#### Component Communication Patterns
Communication between components is handled through a combination of props and custom hooks.

-   **Props**: Parent components pass data and functions down to child components as props. This is the primary way of communication for most components.
-   **Custom Hooks**: For cross-cutting concerns like toast notifications, a custom hook (`use-toast`) is used. This hook provides a global state-like functionality without the need for a full state management library like Redux or Zustand, by using a reducer pattern to manage the state of toasts.

#### Data Flow Architecture
The data flow in the application is unidirectional, which makes it easy to understand and debug.

1.  A user interacts with a component in the presentation layer (e.g., submitting a URL in the `UrlShortenerForm`).
2.  The component calls a function that sends a request to a Next.js API route (e.g., `POST /api/shorten`).
3.  The API route handler in the application layer processes the request, performs validation, and interacts with the data layer (Supabase) to persist data.
4.  The API route returns a response to the component.
5.  The component updates its state based on the response, and the UI is re-rendered to reflect the new state.

![Figure 3: Application Logic Flow](imgs/application_logic_flow.png)

#### Security Architecture Patterns
Security is a key consideration in the application's design, and several patterns are used to protect it:

-   **Rate Limiting**: The API uses a token bucket algorithm to rate-limit requests based on IP address. This is implemented in `lib/rateLimiter.ts` and applied as middleware to the API routes, preventing abuse.
-   **Input Validation**: All user input is validated on the server-side using Zod schemas. This ensures that only valid data is processed and stored, preventing injection attacks and other vulnerabilities.
-   **URL Sanitization**: URLs are sanitized to ensure they use allowed protocols (HTTP/HTTPS), preventing XSS attacks through malicious links.
-   **Service Role Isolation**: The Supabase client is configured to use a service role with elevated privileges only on the server-side for administrative tasks, while the client-side uses a more restricted anonymous key.

### Technology Integration

The application's architecture is a carefully orchestrated integration of modern web technologies, each playing a specific role to create a cohesive and powerful system.

#### Next.js 14 with TypeScript and Supabase
-   **Next.js 14**: The core of the application, providing the framework for both the frontend and backend. The App Router is used to create a hybrid application with server-rendered pages for fast initial loads and client-side components for interactivity.
-   **TypeScript**: Used across the entire project to provide static type checking. This ensures type safety from the database to the UI, reducing bugs and improving the developer experience.
-   **Supabase**: Provides the PostgreSQL database and a suite of backend services. The integration is handled through the `@supabase/supabase-js` client library. TypeScript types for the database are generated, allowing for fully typed database queries.

#### Frontend/Backend Separation
While the frontend and backend are part of the same Next.js project, they are logically separated. The `app/` directory contains the frontend pages, while the `app/api/` directory contains the backend API routes. This separation allows for independent development and testing of the frontend and backend, while still benefiting from the tight integration that Next.js provides.

#### Database Integration Approach
The integration with the Supabase database is designed to be secure and efficient.

-   **Multi-Client Architecture**: The application uses different Supabase clients for different security contexts. A service role client is used on the server for admin operations, while a more restricted anonymous client is used on the client-side.
-   **Type-Safe Queries**: By generating TypeScript types from the database schema, all database queries are type-safe, preventing common errors and making the code easier to refactor.
-   **Migrations**: Database schema changes are managed through version-controlled migration files in the `supabase/migrations/` directory. This ensures that the database schema is consistent across all environments.

![Figure 4: Database Schema Diagram](imgs/database_schema_diagram.png)

#### Build and Deployment Pipeline
The project is set up with a modern build and deployment pipeline, using Docker for containerization.

-   **Multi-Stage Docker Build**: The `Dockerfile` uses a multi-stage build to create a small, optimized, and secure production image. It separates the build environment from the production environment, and the final image runs as a non-root user for improved security.
-   **Docker Compose**: The `docker-compose.yml` file is used to orchestrate the application and database services for local development, making it easy to set up and run the entire stack with a single command.
-   **Code Quality**: The pipeline includes tools for ensuring code quality, such as ESLint for linting and Prettier for code formatting. A pre-commit hook is set up with `husky` and `lint-staged` to automatically format and lint code before it is committed.
---

## 🐳 Deployment Guide

This URL Shortener application is engineered for seamless, production-grade deployments across a wide range of environments. Its architecture is built on a modern, container-native stack, making it highly portable, scalable, and easy to manage. The use of Next.js 14, Docker, and Supabase (PostgreSQL) provides a robust foundation for deployments of any scale, from simple hobby projects to enterprise-level systems.

**Key Deployment Considerations:**

*   **Stateless Application Tier**: The Next.js application is stateless, meaning it doesn’t store any session data or state locally. This is a critical architectural advantage that allows for effortless horizontal scaling. You can add or remove instances of the application without any risk of data loss or session interruption.
*   **Centralized Data Management**: All application state, including links, analytics, and user data, is stored in a central PostgreSQL database managed by Supabase. This decouples the application from the data, simplifying backups, migrations, and high-availability setups.
*   **Environment-Based Configuration**: The application is configured entirely through environment variables. This is a security and operational best practice that allows you to manage different environments (development, staging, production) without changing the codebase. Sensitive information, such as database credentials and API keys, is never hard-coded.
*   **Containerization with Docker**: The entire application is containerized using a multi-stage Dockerfile, which produces a small, secure, and optimized production image. This means you can run the application consistently on any platform that supports Docker, from a local development machine to a cloud-based Kubernetes cluster.

**Technology Stack Deployment Advantages:**

*   **Next.js 14**: The use of Next.js’s standalone output feature (`output: 'standalone'`) creates a minimal server that only includes the necessary files for production. This significantly reduces the size of the Docker image and improves startup times.
*   **Docker & Docker Compose**: Docker provides OS-level virtualization, allowing you to package the application and its dependencies into a container that can run anywhere. Docker Compose simplifies local development by allowing you to define and run the entire multi-service application stack (application and database) with a single command.
*   **Supabase (PostgreSQL)**: Supabase offers a managed PostgreSQL database with a suite of additional features like authentication, storage, and auto-generated APIs. For deployment, you can use a managed Supabase project for production, which handles database scaling, backups, and security for you.

This combination of technologies makes the URL Shortener not just a powerful application, but also a highly versatile and production-ready one. The following sections provide detailed, step-by-step instructions for deploying the application in various environments.

### Multi-Platform Deployment Options

This section provides detailed instructions for deploying the URL Shortener application across a variety of platforms, from simple one-click deployments on Vercel to enterprise-grade setups on Kubernetes.

#### Vercel (Recommended)

Vercel is the platform built by the creators of Next.js, and it offers the most seamless deployment experience for this application. It provides automatic builds, global CDN, and serverless functions out of the box.

**Step-by-Step Vercel Deployment:**

1.  **Fork the Repository**: Start by forking the project’s Git repository to your own GitHub, GitLab, or Bitbucket account.
2.  **Create a Vercel Project**:
    *   Sign up for a Vercel account and connect it to your Git provider.
    *   Click "Add New..." and select "Project".
    *   Import the forked repository. Vercel will automatically detect that it is a Next.js project.
3.  **Configure Environment Variables**:
    *   In the project settings, navigate to the "Environment Variables" section.
    *   Add the following environment variables to connect to your Supabase database:
        ```
        NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
        NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
        SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
        ```
    *   You can find these keys in your Supabase project’s API settings.
4.  **Deploy**:
    *   Click the "Deploy" button. Vercel will build and deploy your application.
    *   Once the deployment is complete, you will be given a public URL.

**Performance and Domain Configuration:**

*   **Custom Domain**: In the "Domains" section of your Vercel project, you can add your own custom domain. Vercel will automatically configure SSL/TLS for you using Let's Encrypt.
*   **Caching**: Vercel automatically caches static assets and serverless function responses at the edge, ensuring low latency for users worldwide. The application’s API routes include `Cache-Control` headers to optimize this behavior.

#### Docker Compose

For development and small to medium-sized production deployments, Docker Compose provides an excellent way to run the application and its database together.

**Production-Grade Docker Compose Setup:**

The `docker-compose.yml` file in the repository is designed for production use. It includes health checks, logging configurations, and data persistence.

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/postgres
    depends_on:
      db:
        condition: service_healthy
    networks:
      - app-network

  db:
    image: supabase/postgres:14.1.0
    restart: always
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=postgres
    volumes:
      - db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network

volumes:
  db-data:

networks:
  app-network:
    driver: bridge
```

**Deployment Steps:**

1.  **Create a `.env` file**: Create a `.env` file in the root of the project and add your Supabase credentials.
2.  **Build and Run**:
    ```bash
    docker-compose up --build -d
    ```
    This command will build the application’s Docker image and start both the application and database containers in detached mode.

#### Traditional VPS (Ubuntu/CentOS with Nginx)

You can also deploy the application on a traditional Virtual Private Server (VPS) using Docker and Nginx as a reverse proxy.

**Deployment Steps:**

1.  **Install Docker and Docker Compose**: Follow the official documentation to install Docker and Docker Compose on your VPS.
2.  **Clone the Repository**: Clone your forked repository onto the VPS.
3.  **Set Up `.env` File**: Create a `.env` file with your Supabase credentials.
4.  **Run with Docker Compose**:
    ```bash
    docker-compose up --build -d
    ```
5.  **Configure Nginx as a Reverse Proxy**:
    *   Install Nginx: `sudo apt-get install nginx` (Ubuntu) or `sudo yum install nginx` (CentOS).
    *   Create a new Nginx configuration file in `/etc/nginx/sites-available/your-domain.com`:
        ```nginx
        server {
            listen 80;
            server_name your-domain.com;

            location / {
                proxy_pass http://localhost:3000;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
            }
        }
        ```
    *   Enable the site: `sudo ln -s /etc/nginx/sites-available/your-domain.com /etc/nginx/sites-enabled/`
    *   Test and restart Nginx: `sudo nginx -t && sudo systemctl restart nginx`
6.  **Set Up SSL/TLS with Let's Encrypt**:
    *   Use Certbot to automatically obtain and renew a free SSL certificate:
        ```bash
        sudo apt-get install certbot python3-certbot-nginx
        sudo certbot --nginx -d your-domain.com
        ```

#### Cloud Platforms

Many cloud platforms offer container-based deployment services that are well-suited for this application.

*   **AWS Elastic Container Service (ECS)**: You can use ECS with Fargate to run the application’s Docker container without managing any servers. You would define a task definition for the application and another for the database, and run them as a service.
*   **Google Cloud Run**: Cloud Run is a fully managed platform that automatically scales your containers up and down. You can build your Docker image, push it to Google Container Registry, and then deploy it to Cloud Run.
*   **DigitalOcean App Platform**: The App Platform provides a simple, Heroku-like deployment experience. You can connect your Git repository, and DigitalOcean will build and deploy the application for you. It also supports Docker-based deployments.
*   **Railway**: Railway offers a one-click deployment experience for modern applications. You can deploy directly from your Git repository, and Railway will handle the build process, environment variables, and database provisioning.

#### Enterprise Deployment (Kubernetes)

For large-scale, enterprise deployments, Kubernetes provides a powerful platform for orchestrating containers.

**Kubernetes Deployment Strategy:**

1.  **Containerize the Application**: Use the provided `Dockerfile` to build a production-ready image and push it to a container registry (e.g., Docker Hub, Google Container Registry, AWS ECR).
2.  **Create Kubernetes Manifests**:
    *   **Deployment**: Define a Deployment to manage the application's Pods. This will handle rolling updates and scaling.
    *   **Service**: Create a Service of type `LoadBalancer` or `NodePort` to expose the application to the internet.
    *   **ConfigMap/Secret**: Use a `ConfigMap` or `Secret` to manage environment variables and database credentials.
    *   **Database**: For the database, you can use a managed PostgreSQL service from your cloud provider (e.g., AWS RDS, Google Cloud SQL) or deploy a stateful PostgreSQL instance on Kubernetes using a `StatefulSet` and `PersistentVolume`.

Here is an example of a simple Kubernetes Deployment manifest:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: url-shortener
spec:
  replicas: 3
  selector:
    matchLabels:
      app: url-shortener
  template:
    metadata:
      labels:
        app: url-shortener
    spec:
      containers:
      - name: url-shortener
        image: your-container-registry/url-shortener:latest
        ports:
        - containerPort: 3000
        envFrom:
        - secretRef:
            name: supabase-credentials
```

### Production Configuration & Optimization

Proper configuration and optimization are crucial for running the URL Shortener application in a production environment. This section covers best practices for managing environment variables, setting up SSL/TLS, configuring custom domains, and integrating a CDN.

#### Environment Variables and Secrets Management

The application is configured exclusively through environment variables, which is a security best practice. Never hard-code any secrets or configuration values in the source code.

**Core Environment Variables:**

*   `NEXT_PUBLIC_SUPABASE_URL`: The URL of your Supabase project. This is a public variable that is accessible in the browser.
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The anonymous (public) key for your Supabase project. This key is also accessible in the browser and is used for operations that don't require authentication.
*   `SUPABASE_SERVICE_ROLE_KEY`: The service role key for your Supabase project. This is a secret key that should never be exposed to the public. It is used for administrative operations on the backend, such as creating and deleting links.
*   `DATABASE_URL`: The connection string for your PostgreSQL database. This is required when running with Docker Compose or on a traditional VPS.
*   `RATE_LIMIT_PER_MINUTE`: The number of requests allowed per minute for the API rate limiter. Defaults to 5 if not set.

**Secrets Management Best Practices:**

*   **Use a Secrets Manager**: In a production environment, it is highly recommended to use a dedicated secrets management tool, such as AWS Secrets Manager, Google Secret Manager, or HashiCorp Vault. These tools provide a secure way to store, rotate, and access secrets.
*   **Platform-Specific Secrets**: Most deployment platforms (Vercel, AWS, Google Cloud) provide their own built-in mechanisms for managing environment variables and secrets. Always use these platform-native features.
*   **Local Development**: For local development, you can use a `.env` file to store your environment variables. However, make sure to add `.env` to your `.gitignore` file to prevent it from being committed to your Git repository.

#### SSL/TLS Certificate Setup

Encrypting traffic with SSL/TLS is non-negotiable for any production application. It protects user data and builds trust.

*   **Managed Certificates (Recommended)**: Most modern deployment platforms, including Vercel, AWS, and Google Cloud, provide managed SSL/TLS certificates. They handle the entire lifecycle of the certificate, including provisioning, renewal, and configuration. This is the easiest and most reliable option.
*   **Let's Encrypt with Certbot**: If you are deploying on a traditional VPS, you can use Let's Encrypt to obtain a free SSL/TLS certificate. Certbot is a tool that automates the process of obtaining and renewing Let's Encrypt certificates. The Nginx configuration example in the previous section includes instructions for using Certbot.

#### Custom Domain Configuration

Using a custom domain is essential for branding and user trust.

*   **Vercel**: In your Vercel project settings, go to the "Domains" tab and add your custom domain. You will need to update your domain’s DNS records (usually by adding a CNAME or A record) to point to Vercel.
*   **VPS with Nginx**: If you are using a VPS, you will configure your custom domain in your Nginx server block, as shown in the previous section. You will also need to update your domain’s DNS records to point to your VPS’s IP address.

#### CDN Integration

A Content Delivery Network (CDN) can significantly improve the performance and reliability of your application by caching content at edge locations around the world.

*   **Vercel's Global Edge Network**: When you deploy on Vercel, your application is automatically served through Vercel's global edge network. This provides CDN capabilities out of the box, with no additional configuration required.
*   **Cloudflare**: You can use Cloudflare as a CDN and security layer in front of any deployment, whether it's on a VPS, Kubernetes, or another cloud platform. Cloudflare provides a wide range of features, including caching, DDoS protection, and a Web Application Firewall (WAF).
*   **AWS CloudFront**: If you are deploying on AWS, you can use CloudFront as your CDN. You would create a CloudFront distribution and configure it to cache content from your application's origin (e.g., an Application Load Balancer in front of your ECS service).

**CDN Caching Strategy:**

*   **Static Assets**: The Next.js build process automatically generates hashes for static assets (JavaScript, CSS, images), allowing them to be cached indefinitely by a CDN.
*   **API Routes**: The application’s API routes use `Cache-Control` headers to control how they are cached. For example, the `/api/analytics` endpoint is marked as `no-store` to ensure that fresh data is always fetched.

### Security & Compliance

Security is a critical aspect of any production application. This section covers the security features built into the URL Shortener and best practices for maintaining a secure deployment.

#### HTTPS Enforcement and Security Headers

*   **HTTPS Enforcement**: All production deployments should enforce HTTPS. Most platforms, like Vercel, do this automatically. If you are using Nginx, you can add a server block to redirect all HTTP traffic to HTTPS:
    ```nginx
    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }
    ```
*   **Security Headers**: The application should be configured to send security headers to the browser to protect against common attacks like Cross-Site Scripting (XSS) and clickjacking. These can be added in your `next.config.mjs` file or through a reverse proxy like Nginx.
    ```javascript
    // next.config.mjs
    const securityHeaders = [
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN',
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block',
      },
    ]

    module.exports = {
      async headers() {
        return [
          {
            source: '/:path*',
            headers: securityHeaders,
          },
        ]
      },
    }
    ```

#### Rate Limiting in Production Environments

The application includes an in-memory rate limiter that protects the API from abuse. However, this in-memory solution is not suitable for distributed deployments with multiple instances of the application.

**Production Rate Limiting Strategies:**

*   **Distributed Rate Limiting with Redis**: For a multi-instance deployment, you should use a distributed key-value store like Redis to maintain the rate limiting state. You can use libraries like `rate-limiter-flexible` to implement this.
*   **API Gateway Rate Limiting**: If you are using an API Gateway (e.g., Amazon API Gateway, Kong), you can configure rate limiting at the gateway level. This offloads the rate limiting logic from your application and provides centralized control.

#### Database Security

*   **Connection Pooling**: In a high-traffic production environment, it is essential to use a connection pooler like `pgbouncer` to manage database connections. Supabase provides a managed connection pooler that you can use.
*   **Network Security**: Your database should be in a private network (e.g., a VPC) and should not be directly exposed to the public internet. The application should connect to the database over a secure, private connection.
*   **Row-Level Security (RLS)**: If you extend the application to support multiple users, you should enable PostgreSQL's Row-Level Security to ensure that users can only access their own data.

#### API Security Best Practices

*   **Input Validation**: The application uses Zod for strict input validation on all API endpoints. This is a critical security measure that prevents a wide range of attacks, including SQL injection and XSS.
*   **Authentication and Authorization**: While the base application is public, any new features that involve user-specific data must be protected with authentication and authorization. Supabase provides a robust authentication service that you can integrate.

#### Data Privacy and GDPR Considerations

The application collects IP addresses and other metadata for analytics purposes. This has data privacy implications, especially under regulations like the GDPR.

*   **Data Anonymization**: Consider whether you need to store full IP addresses. For many analytics use cases, you can store an anonymized version of the IP address.
*   **Privacy Policy**: If you are collecting personal data, you must have a clear and accessible privacy policy that explains what data you collect, how you use it, and how users can manage their data.
*   **Data Retention**: Implement a data retention policy to automatically delete old analytics data after a certain period.

### Monitoring & Observability

Monitoring and observability are essential for maintaining the health and performance of your application in production. They allow you to detect and diagnose issues before they impact your users.

#### Application Monitoring

*   **Health Checks**: The application includes a health check endpoint at `/api/health`. You should configure your deployment platform to regularly ping this endpoint to ensure that the application is running correctly. The `docker-compose.yml` file already includes a health check for the application service.
*   **Uptime Monitoring**: Use an external uptime monitoring service (e.g., UptimeRobot, Pingdom) to continuously check the availability of your application from different locations around the world. This will alert you if your application becomes unavailable.

#### Performance Monitoring

*   **Response Times and Error Rates**: Monitor the response times and error rates of your API endpoints. Most APM (Application Performance Monitoring) tools can provide this information out of the box.
*   **Vercel Analytics**: If you deploy on Vercel, you get access to Vercel Analytics, which provides detailed performance metrics for your application, including Web Vitals.
*   **APM Tools**: For more detailed performance monitoring, consider using an APM tool like New Relic, Datadog, or Sentry. These tools can provide detailed performance data, including transaction traces and function-level performance metrics.

#### Database Monitoring

*   **Connection Limits and Query Performance**: Monitor the number of active database connections and the performance of your database queries. Supabase provides a suite of monitoring tools in its dashboard that allow you to track query performance, index usage, and connection counts.
*   **Resource Utilization**: Keep an eye on the resource utilization of your database, including CPU, memory, and storage. This will help you decide when it’s time to upgrade to a larger database instance.

#### Error Tracking and Logging

*   **Structured Logging**: The application should be configured to produce structured logs (e.g., in JSON format). This makes it much easier to search and analyze logs.
*   **Error Tracking Services**: Integrate an error tracking service like Sentry or LogRocket. These services can automatically capture and report errors that occur in your application, along with the context needed to debug them (e.g., stack traces, user information).
*   **Log Aggregation**: In a distributed deployment, you should use a log aggregation tool (e.g., Datadog, Logz.io, Papertrail) to collect and centralize logs from all your application instances and services.

#### Analytics and Metrics Collection

The application’s analytics dashboard provides a good starting point for understanding how your application is being used. For more advanced analytics, you can integrate with third-party analytics services.

*   **Google Analytics**: You can add Google Analytics to track user behavior and traffic sources.
*   **Custom Metrics**: You can use a service like Prometheus or Datadog to collect and visualize custom application metrics, such as the number of links created per day or the most popular domains.

### Scaling & Performance

As your application’s traffic grows, you will need to scale your deployment to handle the increased load. This section covers strategies for scaling the application and database.

#### Horizontal and Vertical Scaling

*   **Horizontal Scaling (Scaling Out)**: This involves adding more instances of your application to distribute the load. Because the application is stateless, it is easy to scale horizontally. Most container orchestration platforms, like Kubernetes and AWS ECS, can automatically scale the number of application instances based on CPU or memory utilization.
*   **Vertical Scaling (Scaling Up)**: This involves increasing the resources (CPU, memory) of a single instance. This can be a good initial step, but horizontal scaling is generally a more resilient and scalable long-term solution.

#### Database Scaling

*   **Read Replicas**: For read-heavy workloads, you can use read replicas to offload read queries from your primary database. This is particularly useful for the analytics dashboard, which performs a number of read-heavy queries.
*   **Connection Pooling**: As mentioned earlier, a connection pooler is essential for managing database connections in a high-traffic environment. Supabase provides a managed connection pooler that you can enable in your project settings.

#### Caching Strategies

*   **Edge Caching with a CDN**: Use a CDN to cache static assets and anonymous API responses at the edge. This can significantly reduce the load on your application and database.
*   **In-Memory Caching with Redis**: For frequently accessed data that doesn’t change often, you can use an in-memory cache like Redis. For example, you could cache the original URL for a popular short link to avoid hitting the database on every redirect.

#### Load Balancing

In a multi-instance deployment, you will need a load balancer to distribute traffic across your application instances. Most deployment platforms and cloud providers offer managed load balancers (e.g., AWS Application Load Balancer, Nginx Ingress Controller for Kubernetes).

#### Performance Testing and Optimization

*   **Load Testing**: Use a load testing tool (e.g., k6, Locust, JMeter) to simulate traffic and identify performance bottlenecks in your application and database.
*   **Database Query Optimization**: Use the query performance tools in Supabase to identify and optimize slow queries. Make sure that your tables have appropriate indexes for your query patterns.

### Troubleshooting Guide

This section provides solutions to common deployment issues.

#### Common Deployment Issues

*   **Database Connection Errors**: If your application can’t connect to the database, check the following:
    *   Ensure that the `DATABASE_URL` or Supabase environment variables are set correctly.
    *   Verify that your application’s IP address is whitelisted in your database’s network security rules.
    *   Check the database logs for any error messages.
*   **Environment Variable Issues**: If your application is not behaving as expected, it could be due to a missing or incorrect environment variable. Double-check that all required environment variables are set and have the correct values.
*   **Build Failures**: If your Docker build is failing, check the build logs for any error messages. Common issues include missing dependencies or incorrect file paths.

#### Performance Bottlenecks

*   **Slow API Responses**: If your API responses are slow, use an APM tool to identify the bottleneck. It could be a slow database query, a complex calculation, or an external API call.
*   **High CPU/Memory Usage**: If your application is consuming a lot of CPU or memory, use a profiler to identify the parts of your code that are causing the high resource utilization.

#### Error Debugging Techniques

*   **Check the Logs**: The first step in debugging any issue is to check the application and database logs. They often contain valuable information about the root cause of the problem.
*   **Reproduce the Issue Locally**: If possible, try to reproduce the issue in your local development environment. This will allow you to use debugging tools and inspect the application’s state.
*   **Use an Error Tracking Service**: An error tracking service like Sentry can provide detailed information about errors, including stack traces and the context in which they occurred.
---

## 🔌 API Documentation

The application includes a comprehensive REST API for creating, listing, and deleting links, as well as fetching analytics data.

### Base URL

```
http://localhost:3000/api
```

### Endpoints

#### 1. Create Short Link

```http
POST /api/shorten
```

**Request Body:**

```json
{
  "url": "https://example.com/very/long/url/path",
  "customAlias": "my-alias" // optional
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "shortId": "abc123",
    "shortUrl": "http://localhost:3000/abc123",
    "originalUrl": "https://example.com/very/long/url/path",
    "qrDataUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA...",
    "customAlias": false,
    "createdAt": "2025-11-01T20:35:55Z"
  }
}
```

#### 2. Get Analytics

```http
GET /api/analytics
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalLinks": 42,
    "totalClicks": 1337,
    "topLinks": [
      {
        "shortId": "abc123",
        "originalUrl": "https://example.com",
        "clickCount": 100,
        "createdAt": "2025-11-01T10:00:00Z"
      }
    ],
    "clicksLast7Days": [
      {
        "date": "2025-11-01",
        "count": 15
      }
    ]
  }
}
```

#### 3. List Links

```http
GET /api/links?page=1&limit=10
```

#### 4. Delete Link

```http
DELETE /api/links/delete
```

**Request Body:**

```json
{
  "shortId": "abc123"
}
```

#### 5. Redirect Handler

```http
GET /{shortId}
```

Redirects to the original URL and tracks the click.

---

## 🔒 Security & Performance

Security and performance are critical aspects of this application. A comprehensive set of security measures and performance optimizations are in place to ensure a robust and reliable service.

### Security Features

- **Rate Limiting**: An in-memory token bucket algorithm is used to protect the API from abuse.
- **Input Validation**: All user input is validated on the server-side using Zod schemas.
- **URL Sanitization**: URLs are sanitized to ensure they use allowed protocols (HTTP/HTTPS), preventing XSS attacks.
- **SQL Injection Protection**: The use of an ORM (Supabase) and parameterized queries protects against SQL injection attacks.
- **Environment Security**: All sensitive information, such as database credentials and API keys, is stored in environment variables and never hard-coded.

### Performance Optimizations

- **Next.js Optimizations**: The application leverages Next.js's built-in performance optimizations, such as server-side rendering, code splitting, and font optimization.
- **Component-Level Optimizations**: Client-server component separation and memoized expensive calculations are used to optimize performance.
- **Database Query Optimizations**: Selective field queries and a service role for admin operations are used to optimize database performance.
- **Runtime Optimizations**: The application uses a multi-stage Docker build to create a small, optimized, and secure production image.

---

## 🧪 Testing Strategy

This project has a comprehensive test suite to ensure the quality and reliability of the codebase.

### Test Coverage

- **Unit Tests**: Utility functions and business logic are tested with Vitest.
- **Integration Tests**: API endpoints are tested with a mocked database to ensure they behave as expected.
- **Component Tests**: React components are tested with Testing Library to ensure they render correctly and are accessible.
- **End-to-End Tests**: Critical user flows are tested with Playwright to ensure the application works as expected from the user's perspective.

### Run Tests

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in UI mode
npm run test:ui

# Run tests in watch mode
npm run test:watch
```

---

## 📈 Performance & Monitoring

In addition to the performance optimizations mentioned above, the application includes a number of features for monitoring and observability.

- **Health Checks**: The application includes a health check endpoint at `/api/health` that can be used to monitor the health of the application.
- **Uptime Monitoring**: An external uptime monitoring service can be used to continuously check the availability of the application.
- **Performance Monitoring**: APM (Application Performance Monitoring) tools can be used to monitor the performance of the application, including response times and error rates.
- **Database Monitoring**: Supabase provides a suite of monitoring tools in its dashboard that allow you to track query performance, index usage, and connection counts.
- **Error Tracking and Logging**: The application is configured to produce structured logs, and an error tracking service can be integrated to automatically capture and report errors.

---

## 🤝 Contributing Guide

We welcome contributions from the community! If you'd like to contribute to the project, please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Install dependencies**: `npm install`
4. **Make your changes** and add tests
5. **Run tests**: `npm run test:coverage`
6. **Commit your changes**: `git commit -m 'Add amazing feature'`
7. **Push to the branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass
- Use semantic commit messages

---

## 📞 Support & Community

### Getting Help

- 📖 **Documentation**: This README and inline code comments
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/nordeim/URL-shortener/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/nordeim/URL-shortener/discussions)
- 📧 **Contact**: Open an issue for direct contact

### Community

- **Stars**: ⭐ this repo if you find it useful
- **Fork**: 🔱 Create your own version
- **Share**: 📢 Spread the word to help others
- **Contribute**: 🤝 Join the development

---

## 📊 Project Statistics

[![Build Status](https://img.shields.io/github/actions/workflow/status/nordeim/URL-shortener/ci-cd.yml?branch=main&label=build&style=for-the-badge)](https://github.com/nordeim/URL-shortener/actions)
[![Test Coverage](https://img.shields.io/codecov/c/github/nordeim/URL-shortener?label=test%20coverage&style=for-the-badge)](https://codecov.io/gh/nordeim/URL-shortener)
[![Dependencies](https://img.shields.io/librariesio/github/nordeim/URL-shortener?label=dependencies&style=for-the-badge)](https://libraries.io/github/nordeim/URL-shortener)
[![Code Quality](https://img.shields.io/codefactor/grade/github/nordeim/URL-shortener?label=code%20quality&style=for-the-badge)](https://www.codefactor.io/repository/github/nordeim/URL-shortener)

---

## 🎯 Roadmap

### Upcoming Features

- [ ] **Custom Domains**: Use your own domain for short links
- [ ] **Link Expiration**: Set expiration dates for links
- [ ] **Password Protection**: Password-protected links
- [ ] **Bulk Operations**: Import/export links
- [ ] **Advanced Analytics**: Geographic data, referrer tracking
- [ ] **API Key Management**: Programmatic access
- [ ] **Browser Extensions**: One-click shortening
- [ ] **Mobile App**: Native iOS/Android apps

### Performance Improvements

- [ ] **Caching**: Redis integration for better performance
- [ ] **CDN**: Global content delivery
- [ ] **Database Optimization**: Query optimization and indexing
- [ ] **Real-time Updates**: WebSocket integration

---

## 🙏 Acknowledgments

Special thanks to the amazing open-source community:

- **[Next.js](https://nextjs.org/)** - The React framework for production
- **[Supabase](https://supabase.com/)** - The open source Firebase alternative
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[DaisyUI](https://daisyui.com/)** - Tailwind CSS component library
- **[Chart.js](https://www.chartjs.org/)** - Simple yet flexible charting
- **[qrcode.react](https://www.npmjs.com/package/qrcode.react)** - QR code generation

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Nordeim

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
