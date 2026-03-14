# MaloPazarche MVP - File Reference Guide

**Quick reference for all files created in Phase 1**

---

## Backend Files

### Configuration & Entry Point

| File | Path | Purpose |
|------|------|---------|
| Project File | `backend/MaloPazarche.csproj` | .NET project configuration with NuGet references |
| Entry Point | `backend/Program.cs` | Application startup, DI setup, middleware config |
| App Settings | `backend/appsettings.json` | JWT, database, CORS configuration |
| Git Ignore | `backend/.gitignore` | Exclude build artifacts from version control |

### Models

| File | Path | Purpose |
|------|------|---------|
| User Entity | `backend/src/Models/User.cs` | Database user model with password hash & tokens |

### Data Transfer Objects (DTOs)

| File | Path | Purpose |
|------|------|---------|
| Register Request | `backend/src/DTOs/RegisterRequest.cs` | Registration payload with validation rules |
| Login Request | `backend/src/DTOs/LoginRequest.cs` | Login payload structure |
| Auth Response | `backend/src/DTOs/AuthResponse.cs` | Unified response with user & token data |
| Refresh Token Request | `backend/src/DTOs/RefreshTokenRequest.cs` | Token refresh payload |

### Database Layer

| File | Path | Purpose |
|------|------|---------|
| DbContext | `backend/src/Data/AppDbContext.cs` | Entity Framework configuration & entity mapping |
| Migration | `backend/src/Data/Migrations/20260314000000_InitialCreate.cs` | Initial schema migration |
| Migration Designer | `backend/src/Data/Migrations/20260314000000_InitialCreate.Designer.cs` | Migration metadata |
| Model Snapshot | `backend/src/Data/Migrations/AppDbContextModelSnapshot.cs` | Current schema state |

### Repositories

| File | Path | Purpose |
|------|------|---------|
| User Repository Interface | `backend/src/Repositories/IUserRepository.cs` | Data access contract |
| User Repository | `backend/src/Repositories/UserRepository.cs` | User query & save operations |

### Services

| File | Path | Purpose |
|------|------|---------|
| JWT Token Service | `backend/src/Services/JwtTokenService.cs` | JWT generation, validation, refresh |
| Authentication Service | `backend/src/Services/AuthService.cs` | Register, login, token refresh logic |

### Controllers

| File | Path | Purpose |
|------|------|---------|
| Auth Controller | `backend/src/Controllers/AuthController.cs` | `/api/auth/*` endpoints |

### Endpoints Provided

```
POST   /api/auth/register        → Create user account
POST   /api/auth/login           → Authenticate user
POST   /api/auth/refresh-token   → Refresh access token (protected)
GET    /api/auth/me              → Get current user (protected)
```

---

## Frontend Files

### Configuration & Build

| File | Path | Purpose |
|------|------|---------|
| Package Config | `frontend/package.json` | Dependencies, scripts, metadata |
| TypeScript Config | `frontend/tsconfig.json` | TS compiler options, path aliases |
| TS Config (Build) | `frontend/tsconfig.node.json` | TS config for Vite build files |
| Vite Config | `frontend/vite.config.ts` | Build tool setup, API proxy, aliases |
| Tailwind Config | `frontend/tailwind.config.js` | Tailwind CSS customization |
| PostCSS Config | `frontend/postcss.config.js` | CSS processing configuration |
| Environment | `frontend/.env.development` | Dev API base URL |
| HTML Template | `frontend/index.html` | DOM entry point |
| Git Ignore | `frontend/.gitignore` | Exclude node_modules, build artifacts |

### Core Application

| File | Path | Purpose |
|------|------|---------|
| Entry Point | `frontend/src/main.tsx` | ReactDOM render | 
| Main App | `frontend/src/App.tsx` | Router setup, route definitions |
| Global Styles | `frontend/src/styles/index.css` | Tailwind imports & global CSS |

### Types

| File | Path | Purpose |
|------|------|---------|
| Type Definitions | `frontend/src/types/index.ts` | TypeScript interfaces for API types |

**Exported Types:**
- `User` - User profile data
- `AuthResponse` - API auth responses
- `RegisterRequest` / `LoginRequest` - Request payloads
- `Product` / `ProductImage` - Product entities
- `ApiError` - Error response structure

### State Management (Zustand)

| File | Path | Purpose |
|------|------|---------|
| Auth Store | `frontend/src/store/authStore.ts` | Global authentication state |

**State Properties:**
- `user` - Current user object
- `accessToken` - JWT access token
- `refreshToken` - Refresh token
- `isAuthenticated` - Auth status
- `isLoading` - Loading state
- `error` - Current error message

**Actions:**
- `setUser()` - Update user
- `setTokens()` - Store tokens
- `clearAuth()` - Logout
- `setAuthResponse()` - Handle API response

### Services

| File | Path | Purpose |
|------|------|---------|
| API Client | `frontend/src/services/api.ts` | Axios setup with auth interceptors |

**Features:**
- Automatic auth header injection
- Token refresh on 401
- Request/response interceptors
- API methods: `register()`, `login()`, `refreshToken()`, etc.

### Hooks

| File | Path | Purpose |
|------|------|---------|
| useAuth Hook | `frontend/src/hooks/useAuth.ts` | Authentication logic & persistence |

**Provided:**
- `register()` - Create account
- `login()` - Sign in
- `logout()` - Sign out
- `clearError()` - Clear error messages
- All store properties

### Utilities

| File | Path | Purpose |
|------|------|---------|
| Route Components | `frontend/src/utils/routes.tsx` | Protected/Public route wrappers |

**Components:**
- `<ProtectedRoute>` - Redirect unauthenticated to /login
- `<PublicRoute>` - Redirect authenticated to /

### Components

| File | Path | Purpose |
|------|------|---------|
| Navbar | `frontend/src/components/Navbar.tsx` | Navigation bar with auth links |
| Product Card | `frontend/src/components/ProductCard.tsx` | Product listing card |

### Pages

| File | Path | Purpose |
|------|------|---------|
| Home Page | `frontend/src/pages/HomePage.tsx` | Feed with mock product grid (protected) |
| Login Page | `frontend/src/pages/LoginPage.tsx` | Login form with validation (public) |
| Register Page | `frontend/src/pages/RegisterPage.tsx` | Registration form with validation (public) |

**Routes:**
- `/` - HomePage (protected)
- `/login` - LoginPage (public)
- `/register` - RegisterPage (public)

---

## Database Files

| File | Path | Purpose |
|------|------|---------|
| Schema | `database/migrations/001_initial_schema.sql` | PostgreSQL schema with 12 tables |

**Tables:**
1. `Users` - User accounts, roles, tokens
2. `Products` - Items for sale
3. `ProductImages` - Product photos
4. `Likes` - User product likes
5. `SavedPosts` - User saved items
6. `Comments` - Product comments
7. `Followers` - User follow relationships
8. `Conversations` - Direct message threads
9. `Messages` - Individual messages
10. `Notifications` - System notifications
11. `BoostedPosts` - Promotion data
12. Indexes - Performance optimization

---

## Documentation Files

| File | Path | Purpose |
|------|------|---------|
| Implementation Guide | `IMPLEMENTATION_GUIDE.md` | Setup, configuration, troubleshooting |
| MVP Phase Complete | `MVP_PHASE1_COMPLETE.md` | Summary of Phase 1 accomplishments |
| This File | `FILE_REFERENCE.md` | Quick reference for all files |

---

## Directory Structure

```
malo-pazarche/
│
├── backend/
│   ├── MaloPazarche.csproj
│   ├── Program.cs
│   ├── appsettings.json
│   ├── .gitignore
│   └── src/
│       ├── Controllers/
│       │   └── AuthController.cs
│       ├── Services/
│       │   ├── JwtTokenService.cs
│       │   └── AuthService.cs
│       ├── Repositories/
│       │   ├── IUserRepository.cs
│       │   └── UserRepository.cs
│       ├── Models/
│       │   └── User.cs
│       ├── DTOs/
│       │   ├── RegisterRequest.cs
│       │   ├── LoginRequest.cs
│       │   ├── AuthResponse.cs
│       │   └── RefreshTokenRequest.cs
│       └── Data/
│           ├── AppDbContext.cs
│           └── Migrations/
│               ├── 20260314000000_InitialCreate.cs
│               ├── 20260314000000_InitialCreate.Designer.cs
│               └── AppDbContextModelSnapshot.cs
│
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.development
│   ├── index.html
│   ├── .gitignore
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── types/
│       │   └── index.ts
│       ├── store/
│       │   └── authStore.ts
│       ├── services/
│       │   └── api.ts
│       ├── hooks/
│       │   └── useAuth.ts
│       ├── utils/
│       │   └── routes.tsx
│       ├── components/
│       │   ├── Navbar.tsx
│       │   └── ProductCard.tsx
│       ├── pages/
│       │   ├── HomePage.tsx
│       │   ├── LoginPage.tsx
│       │   └── RegisterPage.tsx
│       └── styles/
│           └── index.css
│
├── database/
│   └── migrations/
│       └── 001_initial_schema.sql
│
├── docs/
│   └── (Architecture documentation from previous phase)
│
└── Documentation files:
    ├── IMPLEMENTATION_GUIDE.md
    ├── MVP_PHASE1_COMPLETE.md
    └── FILE_REFERENCE.md (this file)
```

---

## Quick Start File Map

### To Start Backend
1. Read `backend/appsettings.json` for config
2. Run `backend/Program.cs` entry point
3. Use `backend/src/Controllers/AuthController.cs` endpoints

### To Start Frontend
1. Install from `frontend/package.json`
2. Run `frontend/src/main.tsx` entry point
3. Navigate to `frontend/src/pages/` for views

### To Setup Database
1. Apply `database/migrations/001_initial_schema.sql`
2. Or let EF Core auto-migrate via `backend/src/Data/Migrations/`

### Environment Setup
- Backend config: `backend/appsettings.json`
- Frontend config: `frontend/.env.development`

---

## File Size Summary

| Component | Files | Total Lines |
|-----------|-------|------------|
| Backend | 17 | ~1,200 |
| Frontend | 18 | ~1,400 |
| Database | 1 | ~200 |
| Documentation | 3 | ~1,500 |
| **Total** | **39** | **~4,300** |

---

## Dependencies Overview

### Backend Dependencies
- Microsoft.EntityFrameworkCore (8.0.0)
- Npgsql.EntityFrameworkCore.PostgreSQL (8.0.0)
- System.IdentityModel.Tokens.Jwt (7.0.0)
- BCrypt.Net-Next (4.0.3)
- Serilog.AspNetCore (8.0.0)

### Frontend Dependencies
- react (18.2.0)
- react-router-dom (6.20.0)
- axios (1.6.0)
- zustand (4.4.0)
- react-hook-form (7.48.0)
- tailwindcss (3.3.6)

---

## What Each File Does

### Authentication Flow Files

**Backend:**
1. `RegisterRequest.cs` → Validates register input
2. `AuthController.cs` → Receives register request
3. `AuthService.cs` → Creates user, checks duplicates
4. `UserRepository.cs` → Saves to database
5. `JwtTokenService.cs` → Generates tokens
6. `AuthResponse.cs` → Returns tokens to client

**Frontend:**
1. `RegisterPage.tsx` → Form UI & validation
2. `useAuth.ts` → Calls API, stores response
3. `authStore.ts` → Manages global auth state
4. `App.tsx` → Protects routes with state
5. `Token persisted` → localStorage

---

## Adding New Features

### To Add a New API Endpoint
1. Create DTO in `backend/src/DTOs/`
2. Create Service method in `backend/src/Services/`
3. Add Controller method in `backend/src/Controllers/`
4. Add type in `frontend/src/types/index.ts`
5. Add API method in `frontend/src/services/api.ts`

### To Add a New Component
1. Create in `frontend/src/components/`
2. Export from component
3. Import in page or another component
4. Add styles to `frontend/src/styles/index.css` or inline Tailwind

### To Add a New Page
1. Create in `frontend/src/pages/`
2. Add route in `frontend/src/App.tsx`
3. Wrap with `<ProtectedRoute>` or `<PublicRoute>` if needed

---

## Troubleshooting by File

| Issue | Check File(s) |
|-------|----------------|
| Backend won't start | `Program.cs`, `appsettings.json` |
| Database connection error | `appsettings.json`, `AppDbContext.cs` |
| Frontend won't load | `main.tsx`, `vite.config.ts`, `package.json` |
| Auth not working | `AuthService.cs`, `useAuth.ts`, `api.ts` |
| Routes not protected | `utils/routes.tsx`, `App.tsx` |
| TypeScript errors | `types/index.ts`, `tsconfig.json` |
| Styling not working | `tailwind.config.js`, `styles/index.css` |

---

## Next Files to Create (Phase 2)

- `backend/src/Models/Product.cs` - Product entity
- `backend/src/Controllers/ProductController.cs` - Product endpoints
- `backend/src/Repositories/IProductRepository.cs` - Product data access
- `frontend/src/pages/ProductPage.tsx` - Product detail page
- `frontend/src/pages/SellPage.tsx` - Product creation form
- etc.

---

**Reference Version**: 1.0  
**Last Updated**: March 14, 2026  
**Created**: MVP Phase 1

