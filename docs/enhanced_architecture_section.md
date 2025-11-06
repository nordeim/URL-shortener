# Enhanced Application Architecture

## 1. Architecture Overview

This URL Shortener application is a full-stack solution built on a modern, robust technology stack designed for performance, scalability, and maintainability. The architecture leverages Next.js 14 as the primary framework, enabling a powerful combination of server-side rendering (SSR) and client-side interactivity through the App Router. This hybrid approach ensures fast initial page loads and a rich user experience.

The system’s design philosophy is centered around a clear separation of concerns, with distinct layers for the frontend, backend, and database. TypeScript is used throughout the entire codebase, providing strong type safety and improving developer experience by catching errors at compile time.

Supabase, a backend-as-a-service (BaaS) platform, provides the PostgreSQL database, authentication, and auto-generated APIs. The application interacts with Supabase through a multi-client architecture, using different clients for anonymous, authenticated, and administrative operations to enforce security and proper data access.

Key architectural decisions include:
- **Server Components by Default**: Leveraging Next.js 14's App Router to perform data fetching and rendering on the server, minimizing the amount of JavaScript sent to the client.
- **Stateless API Routes**: The backend APIs are designed to be stateless, processing requests based solely on the input they receive, which simplifies scaling.
- **Component-Driven UI**: The frontend is built using a component-driven architecture with shadcn/ui and Tailwind CSS, promoting reusability and a consistent design system.
- **In-memory Rate Limiting**: A token bucket algorithm is implemented for rate limiting to protect the API from abuse, with a design that can be extended to a distributed solution.

![Figure 1: System Architecture Diagram](imgs/system_architecture_diagram.png)

## 2. Detailed File Hierarchy Diagram

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

## 3. System Design Patterns

The application employs several design patterns to ensure a scalable, maintainable, and robust architecture.

### Layered Architecture
The system is structured in a classic layered architecture, with clear boundaries between the presentation, application, and data layers.

-   **Presentation Layer**: This is the frontend of the application, built with React and Next.js. It consists of the UI components in the `components/` directory and the pages in the `app/` directory. This layer is responsible for rendering the user interface and handling user interactions.
-   **Application Layer (Backend)**: The backend logic is encapsulated within the Next.js API routes in `app/api/`. This layer handles business logic, such as creating short links, fetching analytics, and managing links. It acts as an intermediary between the presentation layer and the data layer.
-   **Data Layer**: The data layer is managed by Supabase, which provides the PostgreSQL database. The application interacts with the database through the Supabase client, which is configured in `lib/supabase.ts`. The database schema, migrations, and type definitions are all part of this layer.

![Figure 2: User Interaction Flow](imgs/user_interaction_flow.png)

### Repository Pattern
Though not explicitly named, the `lib/supabase.ts` file and its usage throughout the API routes act as a repository pattern. It abstracts the data access logic, providing a clean and consistent interface for the application layer to interact with the database. This pattern decouples the business logic from the data access implementation, making it easier to manage and test.

### Component Communication Patterns
Communication between components is handled through a combination of props and custom hooks.

-   **Props**: Parent components pass data and functions down to child components as props. This is the primary way of communication for most components.
-   **Custom Hooks**: For cross-cutting concerns like toast notifications, a custom hook (`use-toast`) is used. This hook provides a global state-like functionality without the need for a full state management library like Redux or Zustand, by using a reducer pattern to manage the state of toasts.

### Data Flow Architecture
The data flow in the application is unidirectional, which makes it easy to understand and debug.

1.  A user interacts with a component in the presentation layer (e.g., submitting a URL in the `UrlShortenerForm`).
2.  The component calls a function that sends a request to a Next.js API route (e.g., `POST /api/shorten`).
3.  The API route handler in the application layer processes the request, performs validation, and interacts with the data layer (Supabase) to persist data.
4.  The API route returns a response to the component.
5.  The component updates its state based on the response, and the UI is re-rendered to reflect the new state.

![Figure 3: Application Logic Flow](imgs/application_logic_flow.png)

### Security Architecture Patterns
Security is a key consideration in the application's design, and several patterns are used to protect it:

-   **Rate Limiting**: The API uses a token bucket algorithm to rate-limit requests based on IP address. This is implemented in `lib/rateLimiter.ts` and applied as middleware to the API routes, preventing abuse.
-   **Input Validation**: All user input is validated on the server-side using Zod schemas. This ensures that only valid data is processed and stored, preventing injection attacks and other vulnerabilities.
-   **URL Sanitization**: URLs are sanitized to ensure they use allowed protocols (HTTP/HTTPS), preventing XSS attacks through malicious links.
-   **Service Role Isolation**: The Supabase client is configured to use a service role with elevated privileges only on the server-side for administrative tasks, while the client-side uses a more restricted anonymous key.

## 4. Technology Integration

The application's architecture is a carefully orchestrated integration of modern web technologies, each playing a specific role to create a cohesive and powerful system.

### Next.js 14 with TypeScript and Supabase
-   **Next.js 14**: The core of the application, providing the framework for both the frontend and backend. The App Router is used to create a hybrid application with server-rendered pages for fast initial loads and client-side components for interactivity.
-   **TypeScript**: Used across the entire project to provide static type checking. This ensures type safety from the database to the UI, reducing bugs and improving the developer experience.
-   **Supabase**: Provides the PostgreSQL database and a suite of backend services. The integration is handled through the `@supabase/supabase-js` client library. TypeScript types for the database are generated, allowing for fully typed database queries.

### Frontend/Backend Separation
While the frontend and backend are part of the same Next.js project, they are logically separated. The `app/` directory contains the frontend pages, while the `app/api/` directory contains the backend API routes. This separation allows for independent development and testing of the frontend and backend, while still benefiting from the tight integration that Next.js provides.

### Database Integration Approach
The integration with the Supabase database is designed to be secure and efficient.

-   **Multi-Client Architecture**: The application uses different Supabase clients for different security contexts. A service role client is used on the server for admin operations, while a more restricted anonymous client is used on the client-side.
-   **Type-Safe Queries**: By generating TypeScript types from the database schema, all database queries are type-safe, preventing common errors and making the code easier to refactor.
-   **Migrations**: Database schema changes are managed through version-controlled migration files in the `supabase/migrations/` directory. This ensures that the database schema is consistent across all environments.

![Figure 4: Database Schema Diagram](imgs/database_schema_diagram.png)

### Build and Deployment Pipeline
The project is set up with a modern build and deployment pipeline, using Docker for containerization.

-   **Multi-Stage Docker Build**: The `Dockerfile` uses a multi-stage build to create a small, optimized, and secure production image. It separates the build environment from the production environment, and the final image runs as a non-root user for improved security.
-   **Docker Compose**: The `docker-compose.yml` file is used to orchestrate the application and database services for local development, making it easy to set up and run the entire stack with a single command.
-   **Code Quality**: The pipeline includes tools for ensuring code quality, such as ESLint for linting and Prettier for code formatting. A pre-commit hook is set up with `husky` and `lint-staged` to automatically format and lint code before it is committed.
