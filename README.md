# MaloPazarche - Instagram-Style Thrift Marketplace

**A modern, scalable full-stack marketplace platform for buying and selling second-hand items.**

```
 ███╗   ███╗ █████╗ ██╗      ██████╗     ██████╗  █████╗ ███████╗ █████╗ ██████╗  ██████╗██╗  ██╗███████╗
 ████╗ ████║██╔══██╗██║     ██╔═══██╗    ██╔══██╗██╔══██╗██╔════╝██╔══██╗██╔══██╗██╔════╝██║  ██║██╔════╝
 ██╔████╔██║███████║██║     ██║   ██║    ██████╔╝███████║███████╗███████║██████╔╝██║     ███████║█████╗
 ██║╚██╔╝██║██╔══██║██║     ██║   ██║    ██╔═══╝ ██╔══██║╚════██║██╔══██║██╔══██╗██║     ██╔══██║██╔══╝
 ██║ ╚═╝ ██║██║  ██║███████╗╚██████╔╝    ██║     ██║  ██║███████║██║  ██║██║  ██║╚██████╗██║  ██║███████╗
 ╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝ ╚═════╝     ╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝
                                                                                                              
"Small Market" - Connecting thrift enthusiasts across Macedonia and beyond
```

---

## 🎯 Project Overview

MaloPazarche is an **Instagram-style thrift marketplace** where users scroll through product posts, interact with sellers through comments and real-time messaging, and purchase second-hand items. The platform does NOT process payments—buyers contact sellers directly to arrange transactions.

### Key Features

✅ **User Management**
- Registration with role selection (Buyer/Seller/Both)
- Profile management and customization
- Follow/unfollow sellers

✅ **Product Posting**
- Multi-image product uploads (up to 10 images)
- Detailed product descriptions
- Category, size, and condition selection
- Mark products as sold/available

✅ **Instagram-Style Feed**
- Infinitely scrolling feed
- Filter by category, size, condition
- Sort by newest, most liked, trending
- Real-time like counts and comments

✅ **Social Interactions**
- Like/unlike products
- Comment on products
- Save products for later
- Follow sellers

✅ **Real-Time Messaging**
- WebSocket-based chat between buyers and sellers
- Message history persistence
- Typing indicators
- Online status

✅ **Search & Discovery**
- Full-text search products
- Search shops/sellers
- Advanced filtering
- Autocomplete suggestions

✅ **Post Boosting** (Optional)
- Sellers can boost posts for visibility
- Configurable boost duration
- Ranking in feed

---

## 🏗️ Technology Stack

### Frontend
- **Framework**: Next.js 14+ (React 18+)
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **HTTP Client**: Axios + React Query (TanStack Query)
- **Real-time**: Socket.io / Native WebSocket + @microsoft/signalr
- **Form Handling**: React Hook Form + Zod
- **Testing**: Jest + React Testing Library

### Backend
- **Runtime**: .NET 8
- **Framework**: ASP.NET Core Web API
- **Authentication**: JWT + Refresh Tokens
- **Real-time**: ASP.NET SignalR
- **ORM**: Entity Framework Core
- **Validation**: FluentValidation
- **Logging**: Serilog
- **Testing**: xUnit + Moq

### Database & Infrastructure
- **Database**: PostgreSQL 14+
- **Cache**: Redis (optional, for scaling)
- **Storage**: AWS S3 / Alternative (images)
- **CDN**: CloudFront (for scaling)
- **Background Jobs**: Hangfire
- **Containerization**: Docker & Docker Compose

---

## 📋 Prerequisites

### Required
- **Node.js 18+** (for frontend)
- **.NET 8 SDK** (for backend)
- **PostgreSQL 14+** (for database)
- **Docker & Docker Compose** (recommended)
- **Git** (for version control)

### Optional
- **Visual Studio 2022** or **VS Code** with extensions
- **Postman** or **Insomnia** (for API testing)
- **pgAdmin** (for database visualization)

---

## 🚀 Quick Start

### Option 1: Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/MaloPazarche.git
cd MaloPazarche

# Start all services
docker-compose up -d

# Wait for services to be ready (30-60 seconds)
docker-compose ps

# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# Swagger Docs: http://localhost:5000/swagger
# PostgreSQL: localhost:5432
# Redis: localhost:6379
```

### Option 2: Manual Setup

#### Backend Setup

```bash
cd backend

# Restore dependencies
dotnet restore

# Update appsettings.Development.json with your database connection string
# "Server=localhost;Port=5432;Database=malopazeche;User Id=postgres;Password=YourPassword;"

# Run migrations
dotnet ef database update -p src/MaloPazarche.Infrastructure

# Start the server
dotnet run --project src/MaloPazarche.API

# API will be available at http://localhost:5000
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
echo "NEXT_PUBLIC_WS_URL=ws://localhost:5000" >> .env.local

# Start development server
npm run dev

# Frontend will be available at http://localhost:3000
```

---

## 📁 Project Structure

```
MaloPazarche/
├── docs/                          # Complete documentation
│   ├── 01-SYSTEM_ARCHITECTURE.md
│   ├── 02-FRONTEND_ARCHITECTURE.md
│   ├── 03-BACKEND_ARCHITECTURE.md
│   ├── 04-DATABASE_DESIGN.md
│   ├── 05-CHAT_SYSTEM.md
│   ├── 06-AUTHENTICATION.md
│   ├── 07-SCALABILITY.md
│   ├── 08-DEVELOPMENT_ROADMAP.md
│   └── 09-PROJECT_STRUCTURE.md
│
├── frontend/                      # Next.js React application
│   ├── app/                       # App router
│   ├── components/                # React components
│   ├── hooks/                     # Custom React hooks
│   ├── services/                  # API integrations
│   ├── store/                     # Zustand stores
│   ├── types/                     # TypeScript types
│   └── utils/                     # Utility functions
│
├── backend/                       # ASP.NET Core API
│   └── src/
│       ├── MaloPazarche.API/      # API layer (controllers, hubs)
│       ├── MaloPazarche.Application/  # Business logic (services)
│       ├── MaloPazarche.Domain/   # Domain models (entities)
│       ├── MaloPazarche.Infrastructure/  # Data access (repositories)
│       └── MaloPazarche.Tests/    # Unit & integration tests
│
└── docker-compose.yml             # Docker composition for local dev
```

---

## 🔑 Key Endpoints

### Authentication
```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login with email and password
POST   /api/auth/refresh           Refresh JWT token
POST   /api/auth/logout            Logout user
```

### Products
```
GET    /api/products/feed          Get product feed with pagination
GET    /api/products/{id}          Get product details
POST   /api/products               Create new product (sellers only)
PUT    /api/products/{id}          Update product
DELETE /api/products/{id}          Delete product
```

### Interactions
```
POST   /api/interactions/likes/{productId}      Like product
DELETE /api/interactions/likes/{productId}      Unlike product
POST   /api/interactions/saves/{productId}      Save product
DELETE /api/interactions/saves/{productId}      Unsave product
POST   /api/interactions/comments/{productId}   Add comment
DELETE /api/interactions/comments/{commentId}   Delete comment
```

### Messages
```
GET    /api/messages/conversations             Get user's conversations
GET    /api/messages/conversations/{id}        Get conversation messages
POST   /api/messages                           Send message
WebSocket /hubs/chat                           Real-time chat hub
```

### Users & Profiles
```
GET    /api/users/{username}       Get user profile
PUT    /api/users/profile          Update profile
POST   /api/users/{id}/follow      Follow user
DELETE /api/users/{id}/follow      Unfollow user
GET    /api/users/{username}/products   Get user's products
```

### Search
```
GET    /api/search/products?q=query    Search products
GET    /api/search/users?q=query       Search sellers
```

---

## 🔐 Authentication

The platform uses **JWT (JSON Web Tokens)** for stateless authentication.

### Flow
1. User registers or logs in
2. Backend returns `accessToken` (1 hour) and `refreshToken` (7 days)
3. Frontend stores tokens in httpOnly cookies
4. Each API request includes: `Authorization: Bearer <accessToken>`
5. When access token expires, use refresh token to get a new one
6. Frontend automatically handles token refresh

### Security Features
- ✅ bcrypt password hashing (cost factor 11)
- ✅ httpOnly cookies (XSS protection)
- ✅ Secure flag (HTTPS only)
- ✅ SameSite=Strict (CSRF protection)
- ✅ Password requirements (min 8 chars, uppercase, number, special)

---

## 📊 Database Schema

### Core Tables
- **users** - User accounts with roles
- **products** - Product listings
- **product_images** - Product images
- **likes** - Product likes
- **comments** - Product comments
- **saved_posts** - Saved products for later
- **followers** - User follow relationships
- **conversations** - Chat conversations
- **messages** - Chat messages
- **notifications** - User notifications
- **boosted_posts** - Boosted products for visibility

See [04-DATABASE_DESIGN.md](docs/04-DATABASE_DESIGN.md) for complete schema.

---

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run test                # Run all tests
npm run test:watch         # Watch mode
npm run test -- --coverage # With coverage report
```

### Backend Testing
```bash
cd backend
dotnet test                                    # Run all tests
dotnet test --filter="TestClass=AuthService"  # Run specific tests
dotnet test /p:CollectCoverage=true          # With coverage
```

---

## 🌍 Deployment

### Staging Environment
```bash
# Build Docker images
docker build -t malopazeche-backend ./backend
docker build -t malopazeche-frontend ./frontend

# Push to Docker registry (e.g., Docker Hub, ECR)
docker push malopazeche-backend:latest
docker push malopazeche-frontend:latest

# Deploy to Kubernetes or Heroku (configure as needed)
```

### Production Checklist
- [ ] Environment variables configured
- [ ] Database backups enabled
- [ ] SSL/TLS certificates installed
- [ ] Monitoring and alerting configured
- [ ] Rate limiting enabled
- [ ] CORS configured for production domain
- [ ] CDN configured for images
- [ ] Error tracking (Sentry) enabled
- [ ] Analytics configured
- [ ] Security audit completed

---

## 📈 Scaling Strategy

The architecture is designed to scale from MVP (100 users) to enterprise (1M+ users):

**Phase 1: MVP**
- Single server deployment
- In-memory caching
- PostgreSQL on same instance

**Phase 2: Growth (10K users)**
- Load-balanced servers
- PostgreSQL read replicas
- Redis caching
- CloudFront CDN

**Phase 3: Scale (100K+ users)**
- Kubernetes orchestration
- Database sharding
- Multi-region deployment
- Message queue (RabbitMQ)
- Elasticsearch for search

See [07-SCALABILITY.md](docs/07-SCALABILITY.md) for details.

---

## 📚 Documentation

Complete technical documentation is available in the `docs/` folder:

1. **[01-SYSTEM_ARCHITECTURE.md](docs/01-SYSTEM_ARCHITECTURE.md)** - Overall system design
2. **[02-FRONTEND_ARCHITECTURE.md](docs/02-FRONTEND_ARCHITECTURE.md)** - React/Next.js structure
3. **[03-BACKEND_ARCHITECTURE.md](docs/03-BACKEND_ARCHITECTURE.md)** - .NET 8 API design
4. **[04-DATABASE_DESIGN.md](docs/04-DATABASE_DESIGN.md)** - PostgreSQL schema
5. **[05-CHAT_SYSTEM.md](docs/05-CHAT_SYSTEM.md)** - SignalR real-time messaging
6. **[06-AUTHENTICATION.md](docs/06-AUTHENTICATION.md)** - JWT authentication
7. **[07-SCALABILITY.md](docs/07-SCALABILITY.md)** - Scaling strategies
8. **[08-DEVELOPMENT_ROADMAP.md](docs/08-DEVELOPMENT_ROADMAP.md)** - MVP development plan
9. **[09-PROJECT_STRUCTURE.md](docs/09-PROJECT_STRUCTURE.md)** - Folder structure & setup

---

## 🤝 Contributing

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Follow commit conventions**
   ```bash
   git commit -m "feat(scope): brief description"
   # Types: feat, fix, docs, style, refactor, test, ci, chore
   ```

3. **Push and create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Code Review Checklist**
   - [ ] Code follows naming conventions
   - [ ] Complex logic is commented
   - [ ] No hardcoded values (use constants)
   - [ ] Error handling implemented
   - [ ] Tests included
   - [ ] No console.logs in production code

---

## 📝 Git Commit Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Example:**
```
feat(products): add product creation endpoint

Added POST /api/products endpoint that allows sellers to create new product listings.
Includes image upload support and validation.

Closes #123
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes
- `refactor` - Code refactoring
- `test` - Adding tests
- `ci` - CI/CD changes
- `chore` - Build, dependencies, etc

---

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Frontend (3000)
lsof -ti:3000 | xargs kill -9

# Backend (5000)
lsof -ti:5000 | xargs kill -9

# PostgreSQL (5432)
lsof -ti:5432 | xargs kill -9
```

**Database Connection Error**
```bash
# Check PostgreSQL is running
docker-compose ps

# Check connection string in appsettings.Development.json
# Format: Server=host;Port=5432;Database=malopazeche;User Id=user;Password=pass;
```

**WebSocket Connection Fails**
```bash
# Make sure backend is running
# Check NEXT_PUBLIC_WS_URL in frontend .env.local
# WebSocket URL should be: ws://localhost:5000 (not http://)
```

---

## 📞 Support

- **Issues**: Create an issue in the repository
- **Discussions**: Use GitHub discussions for questions
- **Email**: dev@malopazeche.mk

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Special Thanks

- The open-source community
- React, Next.js, and .NET communities
- All contributors and supporters

---

## 📊 Project Statistics

- **Total Documentation**: 9 comprehensive guides
- **Frontend Components**: 40+ reusable components
- **Backend Services**: 8 main services
- **Database Tables**: 12 core tables
- **API Endpoints**: 30+ documented endpoints
- **Estimated Development Time**: 23 weeks (MVP)

---

## 🗓️ Roadmap

### Q1 2026: MVP Launch
- ✅ User authentication
- ✅ Product posting
- ✅ Feed & pagination
- ✅ Interactions (likes, comments)
- ✅ Real-time chat
- ✅ Search & filters

### Q2 2026: Growth
- [ ] Post boosting
- [ ] Seller ratings/reviews
- [ ] Push notifications
- [ ] Email notifications
- [ ] Performance optimization

### Q3 2026: Scale
- [ ] Multi-region deployment
- [ ] Advanced search (Elasticsearch)
- [ ] Video uploads
- [ ] Social sharing
- [ ] Admin dashboard

### Q4 2026: Enterprise
- [ ] Microservices architecture
- [ ] Advanced analytics
- [ ] Seller tools & insights
- [ ] API for third-party integrations
- [ ] Mobile apps (iOS/Android)

---

## 📞 Contact

**Project Lead**: [Your Name]
**Email**: dev@malopazeche.mk
**Website**: malopazeche.mk
**GitHub**: github.com/yourusername/MaloPazarche

---

**Made with ❤️ for the thrift community**

*"Small Market" - Connecting people through quality second-hand items*
