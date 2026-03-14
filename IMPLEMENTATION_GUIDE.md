# MaloPazarche - MVP Implementation Guide

## Project Structure Overview

This document guides you through setting up and running the MaloPazarche MVP.

### Directory Structure

```
malo-pazarche/
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom React hooks
│   │   ├── store/          # Zustand store (state management)
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   ├── styles/         # CSS and Tailwind styles
│   │   ├── App.tsx         # Main App component
│   │   └── main.tsx        # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── backend/                # ASP.NET Core Web API
│   ├── src/
│   │   ├── Controllers/    # API endpoints
│   │   ├── Services/       # Business logic
│   │   ├── Repositories/   # Data access
│   │   ├── Models/         # Domain models
│   │   ├── DTOs/           # Data transfer objects
│   │   ├── Data/           # Database context & migrations
│   │   └── Config/         # Configuration
│   ├── MaloPazarche.csproj
│   ├── Program.cs          # App configuration
│   ├── appsettings.json    # Settings
│   └── appsettings.Development.json
│
└── database/               # Database schemas
    └── migrations/         # SQL migration files
```

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** and **npm** (for frontend)
- **.NET 8 SDK** (for backend)
- **PostgreSQL 14+** (or Docker)
- **Docker & Docker Compose** (optional, for containerized setup)

### Installation Links
- Node.js: https://nodejs.org/
- .NET 8 SDK: https://dotnet.microsoft.com/download/dotnet/8.0
- PostgreSQL: https://www.postgresql.org/download/
- Docker: https://www.docker.com/products/docker-desktop

---

## Quick Start Guide

### Option 1: Using Docker (Recommended)

The easiest way to get everything running locally.

```bash
# From the project root
docker-compose up -d

# Wait for containers to start (30-60 seconds)
# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

**Services started:**
- PostgreSQL: `localhost:5432` (user: `postgres`, password: `postgres`)
- Backend API: `http://localhost:5000`
- Frontend: `http://localhost:3000` (if frontend container added)
- pgAdmin: `http://localhost:5050` (user: `admin@admin.com`, password: `admin`)

### Option 2: Manual Setup

#### Step 1: Setup PostgreSQL

If you have PostgreSQL running locally:

```bash
# Create the database
createdb malo_pazarche

# Or via psql
psql -U postgres -c "CREATE DATABASE malo_pazarche;"
```

Then run the migration:
```bash
psql -U postgres -d malo_pazarche -f database/migrations/001_initial_schema.sql
```

#### Step 2: Setup Backend

```bash
cd backend

# Restore NuGet packages
dotnet restore

# Apply Entity Framework migrations
dotnet ef database update

# Run the API server
dotnet run

# Or with watch mode for development
dotnet watch run
```

The backend will start at `http://localhost:5000`

Check the API is running: `curl http://localhost:5000/api/auth/me`

#### Step 3: Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start at `http://localhost:5173` or next available port.

---

## Configuration Files

### Backend: `appsettings.json`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=malo_pazarche;Username=postgres;Password=postgres;"
  },
  "Jwt": {
    "SecretKey": "change-this-in-production-use-at-least-32-characters",
    "Issuer": "malo-pazarche-api",
    "Audience": "malo-pazarche-client",
    "ExpirationMinutes": 60,
    "RefreshTokenExpirationDays": 7
  },
  "Cors": {
    "AllowedOrigins": ["http://localhost:3000", "http://localhost:5173"]
  }
}
```

**Important**: Never commit sensitive credentials. Create an `appsettings.Development.json` for local overrides.

### Frontend: `.env.development`

```
VITE_API_BASE_URL=http://localhost:5000
```

---

## First Test: Authentication Flow

### 1. Register a New User

**Endpoint:** `POST /api/auth/register`

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123!",
    "confirmPassword": "TestPass123!",
    "fullName": "Test User"
  }'
```

**Response (success):**
```json
{
  "success": true,
  "message": "Registration successful",
  "accessToken": "eyJhbGc...",
  "refreshToken": "base64string...",
  "user": {
    "id": "uuid",
    "username": "testuser",
    "email": "test@example.com",
    "fullName": "Test User",
    "createdAt": "2026-03-14T10:30:00Z"
  }
}
```

### 2. Login

**Endpoint:** `POST /api/auth/login`

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "testuser",
    "password": "TestPass123!"
  }'
```

### 3. Access Protected Endpoint

**Endpoint:** `GET /api/auth/me`

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Frontend Testing

1. Go to `http://localhost:5173` (or shown port)
2. Click "Sign Up"
3. Fill in the registration form
4. Click "Create Account"
5. You should be redirected to the home page
6. Click your username in the navbar to see profile
7. Click "Logout" to test authentication

---

## Database Inspection

### Using pgAdmin (Docker)

1. Open http://localhost:5050
2. Login: `admin@admin.com` / `admin`
3. Add server:
   - Host: `postgres` (or container IP)
   - Username: `postgres`
   - Password: `postgres`
4. Browse tables and data

### Using psql (Command Line)

```bash
# Connect to database
psql -U postgres -d malo_pazarche

# View users table
SELECT * FROM "Users";

# View table structure
\d "Users"

# Exit
\q
```

### Using DBeaver

Download [DBeaver](https://dbeaver.io/) and create a PostgreSQL connection:
- Host: `localhost`
- Port: `5432`
- Database: `malo_pazarche`
- User: `postgres`
- Password: `postgres`

---

## Common Issues & Troubleshooting

### Backend won't start

**Error: "Connection refused" for PostgreSQL**
```
Solution: Ensure PostgreSQL is running
- Docker: docker-compose up -d postgres
- Local: Check PostgreSQL service status
```

**Error: "dotnet: command not found"**
```
Solution: Install .NET 8 SDK
https://dotnet.microsoft.com/download/dotnet/8.0
```

### Frontend won't load

**Error: "Cannot find module"**
```bash
cd frontend
npm install
npm run dev
```

**Port 5173 already in use:**
Vite will automatically use the next available port (5174, 5175, etc.)

### Migration errors

```bash
# Reset migrations (development only!)
dotnet ef database drop
dotnet ef database update

# Or manually in SQL
DROP DATABASE malo_pazarche;
CREATE DATABASE malo_pazarche;
psql -U postgres -d malo_pazarche -f database/migrations/001_initial_schema.sql
```

---

## API Endpoints (MVP Phase 1)

### Authentication

| Method | Endpoint | Protected | Purpose |
|--------|----------|-----------|---------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login and get tokens |
| POST | `/api/auth/refresh-token` | Yes | Refresh access token |
| GET | `/api/auth/me` | Yes | Get current user |

---

## Next Steps

1. **Backend Enhancement**: Add Products controller and endpoints
2. **Frontend Enhancement**: Add product listing, creation forms
3. **Real-time Chat**: Implement SignalR chat system
4. **Search**: Add product search and filtering
5. **Testing**: Add unit and integration tests
6. **Deployment**: Prepare for AWS/Docker deployment

---

## Development Workflow

### Git Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(auth): add login endpoint
fix(database): correct user table migration
docs(readme): update setup instructions
style(frontend): format React components
refactor(backend): simplify auth service
test(auth): add login tests
```

### Code Style

- **Frontend**: Use ESLint config from Vite template
- **Backend**: Follow C# naming conventions (PascalCase for public members)

### Pull Request Checklist

- [ ] Code compiles/runs without errors
- [ ] Tests pass (if applicable)
- [ ] Updated documentation
- [ ] No breaking changes
- [ ] Follows code style guide

---

## Useful Commands

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend
```bash
dotnet run           # Run the application
dotnet watch run     # Run with file watching
dotnet build         # Build the project
dotnet test          # Run tests
dotnet ef migrations add <name>  # Add migration
dotnet ef database update        # Apply migrations
```

### Docker
```bash
docker-compose up -d              # Start all services
docker-compose down               # Stop all services
docker-compose logs -f            # View logs
docker-compose ps                 # List containers
docker exec -it postgres psql -U postgres  # Access psql
```

---

## Support & Resources

- **Frontend Docs**: [React Router](https://reactrouter.com/), [Zustand](https://zustand-demo.vercel.app/), [React Hook Form](https://react-hook-form.com/)
- **Backend Docs**: [ASP.NET Core](https://learn.microsoft.com/aspnet/core), [Entity Framework Core](https://learn.microsoft.com/ef/core/)
- **Database**: [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Happy coding! 🚀**

*MaloPazarche MVP - Phase 1*
