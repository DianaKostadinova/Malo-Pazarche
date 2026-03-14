# MaloPazarche - Development Roadmap & MVP Plan

## Development Phases

```
┌─────────────────────────────────────────────────────────────┐
│                    PHASE 0: SETUP                            │
│                    (Weeks 1-2)                              │
├─────────────────────────────────────────────────────────────┤
│ • Initialize Git repository                                  │
│ • Create frontend (Next.js) and backend (.NET 8) projects    │
│ • Set up PostgreSQL development database                     │
│ • Configure Docker and docker-compose                        │
│ • Set up CI/CD pipeline (GitHub Actions)                     │
│ • Create API documentation (Swagger)                         │
│ • Set up testing frameworks (Jest, xUnit)                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              PHASE 1: AUTHENTICATION & USERS                 │
│                    (Weeks 3-4)                              │
├─────────────────────────────────────────────────────────────┤
│ Backend:                                                     │
│ • ImplementJWT authentication system                         │
│ • Create User model and database migrations                  │
│ • Build AuthService with register/login/logout              │
│ • Implement password hashing (BCrypt)                        │
│ • Create UserService for profile management                  │
│ • Add role-based authorization (Buyer/Seller)               │
│                                                              │
│ Frontend:                                                    │
│ • Create login page with form validation                    │
│ • Create registration page with role selection              │
│ • Build auth context and Zustand store                      │
│ • Set up protected routes                                   │
│ • Implement token refresh logic                             │
│ • Add logout functionality                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│         PHASE 2: PRODUCTS & BASIC CRUD                       │
│                    (Weeks 5-6)                              │
├─────────────────────────────────────────────────────────────┤
│ Backend:                                                     │
│ • Create Product model with relationships                    │
│ • Build ProductService for CRUD operations                   │
│ • Implement image upload to file system (local)              │
│ • Add ProductDTO and validation                              │
│ • Create repository layer for products                       │
│ • Implement soft deletes                                     │
│                                                              │
│ Frontend:                                                    │
│ • Create product creation form                              │
│ • Add image upload with preview                             │
│ • Build product card component                              │
│ • Create product detail page                                │
│ • Add edit/delete functionality                             │
│ • Implement form validation (React Hook Form + Zod)         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│           PHASE 3: FEED & PAGINATION                         │
│                    (Weeks 7-8)                              │
├─────────────────────────────────────────────────────────────┤
│ Backend:                                                     │
│ • Implement feed endpoint with pagination                    │
│ • Add filtering by category, size, condition                │
│ • Add sorting options (newest, trending)                     │
│ • Optimize queries with eager loading                        │
│ • Add indexes to database                                    │
│ • Implement caching (Memory cache initially)                │
│                                                              │
│ Frontend:                                                    │
│ • Create Instagram-style feed component                     │
│ • Implement infinite scroll                                 │
│ • Add filters and sorting UI                                │
│ • Create ProductFeed component                              │
│ • Add loading states and skeletons                          │
│ • Implement React Query for data fetching                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│        PHASE 4: INTERACTIONS (Likes, Comments)               │
│                    (Weeks 9-10)                             │
├─────────────────────────────────────────────────────────────┤
│ Backend:                                                     │
│ • Create Like model and InteractionService                   │
│ • Build comment system (CRUD)                                │
│ • Add like/unlike endpoints                                 │
│ • Implement comment endpoints                               │
│ • Add comment count and like count to product               │
│ • Handle authorization for comments                         │
│                                                              │
│ Frontend:                                                    │
│ • Create LikeButton component with animation                │
│ • Build CommentSection with list                            │
│ • Add CommentForm for posting comments                      │
│ • Implement optimistic updates                              │
│ • Add comment deletion by author                            │
│ • Real-time update of like/comment counts                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│         PHASE 5: SAVED ITEMS & USER PROFILE                  │
│                    (Weeks 11-12)                            │
├─────────────────────────────────────────────────────────────┤
│ Backend:                                                     │
│ • Create SavedPost model                                     │
│ • Implement save/unsave product endpoints                    │
│ • Build user profile service                                │
│ • Add follower/following system                             │
│ • Create user stats (products, followers, etc)              │
│ • Fetch user's products endpoint                            │
│                                                              │
│ Frontend:                                                    │
│ • Create user profile page                                  │
│ • Build saved items page                                    │
│ • Add SaveButton component                                  │
│ • Create ProductGrid for profile                            │
│ • Add follower/following UI                                 │
│ • Implement follow/unfollow button                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│           PHASE 6: REAL-TIME CHAT & MESSAGING                │
│                    (Weeks 13-15)                            │
├─────────────────────────────────────────────────────────────┤
│ Backend:                                                     │
│ • Set up ASP.NET SignalR                                    │
│ • Create ChatHub for real-time messaging                    │
│ • Implement Conversation and Message models                 │
│ • Build MessageService                                       │
│ • Add typing indicators                                      │
│ • Implement message persistence                             │
│ • Create conversation endpoints (REST)                      │
│ • Add message read status                                    │
│                                                              │
│ Frontend:                                                    │
│ • Create ChatWindow component                               │
│ • Build messages list                                       │
│ • Implement message input with send                         │
│ • Add typing indicator                                      │
│ • Create ConversationList (inbox)                           │
│ • Implement real-time message delivery via SignalR          │
│ • Add online status indicators                              │
│ • Create useChat custom hook                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│         PHASE 7: SEARCH & ADVANCED FILTERING                 │
│                    (Weeks 16-17)                            │
├─────────────────────────────────────────────────────────────┤
│ Backend:                                                     │
│ • Create SearchService with multi-field search              │
│ • Add product search endpoint                                │
│ • Add shop/seller search endpoint                            │
│ • Implement full-text search optimization                    │
│ • Add advanced filters (price range, condition)             │
│ • Create search suggestions/autocomplete                    │
│ • Implement search caching                                  │
│                                                              │
│ Frontend:                                                    │
│ • Create SearchBar with autocomplete                        │
│ • Build SearchPage with results                             │
│ • Create FiltersPanel component                             │
│ • Add category filter                                       │
│ • Add size filter checkboxes                                │
│ • Add price range slider                                    │
│ • Implement filter state management                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│        PHASE 8: BOOSTING & MONETIZATION (OPTIONAL)           │
│                    (Weeks 18-19)                            │
├─────────────────────────────────────────────────────────────┤
│ Backend:                                                     │
│ • Create BoostedPost model                                   │
│ • Implement boost products endpoint                          │
│ • Add boost duration logic                                   │
│ • Create pricing tiers in database                           │
│ • Add boost status check in feed                             │
│ • Implement payment placeholder (TODO)                       │
│                                                              │
│ Frontend:                                                    │
│ • Add "Boost Post" button on seller products               │
│ • Create BoostModal with pricing options                    │
│ • Add boost indicator/badge on products                      │
│ • Implement boost management in seller dashboard            │
│ • Show boosted until date                                    │
│ • Create payment integration placeholder                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│        PHASE 9: NOTIFICATIONS & POLISH                       │
│                    (Weeks 20-21)                            │
├─────────────────────────────────────────────────────────────┤
│ Backend:                                                     │
│ • Create Notification model                                  │
│ • Implement NotificationService                              │
│ • Send notifications for likes, comments, follows           │
│ • Add notification persistence                              │
│ • Create notification endpoints (mark as read)              │
│ • Add email notifications (optional)                        │
│ • Set up push notifications (optional)                      │
│                                                              │
│ Frontend:                                                    │
│ • Create NotificationBell in navbar                         │
│ • Build NotificationsPage                                   │
│ • Add real-time notification via SignalR                    │
│ • Implement notification sounds (optional)                  │
│ • Add notification badge with count                         │
│ • Create notification filtering/sorting                     │
│ • Implement notification read/unread status                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│         PHASE 10: TESTING & DEPLOYMENT                       │
│                    (Weeks 22-23)                            │
├─────────────────────────────────────────────────────────────┤
│ Testing:                                                     │
│ • Unit tests for services (target 80% coverage)             │
│ • Integration tests for controllers                          │
│ • E2E tests for critical flows                               │
│ • Load testing (k6 or Apache JMeter)                        │
│ • Security testing (OWASP)                                   │
│                                                              │
│ Deployment:                                                  │
│ • Set up production PostgreSQL                               │
│ • Configure environment variables                            │
│ • Set up Docker containers                                  │
│ • Deploy to Heroku/Azure/AWS                                 │
│ • Configure CDN for images (AWS S3 + CloudFront)            │
│ • Set up monitoring and logging                             │
│ • Create database backups schedule                          │
│ • Document deployment process                               │
└─────────────────────────────────────────────────────────────┘
```

---

## MVP Feature Checklist

### Core Features
- [x] User registration and login
- [x] User profiles (basic info)
- [x] Product posting (up to 10 images)
- [x] Product feed with pagination
- [x] Product detail view
- [x] Like/unlike products
- [x] Save products for later
- [x] Comment on products
- [x] Follow sellers
- [x] Real-time messaging between buyers and sellers
- [x] Search products by title
- [x] Filter by category
- [x] Seller dashboard (view own products)
- [x] Buyer dashboard (view saved/liked)
- [x] Mobile responsive UI

### Optional/Phase 2
- [ ] Email notifications
- [ ] Push notifications
- [ ] Post boosting with payment
- [ ] Advanced search (Elasticsearch)
- [ ] Seller ratings/reviews
- [ ] Price history
- [ ] Bulk product import
- [ ] Video uploads
- [ ] Social sharing
- [ ] Shopping bag/wishlist
- [ ] User verification
- [ ] Report/block users
- [ ] Admin dashboard

---

## Technology Decisions

### Frontend Decision Matrix
| Requirement | Next.js | Vite + React | Svelte | Vue |
|------------|---------|-----------|--------|-----|
| Build Time | Fast | ⭐⭐⭐ Fastest | Medium | Fast |
| SEO | ⭐⭐⭐ Built-in | 📦 Manual | Good | Good |
| Community | ⭐⭐⭐ Huge | Large | Growing | Large |
| Learning Curve | Moderate | Easy | Easy | Easy |
| **Recommendation** | **✅ Best choice** | Alternative | Not for MVP | Not for MVP |

**Justification**: Next.js provides built-in SSR, API routes, image optimization, and strong ecosystem. Perfect for Instagram-style app with dynamic content.

### Backend Decision Matrix
| Requirement | ASP.NET Core | Node.js | Django | Go |
|------------|---|---|---|---|
| Performance | ⭐⭐⭐ | Good | Moderate | ⭐⭐⭐ |
| Real-time (WebSocket) | ⭐⭐⭐ SignalR | Good | Channels | Good |
| ORM | EF Core | Sequelize | Django ORM | sqlc |
| Enterprise | ⭐⭐⭐ | Good | Good | Growing |
| **Recommendation** | **✅ Best choice** | Alternative | Not for MVP | Alternative |

**Justification**: ASP.NET Core offers best-in-class real-time messaging with SignalR, excellent performance, strong typing, and enterprise features. Superior to Node.js for scalability.

### Database Decision Matrix
| Requirement | PostgreSQL | MySQL | MongoDB | CockroachDB |
|------------|---|---|---|---|
| ACID | ⭐⭐⭐ | ⭐⭐⭐ | Limited | ⭐⭐⭐ |
| Scaling | Good | Good | ⭐⭐⭐ | ⭐⭐⭐ |
| Ecosystem | ⭐⭐⭐ | ⭐⭐⭐ | Good | Growing |
| **Recommendation** | **✅ Best choice** | Alternative | Not for relational | Future migration |

**Justification**: PostgreSQL is industry standard for relational data, excellent for complex queries, has mature replication/sharding options, and strong JSON support.

---

## Development Environment Setup

### Local Development with Docker

```yaml
# docker-compose.yml
version: '3.9'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: malopazeche
      POSTGRES_PASSWORD: devpassword
      POSTGRES_DB: malopazeche
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - ConnectionStrings__DefaultConnection=Server=postgres;Port=5432;Database=malopazeche;User Id=malopazeche;Password=devpassword
      - Redis__ConnectionString=redis:6379
      - Jwt__SecretKey=your-dev-secret-key-min-32-chars
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend/src:/app/src

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:5000/api
      - NEXT_PUBLIC_WS_URL=ws://localhost:5000
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  postgres_data:
```

Commands:
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop all
docker-compose down

# Reset database
docker-compose down -v && docker-compose up -d
```

---

## Code Quality Standards

### Naming Conventions

**Backend (C#)**
```csharp
// Classes: PascalCase
public class ProductService { }

// Methods: PascalCase
public async Task<ProductDTO> GetProductAsync(Guid id) { }

// Variables: camelCase
var productId = Guid.NewGuid();
var _cacheService = serviceProvider.GetService<ICacheService>();

// Constants: UPPER_SNAKE_CASE
private const string CACHE_KEY_PREFIX = "product_";
```

**Frontend (TypeScript)**
```typescript
// Components: PascalCase
export const ProductCard = ({ product }: Props) => { }

// Functions: camelCase
const fetchProducts = async () => { }

// Variables: camelCase
const [isLoading, setIsLoading] = useState(false);

// Constants: UPPER_SNAKE_CASE
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/product-creation

# Commit with conventional commits
git commit -m "feat(products): add product creation endpoint"
# Format: <type>(<scope>): <message>
# Types: feat, fix, docs, style, refactor, test, ci, chore

# Push and create PR
git push origin feature/product-creation

# PR naming: [TYPE] Brief description
# Example: [FEATURE] Implement products CRUD
```

### Code Review Checklist

- [ ] Code follows naming conventions
- [ ] Comments for complex logic
- [ ] No hardcoded values (use constants/config)
- [ ] Error handling with meaningful messages
- [ ] All dependencies injected (not instantiated)
- [ ] Database queries optimized (no N+1)
- [ ] API responses consistent format
- [ ] Frontend components reusable
- [ ] Tests included for new features
- [ ] No console.logs in production code

---

## Success Metrics

### Phase Completion Criteria

| Phase | Criteria | Estimated Time |
|-------|----------|-----------------|
| 1 | Users can register and log in | 2 weeks |
| 2 | Sellers can post products | 2 weeks |
| 3 | Users can browse feed with pagination | 2 weeks |
| 4 | Users can like and comment | 2 weeks |
| 5 | Users have profiles and can save items | 2 weeks |
| 6 | Real-time messaging works | 3 weeks |
| 7 | Search and filters implemented | 2 weeks |
| 8 | Boosting system ready | 2 weeks |
| 9 | Notifications system complete | 2 weeks |
| 10 | Full testing and deployment | 2 weeks |

**Total: 23 weeks (~5.5 months)**

### MVP Launch Checklist

Frontend:
- [x] All pages load without errors
- [x] Responsive design (mobile, tablet, desktop)
- [x] Form validation works
- [x] Authentication persists across refresh
- [x] No console errors
- [x] Images load and cache
- [x] Real-time chat works
- [x] Notifications display
- [x] Search functional
- [x] Lighthouse score > 80

Backend:
- [x] All endpoints tested
- [x] Error handling consistent
- [x] Database migrations work
- [x] Authentication secure
- [x] Rate limiting active
- [x] Logging functional
- [x] Health check endpoint working
- [x] API documentation complete
- [x] Performance benchmarks met
- [x] Security audit passed

DevOps:
- [x] CI/CD pipeline working
- [x] Staging environment mirrors production
- [x] Database backups scheduled
- [x] Monitoring configured
- [x] Alerting configured
- [x] Deployment runbook documented

---

## Risk Management

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| SignalR stability issues | Low | High | Early integration testing, fallback to polling |
| Database performance | Medium | High | Early indexing, query optimization, load testing |
| Image upload performance | Medium | Medium | CDN, compression, background processing |
| Security vulnerabilities | Low | Critical | Code review, penetration testing, OWASP compliance |
| Scope creep | High | High | Strict MVP definition, no feature requests til v1 |
| Team member unavailable | Medium | Medium | Documentation, pair programming, knowledge sharing |

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Database migrations tested
- [ ] Environment variables set
- [ ] Secrets configured securely
- [ ] Backup created
- [ ] Rollback plan ready

### Deployment
- [ ] Deploy backend services
- [ ] Run database migrations
- [ ] Deploy frontend
- [ ] Verify URLs working
- [ ] Test critical user flows
- [ ] Monitor error logs
- [ ] Monitor performance metrics

### Post-Deployment
- [ ] Announce to team
- [ ] Monitor for 24 hours
- [ ] Collect user feedback
- [ ] Document any issues
- [ ] Plan next iteration
