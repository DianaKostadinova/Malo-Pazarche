# MaloPazarche - Project Structure & Setup Guide

## Complete Project Structure

```
MaloPazarche/
├── docs/
│   ├── 01-SYSTEM_ARCHITECTURE.md
│   ├── 02-FRONTEND_ARCHITECTURE.md
│   ├── 03-BACKEND_ARCHITECTURE.md
│   ├── 04-DATABASE_DESIGN.md
│   ├── 05-CHAT_SYSTEM.md
│   ├── 06-AUTHENTICATION.md
│   ├── 07-SCALABILITY.md
│   ├── 08-DEVELOPMENT_ROADMAP.md
│   └── 09-PROJECT_STRUCTURE.md (this file)
│
├── frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (feed)/
│   │   │   ├── page.tsx (home/feed)
│   │   │   ├── explore/page.tsx
│   │   │   ├── saved/page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── products/
│   │   │   ├── [id]/page.tsx
│   │   │   ├── create/page.tsx
│   │   │   └── edit/[id]/page.tsx
│   │   │
│   │   ├── profile/
│   │   │   ├── [username]/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   └── my-posts/page.tsx
│   │   │
│   │   ├── messages/
│   │   │   ├── page.tsx
│   │   │   └── [conversationId]/page.tsx
│   │   │
│   │   ├── notifications/page.tsx
│   │   ├── page.tsx (redirects to feed)
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── feed/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductFeed.tsx
│   │   │   ├── InfiniteScroll.tsx
│   │   │   └── LoadingSkeletons.tsx
│   │   │
│   │   ├── product/
│   │   │   ├── ProductDetail.tsx
│   │   │   ├── ProductImages.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── SellerInfo.tsx
│   │   │   └── ProductStats.tsx
│   │   │
│   │   ├── interactions/
│   │   │   ├── LikeButton.tsx
│   │   │   ├── SaveButton.tsx
│   │   │   ├── CommentSection.tsx
│   │   │   ├── CommentForm.tsx
│   │   │   └── Comment.tsx
│   │   │
│   │   ├── profile/
│   │   │   ├── UserProfile.tsx
│   │   │   ├── ShopProfile.tsx
│   │   │   ├── ProfileHeader.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── FollowButton.tsx
│   │   │   └── ProfileStats.tsx
│   │   │
│   │   ├── messaging/
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── MessageList.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   ├── ConversationList.tsx
│   │   │   ├── TypingIndicator.tsx
│   │   │   └── Message.tsx
│   │   │
│   │   ├── search/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── SearchResults.tsx
│   │   │   ├── FiltersPanel.tsx
│   │   │   ├── CategoryFilter.tsx
│   │   │   ├── SizeFilter.tsx
│   │   │   ├── ConditionFilter.tsx
│   │   │   └── PriceRangeFilter.tsx
│   │   │
│   │   └── auth/
│   │       ├── LoginForm.tsx
│   │       ├── RegisterForm.tsx
│   │       ├── ProtectedRoute.tsx
│   │       └── AuthProvider.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useChat.ts
│   │   ├── useProducts.ts
│   │   ├── useInfiniteScroll.ts
│   │   ├── useSearch.ts
│   │   ├── useFeed.ts
│   │   ├── useNotifications.ts
│   │   ├── useUser.ts
│   │   └── useAsync.ts
│   │
│   ├── services/
│   │   ├── api.ts                 # Axios instance
│   │   ├── auth.service.ts
│   │   ├── products.service.ts
│   │   ├── interactions.service.ts
│   │   ├── users.service.ts
│   │   ├── messages.service.ts
│   │   ├── search.service.ts
│   │   ├── notifications.service.ts
│   │   └── websocket.service.ts
│   │
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── feedStore.ts
│   │   ├── userStore.ts
│   │   ├── chatStore.ts
│   │   ├── uiStore.ts
│   │   └── notificationStore.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── api.ts
│   │   ├── user.ts
│   │   ├── product.ts
│   │   ├── message.ts
│   │   ├── interaction.ts
│   │   └── auth.ts
│   │
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── dates.ts
│   │   ├── validators.ts
│   │   ├── images.ts
│   │   └── helpers.ts
│   │
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── logging.ts
│   │
│   ├── public/
│   │   ├── images/
│   │   ├── icons/
│   │   └── logo.svg
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── tailwind.config.ts
│   │
│   ├── .env.local
│   ├── .env.example
│   ├── .gitignore
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
│
├── backend/
│   ├── src/
│   │   ├── MaloPazarche.API/
│   │   │   ├── Controllers/
│   │   │   │   ├── AuthController.cs
│   │   │   │   ├── UsersController.cs
│   │   │   │   ├── ProductsController.cs
│   │   │   │   ├── InteractionsController.cs
│   │   │   │   ├── MessagesController.cs
│   │   │   │   ├── SearchController.cs
│   │   │   │   ├── NotificationsController.cs
│   │   │   │   └── HealthController.cs
│   │   │   │
│   │   │   ├── Hubs/
│   │   │   │   ├── ChatHub.cs
│   │   │   │   └── NotificationHub.cs
│   │   │   │
│   │   │   ├── Middleware/
│   │   │   │   ├── ExceptionHandlingMiddleware.cs
│   │   │   │   ├── JwtMiddleware.cs
│   │   │   │   └── LoggingMiddleware.cs
│   │   │   │
│   │   │   ├── Program.cs
│   │   │   ├── appsettings.json
│   │   │   ├── appsettings.Development.json
│   │   │   └── MaloPazarche.API.csproj
│   │   │
│   │   ├── MaloPazarche.Application/
│   │   │   ├── Services/
│   │   │   │   ├── AuthService.cs
│   │   │   │   ├── UserService.cs
│   │   │   │   ├── ProductService.cs
│   │   │   │   ├── InteractionService.cs
│   │   │   │   ├── MessageService.cs
│   │   │   │   ├── SearchService.cs
│   │   │   │   ├── NotificationService.cs
│   │   │   │   ├── BoostedPostService.cs
│   │   │   │   └── TokenService.cs
│   │   │   │
│   │   │   ├── DTOs/
│   │   │   │   ├── Auth/
│   │   │   │   │   ├── LoginRequestDTO.cs
│   │   │   │   │   ├── RegisterRequestDTO.cs
│   │   │   │   │   └── AuthResponseDTO.cs
│   │   │   │   ├── User/
│   │   │   │   │   ├── UserDTO.cs
│   │   │   │   │   ├── CreateUserDTO.cs
│   │   │   │   │   └── UpdateUserDTO.cs
│   │   │   │   ├── Product/
│   │   │   │   │   ├── ProductDTO.cs
│   │   │   │   │   ├── CreateProductDTO.cs
│   │   │   │   │   ├── UpdateProductDTO.cs
│   │   │   │   │   └── ProductDetailDTO.cs
│   │   │   │   ├── Message/
│   │   │   │   │   ├── MessageDTO.cs
│   │   │   │   │   ├── ConversationDTO.cs
│   │   │   │   │   └── SendMessageDTO.cs
│   │   │   │   ├── Interaction/
│   │   │   │   │   ├── LikeDTO.cs
│   │   │   │   │   ├── CommentDTO.cs
│   │   │   │   │   └── SaveDTO.cs
│   │   │   │   ├── Search/
│   │   │   │   │   └── SearchResultDTO.cs
│   │   │   │   └── Common/
│   │   │   │       ├── PaginatedResponseDTO.cs
│   │   │   │       ├── ApiResponseDTO.cs
│   │   │   │       └── ErrorResponseDTO.cs
│   │   │   │
│   │   │   ├── Validators/
│   │   │   │   ├── LoginRequestValidator.cs
│   │   │   │   ├── RegisterRequestValidator.cs
│   │   │   │   ├── CreateProductValidator.cs
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── Mappers/
│   │   │   │   ├── UserMappingProfile.cs
│   │   │   │   ├── ProductMappingProfile.cs
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── Exceptions/
│   │   │   │   ├── NotFoundException.cs
│   │   │   │   ├── UnauthorizedException.cs
│   │   │   │   ├── ValidationException.cs
│   │   │   │   └── BadRequestException.cs
│   │   │   │
│   │   │   ├── BackgroundJobs/
│   │   │   │   ├── NotificationBackgroundJob.cs
│   │   │   │   ├── ImageProcessingJob.cs
│   │   │   │   └── FeedGenerationJob.cs
│   │   │   │
│   │   │   └── MaloPazarche.Application.csproj
│   │   │
│   │   ├── MaloPazarche.Domain/
│   │   │   ├── Entities/
│   │   │   │   ├── User.cs
│   │   │   │   ├── Product.cs
│   │   │   │   ├── ProductImage.cs
│   │   │   │   ├── Like.cs
│   │   │   │   ├── Comment.cs
│   │   │   │   ├── SavedPost.cs
│   │   │   │   ├── Follower.cs
│   │   │   │   ├── Message.cs
│   │   │   │   ├── Conversation.cs
│   │   │   │   ├── Notification.cs
│   │   │   │   ├── BoostedPost.cs
│   │   │   │   ├── UserRole.cs
│   │   │   │   ├── NotificationType.cs
│   │   │   │   └── ProductCondition.cs
│   │   │   │
│   │   │   ├── Interfaces/
│   │   │   │   ├── IEntity.cs
│   │   │   │   └── IRepository.cs
│   │   │   │
│   │   │   └── MaloPazarche.Domain.csproj
│   │   │
│   │   ├── MaloPazarche.Infrastructure/
│   │   │   ├── Data/
│   │   │   │   ├── ApplicationDbContext.cs
│   │   │   │   ├── Migrations/
│   │   │   │   │   ├── InitialCreate.cs
│   │   │   │   │   ├── InitialCreate.Designer.cs
│   │   │   │   │   └── ...
│   │   │   │   └── Seeds/
│   │   │   │       └── SeedData.cs
│   │   │   │
│   │   │   ├── Repositories/
│   │   │   │   ├── IUnitOfWork.cs
│   │   │   │   ├── UnitOfWork.cs
│   │   │   │   ├── Repository.cs (generic)
│   │   │   │   ├── UserRepository.cs
│   │   │   │   ├── ProductRepository.cs
│   │   │   │   ├── MessageRepository.cs
│   │   │   │   ├── InteractionRepository.cs
│   │   │   │   └── SearchRepository.cs
│   │   │   │
│   │   │   ├── Services/
│   │   │   │   ├── JwtTokenService.cs
│   │   │   │   ├── PasswordHashingService.cs
│   │   │   │   ├── ImageUploadService.cs
│   │   │   │   ├── EmailService.cs
│   │   │   │   └── CacheService.cs
│   │   │   │
│   │   │   ├── External/
│   │   │   │   ├── S3StorageService.cs
│   │   │   │   └── EmailProviderService.cs
│   │   │   │
│   │   │   └── MaloPazarche.Infrastructure.csproj
│   │   │
│   │   └── MaloPazarche.Tests/
│   │       ├── Unit/
│   │       │   ├── Services/
│   │       │   │   ├── AuthServiceTests.cs
│   │       │   │   ├── ProductServiceTests.cs
│   │       │   │   └── ...
│   │       │   └── Controllers/
│   │       │       ├── ProductsControllerTests.cs
│   │       │       └── ...
│   │       ├── Integration/
│   │       │   ├── AuthIntegrationTests.cs
│   │       │   ├── ProductsIntegrationTests.cs
│   │       │   └── ChatHubTests.cs
│   │       └── MaloPazarche.Tests.csproj
│   │
│   ├── MaloPazarche.sln
│   ├── .gitignore
│   ├── docker-compose.yml (for local dev)
│   ├── Dockerfile
│   └── README.md
│
├── docker-compose.yml (root level)
├── .gitignore (root)
├── README.md (root)
├── CONTRIBUTING.md
└── LICENSE
```

---

## Frontend Setup Instructions

### Prerequisites
- Node.js 18+ (use nvm for version management)
- npm or yarn

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Update .env.local with your backend URL
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
# NEXT_PUBLIC_WS_URL=ws://localhost:5000

# Start development server
npm run dev

# Frontend will be available at http://localhost:3000
```

### Build for Production

```bash
# Build optimized bundle
npm run build

# Start production server
npm run start
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run format       # Format code with Prettier
```

---

## Backend Setup Instructions

### Prerequisites
- .NET 8 SDK (install from dotnet.microsoft.com)
- PostgreSQL 14+
- Visual Studio 2022 / Visual Studio Code + C# extension

### Installation

```bash
# Navigate to backend directory
cd backend

# Restore NuGet packages
dotnet restore

# Create appsettings.Development.json
cp src/MaloPazarche.API/appsettings.json src/MaloPazarche.API/appsettings.Development.json

# Update connection strings in appsettings.Development.json
# "DefaultConnection": "Server=localhost;Port=5432;Database=malopazeche;User Id=postgres;Password=your_password;"

# Create database and run migrations
dotnet ef database update -p src/MaloPazarche.Infrastructure

# Start development server
dotnet run --project src/MaloPazarche.API

# API will be available at http://localhost:5000
# Swagger docs at http://localhost:5000/swagger
```

### Build for Production

```bash
# Build release configuration
dotnet build -c Release

# Publish to output directory
dotnet publish -c Release -o ./publish
```

### Available Commands

```bash
dotnet run                          # Run application
dotnet test                         # Run all tests
dotnet ef migrations add <name>    # Create migration
dotnet ef database update          # Apply migrations
dotnet format                      # Format code
```

---

## Environment Variables

### Frontend (.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WS_URL=ws://localhost:5000

# Image CDN
NEXT_PUBLIC_IMAGE_CDN=https://cdn.malopazeche.mk

# App Configuration
NEXT_PUBLIC_APP_NAME=MaloPazarche
NEXT_PUBLIC_ENVIRONMENT=development

# Sentry (optional, for error tracking)
NEXT_PUBLIC_SENTRY_DSN=
```

### Backend (appsettings.Development.json)

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=5432;Database=malopazeche;User Id=postgres;Password=devpassword;"
  },
  "Redis": {
    "ConnectionString": "localhost:6379"
  },
  "Jwt": {
    "SecretKey": "your-very-long-secret-key-must-be-at-least-32-characters-long",
    "Issuer": "malopazeche.mk",
    "Audience": "malopazeche-users"
  },
  "Storage": {
    "Provider": "Local",
    "LocalPath": "./uploads"
  },
  "AllowedHosts": "*"
}
```

---

## Docker Setup

### Quick Start with Docker

```bash
# From root directory
docker-compose up -d

# Check if services are running
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (CAUTION: deletes data)
docker-compose down -v
```

### Dockerfile for Backend

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["src/MaloPazarche.API/MaloPazarche.API.csproj", "src/MaloPazarche.API/"]
COPY ["src/MaloPazarche.Application/MaloPazarche.Application.csproj", "src/MaloPazarche.Application/"]
COPY ["src/MaloPazarche.Infrastructure/MaloPazarche.Infrastructure.csproj", "src/MaloPazarche.Infrastructure/"]
COPY ["src/MaloPazarche.Domain/MaloPazarche.Domain.csproj", "src/MaloPazarche.Domain/"]

RUN dotnet restore "src/MaloPazarche.API/MaloPazarche.API.csproj"
COPY . .

WORKDIR "/src/src/MaloPazarche.API"
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MaloPazarche.API.dll"]
```

### Dockerfile for Frontend

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Testing Setup

### Frontend Testing

```bash
cd frontend

# Install testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Create jest.config.js
npm run test

# Run tests with coverage
npm run test -- --coverage

# Watch mode
npm run test:watch
```

**Example Test:**
```typescript
// components/feed/ProductCard.test.tsx
import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  it('renders product title', () => {
    const product = {
      id: '1',
      title: 'Vintage Jacket',
      price: 25,
      // ... other properties
    };

    render(<ProductCard product={product} />);
    
    expect(screen.getByText('Vintage Jacket')).toBeInTheDocument();
  });
});
```

### Backend Testing

```bash
cd backend

# Run all tests
dotnet test

# Run tests with coverage
dotnet test /p:CollectCoverage=true

# Run specific test project
dotnet test src/MaloPazarche.Tests/
```

**Example Test:**
```csharp
// MaloPazarche.Tests/Unit/Services/AuthServiceTests.cs
public class AuthServiceTests
{
    [Fact]
    public async Task RegisterAsync_WithValidData_CreatesUser()
    {
        // Arrange
        var authService = new AuthService(/* dependencies */);
        var request = new RegisterRequestDTO
        {
            Username = "testuser",
            Email = "test@example.com",
            Password = "SecurePass123!"
        };

        // Act
        var result = await authService.RegisterAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("testuser", result.User.Username);
    }
}
```

---

## Code Organization Best Practices

### Organizing Imports

**Frontend:**
```typescript
// 1. External libraries
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 2. Local components
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/feed/ProductCard';

// 3. Hooks
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';

// 4. Store
import { useFeedStore } from '@/store/feedStore';

// 5. Types
import type { Product } from '@/types/product';

// 6. Services
import { productsService } from '@/services/products.service';

// 7. Utils
import { formatDate } from '@/utils/dates';
```

**Backend:**
```csharp
// 1. System namespaces
using System;
using System.Collections.Generic;
using System.Linq;

// 2. Third-party namespaces
using AutoMapper;
using Microsoft.EntityFrameworkCore;

// 3. Application namespaces
using MaloPazarche.Application.DTOs;
using MaloPazarche.Infrastructure.Repositories;
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  frontend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm ci
      - run: cd frontend && npm run lint
      - run: cd frontend && npm run type-check
      - run: cd frontend && npm run test -- --coverage

  backend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '8.0'
      - run: cd backend && dotnet restore
      - run: cd backend && dotnet build
      - run: cd backend && dotnet test

  deploy:
    needs: [frontend-test, backend-test]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: |
          # Add your deployment commands here
          echo "Deploying to production..."
```

This comprehensive structure ensures maintainability, scalability, and professional development practices.
