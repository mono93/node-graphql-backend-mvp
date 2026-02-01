# GraphQL Backend MVP

A production-style GraphQL API built with Node.js, demonstrating secure Auth0 authentication, role-based access control (RBAC), MongoDB persistence, and enforced Git workflows. Designed as an MVP to showcase end-to-end backend engineering skills and business-ready architecture.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
  - [User Management](#user-management)
  - [Incident Management](#incident-management)
- [Authentication & Authorization](#authentication--authorization)
- [Docker Setup](#docker-setup)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Functionality
- **User Management**: Create, read, update, delete users with role-based access control
- **Incident Management**: Full CRUD operations for incident tracking with ownership enforcement
- **GraphQL API**: Type-safe GraphQL queries and mutations
- **Pagination**: Built-in pagination support for list endpoints

### Security
- **Auth0 Integration**: Secure JWT-based authentication
- **Role-Based Access Control**: Admin and user roles with fine-grained permissions
- **Ownership Enforcement**: Users can only access/modify their own resources (except admins)
- **Request Validation**: GraphQL schema validation

### Developer Experience
- **TypeScript**: Full type safety across the codebase
- **Hot Reload**: Development mode with automatic restart on file changes
- **Docker Support**: Pre-configured Docker and Docker Compose setup
- **Git Hooks**: Automated commit linting with Husky
- **Code Formatting**: Prettier for consistent code style

## 🛠️ Tech Stack

### Backend
- **Node.js 22**: JavaScript runtime
- **Express 5.2**: Web framework
- **Apollo Server 5.2**: GraphQL server
- **TypeScript**: Type-safe JavaScript
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling

### Authentication
- **Auth0**: Identity provider
- **express-oauth2-jwt-bearer**: JWT verification middleware

### Development Tools
- **tsx**: TypeScript execution with hot reload
- **Husky**: Git hooks for commit linting
- **Commitlint**: Enforce conventional commits
- **Prettier**: Code formatter
- **ESLint**: Linter
- **Winston**: Logging

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration

## 🚀 Getting Started

### Prerequisites

- **Node.js 22+** - [Download](https://nodejs.org/)
- **MongoDB 6+** - [Download](https://www.mongodb.com/try/download/community)
- **Auth0 Account** - [Sign up](https://auth0.com/signup)
- **Git** - [Download](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:mono93/node-graphql-backend-mvp.git
   cd node-graphql-backend-mvp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Git hooks**
   ```bash
   npm run prepare
   ```

### Environment Setup

1. **Create `.env` file** in the root directory:
   ```bash
   cp .env.example .env
   ```

2. **Configure environment variables**:
   ```env
   # Server
   PORT=8081

   # MongoDB
   MONGO_URI=mongodb://localhost:27017/graphql_db

   # Auth0
   ISSUER_BASE_URL=https://your-domain.auth0.com/
   AUDIENCE=your-api-identifier
   NAME_SPACE=https://your-domain.com
   ```

3. **Get Auth0 credentials**:
   - Go to [Auth0 Dashboard](https://manage.auth0.com/)
   - Create an API application
   - Copy your Domain, Client ID, and API Identifier
   - Set these in your `.env` file

## 📁 Project Structure

```
src/
├── app.ts                      # Express app setup
├── server.ts                   # Server entry point
├── config.ts                   # Environment configuration
│
├── common/
│   ├── auth/                   # Authorization policies
│   │   └── auth.ts             # RBAC and permission logic
│   ├── constants.ts            # App constants
│   ├── utilities.ts            # Helper functions
│   ├── logging/                # Logging setup
│   │   ├── index.ts
│   │   └── httpLogger.ts
│   └── service/                # Business logic services
│       ├── user.service.ts     # User CRUD operations
│       └── incident.service.ts # Incident CRUD operations
│
├── graphql/                    # GraphQL setup
│   ├── index.ts                # Type defs and resolvers
│   ├── context.ts              # GraphQL context factory
│   ├── user/                   # User resolvers
│   │   ├── user.schema.ts      # GraphQL type definitions
│   │   └── user.resolver.ts    # Query and mutation handlers
│   └── incident/               # Incident resolvers
│       ├── incident.schema.ts  # GraphQL type definitions
│       └── incident.resolver.ts # Query and mutation handlers
│
├── interface/                  # TypeScript interfaces
│   ├── user.types.ts
│   └── incident.types.ts
│
├── middleware/                 # Express middleware
│   ├── authentication.ts       # Auth0 JWT verification
│   └── requireAdmin.ts         # Admin-only access
│
├── models/                     # Mongoose schemas
│   ├── user.ts
│   └── incident.ts
│
└── routes/                     # Express routes
    ├── index.ts
    ├── graphql.ts              # GraphQL endpoint
    ├── health.ts               # Health check
    └── user.ts                 # User REST endpoints

Dockerfile                      # Docker image definition
docker-compose.yml              # Multi-container setup
.env.example                    # Example environment variables
tsconfig.json                   # TypeScript configuration
package.json                    # Dependencies and scripts
```

## 📡 API Documentation

The GraphQL API is available at `http://localhost:8081/api/v1/graphql`

### User Management

#### Queries

**Get single user** (requires READ permission with ownership check)
```graphql
query {
  user(id: "user123") {
    id
    name
    email
    userType
    auth0Id
    createdAt
  }
}
```

**Get all users** (admin-only, with pagination)
```graphql
query {
  users(page: 1, limit: 10) {
    id
    name
    email
    userType
    auth0Id
    createdAt
  }
}
```

#### Mutations

**Create user** (admin-only)
```graphql
mutation {
  createUser(
    name: "John Doe"
    email: "john@example.com"
    userType: "admin"
    auth0Id: "auth0|123"
  ) {
    id
    name
    email
    userType
    auth0Id
    createdAt
  }
}
```

**Update user** (user can update own, admin can update any)
```graphql
mutation {
  updateUser(
    id: "user123"
    name: "Jane Doe"
    userType: "user"
  ) {
    id
    name
    email
    userType
    auth0Id
    createdAt
  }
}
```

**Delete user** (admin-only)
```graphql
mutation {
  deleteUser(id: "user123")
}
```

### Incident Management

#### Queries

**Get single incident** (requires READ permission with ownership check)
```graphql
query {
  incident(id: "incident123") {
    id
    title
    description
    status
    severity
    createdBy
    createdDate
    updatedDate
  }
}
```

**Get all incidents** (requires READ permission, admin-only)
```graphql
query {
  incidents(page: 1, limit: 10) {
    id
    title
    description
    status
    severity
    createdBy
    createdDate
    updatedDate
  }
}
```

**Get my incidents** (user can view their own)
```graphql
query {
  myIncidents(page: 1, limit: 10) {
    id
    title
    description
    status
    severity
    createdBy
    createdDate
    updatedDate
  }
}
```

#### Mutations

**Create incident** (admin and user)
```graphql
mutation {
  createIncident(
    title: "Server Down"
    description: "Production server is not responding"
    severity: "Critical"
  ) {
    id
    title
    description
    status
    severity
    createdBy
    createdDate
    updatedDate
  }
}
```

**Update incident** (user can update own, admin can update any)
```graphql
mutation {
  updateIncident(
    id: "incident123"
    status: "InProgress"
    severity: "High"
  ) {
    id
    title
    description
    status
    severity
    createdBy
    createdDate
    updatedDate
  }
}
```

**Delete incident** (admin-only)
```graphql
mutation {
  deleteIncident(id: "incident123")
}
```

## 🔐 Authentication & Authorization

### How It Works

1. **Client obtains JWT token** from Auth0
2. **Token sent in Authorization header**: `Authorization: Bearer <token>`
3. **middleware/authentication.ts** verifies the token
4. **graphql/context.ts** extracts user info (id, roles)
5. **Resolvers use authorizeUserAccess/authorizeIncidentAccess** to check permissions

### Access Control Policies

#### User Policies
| Action | Allowed Roles | Enforces Ownership |
|--------|---------------|--------------------|
| CREATE | admin         | ✗                  |
| READ   | admin, user   | ✓                  |
| READALL| admin         | ✗                  |
| UPDATE | admin, user   | ✓                  |
| DELETE | admin         | ✗                  |

#### Incident Policies
| Action | Allowed Roles | Enforces Ownership |
|--------|---------------|--------------------|
| CREATE | admin, user   | ✗                  |
| READ   | admin, user   | ✓                  |
| UPDATE | admin, user   | ✓                  |
| DELETE | admin         | ✗                  |

### Example: Authorization Flow

```typescript
// User requests to read user with ID "user456"
const authResult = await authorizeUserAccess(
  ctx.user,        // { id: "user123", roles: ["user"] }
  'READ',           // Action
  'user456',        // Resource ID
  userService       // Service with isOwner() method
);

// If user is admin: allowed = true
// If user is same as user456: allowed = true
// If user is different: allowed = false with 403
```

## 🐳 Docker Setup

### Quick Start

1. **Create `.env` file** with Auth0 credentials (see Environment Setup)

2. **Start services**:
   ```bash
   docker-compose up -d
   ```

3. **View logs**:
   ```bash
   docker-compose logs -f app
   ```

4. **Access the API**:
   - GraphQL: `http://localhost:8081/api/v1/graphql`
   - MongoDB: `mongodb://admin:password@localhost:27017`

### Docker Commands

```bash
# Start services in background
docker-compose up -d

# View logs
docker-compose logs -f              # All services
docker-compose logs -f app          # Only app
docker-compose logs -f mongo        # Only MongoDB

# Stop services
docker-compose stop

# Remove services and containers
docker-compose down

# Remove services, containers, and volumes
docker-compose down -v

# Rebuild image
docker-compose build

# Restart services
docker-compose restart
```

### Services

- **app** - GraphQL API (port 8081)
- **mongo** - MongoDB database (port 27017)
  - Username: `admin`
  - Password: `password`
  - Default database: `graphql_db`

## 💻 Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Type checking
npm run typecheck

# Format code
npm run format

# Check formatting
npm run format:check

# Setup Git hooks
npm run prepare
```

### Development Workflow

1. **Create feature branch**:
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make changes** and watch for auto-reload (runs on `npm run dev`)

3. **Format and type-check**:
   ```bash
   npm run format
   npm run typecheck
   ```

4. **Commit with conventional message**:
   ```bash
   git commit -m "feat: add new feature"
   ```
   Husky will lint the commit message.

5. **Push and create PR**:
   ```bash
   git push origin feature/your-feature
   ```

### Common Development Tasks

**Add new GraphQL query**:
1. Update schema in `src/graphql/[resource]/[resource].schema.ts`
2. Add resolver in `src/graphql/[resource]/[resource].resolver.ts`
3. Add service method in `src/common/service/[resource].service.ts` if needed

**Add new service method**:
1. Implement in `src/common/service/[resource].service.ts`
2. Add authorization check in resolver
3. Return properly formatted data

**Add authorization rule**:
1. Update policy in `src/common/auth/auth.ts`
2. Add authorization check in resolver using `authorizeUserAccess` or `authorizeIncidentAccess`

## 🤝 Contributing

This is an MVP project. Areas for enhancement:

- [ ] Write unit and integration tests
- [ ] Add GraphQL subscriptions for real-time updates
- [ ] Implement file upload support
- [ ] Add caching layer (Redis)
- [ ] Implement audit logging
- [ ] Add rate limiting
- [ ] Improve error handling and custom error types
- [ ] Add database migration tooling
- [ ] Implement soft deletes

### Guidelines

- Use TypeScript for all new code
- Follow the existing project structure
- Write meaningful commit messages
- Keep functions small and focused
- Add proper error handling
- Document complex logic

## 📄 License

MIT - See [LICENSE](LICENSE) file for details

## 👨‍💻 Author

**Monojit Saha**
- GitHub: [@mono93](https://github.com/mono93)
- Repository: [node-graphql-backend-mvp](https://github.com/mono93/node-graphql-backend-mvp)

---

**Last Updated**: January 2026
