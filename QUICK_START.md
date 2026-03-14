# MaloPazarche - Quick Start Guide

**Get MaloPazarche running in 5 minutes!**

---

## 🚀 5-Minute Setup (Using Docker)

### Prerequisites
- Docker & Docker Compose installed
- Git installed
- 4GB RAM available

### Steps

```bash
# 1. Clone repository
git clone https://github.com/yourusername/MaloPazarche.git
cd MaloPazarche

# 2. Start all services
docker-compose up -d

# 3. Wait for services to be ready (30-60 seconds)
docker-compose ps

# 4. Open in browser
# Frontend:  http://localhost:3000
# Backend:   http://localhost:5000
# API Docs:  http://localhost:5000/swagger
# pgAdmin:   http://localhost:5050
```

**That's it!** The application is now running.

---

## 📝 First Test: Create Account & Post a Product

### 1. Register a Seller Account
- Go to http://localhost:3000
- Click "Sign Up"
- Fill in details:
  - Username: `thrift_shop_01`
  - Email: `seller@example.com`
  - Password: `SecurePass123!`
  - Role: **Seller**
- Click "Register"

### 2. Create a Product
- Click "New Post" in navbar
- Fill in product details:
  - Title: "Vintage Leather Jacket"
  - Description: "Brown leather, excellent condition"
  - Category: "Clothing"
  - Size: "M"
  - Condition: "Excellent"
  - Price: "45"
- Upload an image (or use placeholder)
- Click "Post"

### 3. View Feed
- Go back to home
- See your product in the feed

### 4. Register a Buyer Account
- Open another browser window (or Incognito)
- Register as buyer:
  - Username: `buyer_01`
  - Role: **Buyer**
- Like and comment on the seller's product
- Start a chat with the seller

---

## 🔧 Manual Setup (If Not Using Docker)

### Option A: Backend Setup

```bash
cd backend

# Windows
dotnet ef database update -p src/MaloPazarche.Infrastructure
dotnet run --project src/MaloPazarche.API

# macOS/Linux
dotnet ef database update --project src/MaloPazarche.Infrastructure
dotnet run --project src/MaloPazarche.API
```

**API ready at:** http://localhost:5000

### Option B: Frontend Setup

```bash
cd frontend

npm install
npm run dev
```

**Frontend ready at:** http://localhost:3000

### Option C: Database Setup

```bash
# PostgreSQL CLI
psql -U postgres

# Create database
CREATE DATABASE malopazeche;

# Or use pgAdmin at http://localhost:5050
# Login: admin@malopazeche.mk / admin
```

---

## 📱 Using the Application

### Key Features to Try

**1. Authentication**
- Register with different roles
- Login/Logout
- Token refresh on page reload

**2. Products**
- Create products (sellers only)
- View feed with infinite scroll
- Click product to see details
- Edit/delete own products

**3. Interactions**
- Like/unlike products
- Save products for later
- Comment on products
- View comment section

**4. Profile**
- View user profile
- Follow/unfollow users
- See user's products
- Edit profile (avatar, bio)

**5. Chat** ⭐ (Star Feature)
- Click "Message" on any product
- Start real-time chat
- See typing indicators
- Message history persists

**6. Search** 🔍
- Use search bar to find products
- Filter by category, size, condition
- Sort by newest, trending

---

## 🧪 Testing the API

### Using Postman/Insomnia

#### 1. Register User
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "SecurePass123!",
  "role": "seller"
}
```

#### 2. Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "SecurePass123!"
}
```

Copy the `accessToken` from response.

#### 3. Create Product
```
POST http://localhost:5000/api/products
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data

Form Data:
- title: "Test Product"
- description: "A test product"
- category: "clothing"
- price: "50"
- images: (select a file)
```

#### 4. Get Feed
```
GET http://localhost:5000/api/products/feed?page=1&limit=20
Authorization: Bearer <accessToken>
```

---

## 📊 Checking Service Status

### Using Docker Commands

```bash
# View all services
docker-compose ps

# View logs
docker-compose logs -f backend    # Backend logs
docker-compose logs -f frontend   # Frontend logs
docker-compose logs -f postgres   # Database logs
docker-compose logs -f redis      # Cache logs

# Stop all
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v

# Rebuild and restart
docker-compose up -d --build
```

### Using Browser

- **Frontend**: http://localhost:3000
- **Backend Health**: http://localhost:5000/health
- **Swagger Docs**: http://localhost:5000/swagger/index.html
- **pgAdmin**: http://localhost:5050 (admin@malopazeche.mk / admin)
- **Redis CLI**: `docker exec -it malopazeche-redis redis-cli`

---

## 🐛 Common Issues & Solutions

### Issue 1: "Connection refused" on 5000 or 3000

**Solution:**
```bash
# Kill process using port
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Issue 2: "Database connection error"

**Solution:**
```bash
# Check PostgreSQL container
docker-compose ps postgres

# View logs
docker-compose logs postgres

# If not running, restart
docker-compose restart postgres

# Reset database
docker-compose down -v
docker-compose up -d postgres
```

### Issue 3: "WebSocket connection failed"

**Solution:**
- Ensure backend is running on 5000
- Check browser log (F12 → Console)
- Verify `NEXT_PUBLIC_WS_URL=ws://localhost:5000`
- Restart frontend: `docker-compose restart frontend`

### Issue 4: "Module not found" error

**Solution:**
```bash
# Frontend
docker-compose exec frontend npm install

# Backend
docker-compose exec backend dotnet restore
```

### Issue 5: "CORS error"

**Solution:**
- Check CORS config in `appsettings.Development.json`
- Ensure frontend URL matches CORS settings
- Clear browser cookies and cache

---

## 📚 Next Steps

1. **Read Documentation**
   - Start with [docs/01-SYSTEM_ARCHITECTURE.md](docs/01-SYSTEM_ARCHITECTURE.md)
   - Understand the system overview

2. **Explore the Code**
   - Check frontend components in `frontend/components/`
   - Review backend controllers in `backend/src/MaloPazarche.API/Controllers/`
   - Understand database schema in `docs/04-DATABASE_DESIGN.md`

3. **Run Tests**
   ```bash
   # Frontend tests
   docker-compose exec frontend npm test

   # Backend tests
   docker-compose exec backend dotnet test
   ```

4. **Try Advanced Features**
   - Real-time chat with WebSocket
   - Search and filtering
   - Post boosting
   - Notifications

5. **Contribute**
   - Read [CONTRIBUTING.md](CONTRIBUTING.md)
   - Create a feature branch
   - Submit a PR

---

## 🎯 Development Tips

### Hot Reload
- **Frontend**: Changes auto-reload at http://localhost:3000
- **Backend**: Changes require manual restart

### Database Debugging
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U malopazeche -d malopazeche

# View tables
\dt

# Query
SELECT * FROM users;

# Exit
\q
```

### Cache Inspection
```bash
# Connect to Redis
docker-compose exec redis redis-cli

# View all keys
KEYS *

# Get value
GET user:123

# Clear all
FLUSHALL

# Exit
EXIT
```

### API Testing
```bash
# Test endpoint
curl -X GET http://localhost:5000/health

# With authentication
curl -X GET http://localhost:5000/api/products/feed \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📞 Quick Support

**Something not working?**

1. Check logs: `docker-compose logs -f`
2. View documentation: `docs/` folder
3. Search issues: GitHub issues
4. Ask questions: GitHub discussions

---

## 🎓 Learning Path

### Week 1: Foundation
- [ ] Understand project structure
- [ ] Set up development environment
- [ ] Read system architecture docs
- [ ] Explore database schema

### Week 2: Frontend
- [ ] Study React components
- [ ] Learn state management (Zustand)
- [ ] Understand routing
- [ ] Practice component composition

### Week 3: Backend
- [ ] Learn .NET 8 basics
- [ ] Understand controllers and services
- [ ] Study Entity Framework Core
- [ ] Practice dependency injection

### Week 4: Features
- [ ] Implement authentication
- [ ] Build product CRUD
- [ ] Create listing page
- [ ] Set up real-time chat

---

## ✨ Pro Tips

1. **Use VS Code Extensions**
   - ES7+ React/Redux/React-Native snippets
   - C# extension for .NET
   - REST Client for API testing

2. **Database Queries**
   - Use `EXPLAIN ANALYZE` for optimization
   - Check indexes on frequently queried columns
   - Monitor slow queries in logs

3. **Performance**
   - Use React DevTools to find re-renders
   - Check bundle size: `npm run build`
   - Profile backend with Application Insights

4. **Security**
   - Change default JWT secret in production
   - Use environment variables for sensitive data
   - Never commit `.env` files
   - Validate all user input

5. **Git Workflow**
   - Commit often with meaningful messages
   - Use feature branches
   - Create PRs for code review
   - Follow conventional commits

---

## 🎉 You're Ready!

You now have a running MaloPazarche instance. Start exploring, building, and contributing!

**Happy coding! 🚀**

Questions? Check the [docs](docs/) folder or open an issue.
