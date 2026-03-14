# MaloPazarche - System Architecture

## Overview
MaloPazarche is an **Instagram-style thrift marketplace** built with a modern full-stack architecture. The platform enables users to buy and sell second-hand items with an intuitive, scrollable feed interface.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  (Next.js/React Frontend - Vite + React Alternative)            │
│  - Instagram-style UI                                            │
│  - Real-time updates via WebSocket                               │
│  - JWT authentication                                            │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS/WebSocket
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│                    API GATEWAY / LOAD BALANCER                    │
│  - Route requests to backend services                             │
│  - SSL termination                                                │
└──────────────────────────┬──────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ↓                  ↓                  ↓
┌──────────────┐  ┌──────────────┐  ┌─────────────────┐
│   REST API   │  │   SignalR    │  │   File Storage  │
│  (.NET 8)    │  │   (Real-time)│  │   (AWS S3/CDN)  │
│              │  │              │  │                 │
│ Controllers  │  │ Chat Hub     │  │ Product images  │
│ Services     │  │ Notifications│  │ User avatars    │
│ Repositories │  │              │  │                 │
└──────┬───────┘  └──────┬───────┘  └────────┬────────┘
       │                 │                   │
       └─────────────────┼───────────────────┘
                         │
                         ↓
        ┌────────────────────────────────┐
        │     CACHE LAYER                │
        │ (Redis / In-Memory Cache)      │
        │ - Feed caching                 │
        │ - Session storage              │
        │ - Rate limiting                │
        └────────────────┬───────────────┘
                         │
                         ↓
        ┌────────────────────────────────┐
        │     POSTGRESQL DATABASE        │
        │                                │
        │ - Users                        │
        │ - Products                     │
        │ - Interactions (likes, saves)  │
        │ - Messages                     │
        │ - Followers                    │
        │ - Notifications                │
        │ - BoostedPosts                 │
        └────────────────────────────────┘
```

---

## Component Communication

### 1. **Frontend to Backend**
- **REST API Calls**: POST, GET, PUT, DELETE over HTTP/HTTPS
  - Product feed fetching
  - User actions (likes, comments, saves)
  - Profile updates
  - Search and filtering

- **WebSocket/SignalR**: Real-time bidirectional communication
  - Live chat messages
  - Typing indicators
  - Online status
  - Real-time notifications

### 2. **Authentication Flow**
```
User Login
    ↓
REST API: POST /auth/login
    ↓
Backend validates credentials
    ↓
Generates JWT token + Refresh token
    ↓
Frontend stores JWT in secure httpOnly cookie
    ↓
Subsequent requests include:
  - Authorization: Bearer <JWT>
    ↓
Backend validates JWT using middleware
    ↓
Request is authorized
```

### 3. **Real-time Messaging (SignalR)**
```
User A connects to SignalR Hub
    ↓
Connection ID associated with User A
    ↓
User A sends message → SignalR Hub
    ↓
Hub relays to User B's connection
    ↓
Message saved to PostgreSQL via Repository
    ↓
Both users receive real-time notification
```

---

## Technology Stack

### Frontend
- **Framework**: Next.js 14+ (React) or Vite + React
- **Styling**: Tailwind CSS
- **State Management**: Zustand or Redux
- **HTTP Client**: Fetch API / Axios
- **WebSocket**: Socket.io or Native WebSocket
- **UI Components**: shadcn/ui or custom components
- **Form Handling**: React Hook Form + Zod validation

### Backend
- **Runtime**: .NET 8
- **Framework**: ASP.NET Core Web API
- **Authentication**: JWT tokens
- **Real-time**: ASP.NET SignalR or WebSockets
- **ORM**: Entity Framework Core
- **Logging**: Serilog
- **Validation**: FluentValidation

### Database
- **Primary**: PostgreSQL 14+
- **Cache**: Redis (optional, for scaling)
- **Documents**: S3 bucket or similar (for images)

---

## Data Flow Examples

### Example 1: Viewing Product Feed
```
1. Frontend requests: GET /api/products/feed?page=1&limit=20
2. Backend receives request
3. Validates JWT token
4. Queries PostgreSQL:
   - Fetch products with eager loading of seller info, images
   - Apply pagination
   - Apply filters if provided
5. Returns JSON array to frontend
6. Frontend renders ProductCards
7. User scrolls → triggers infinite scroll
8. Process repeats for next page
```

### Example 2: Creating Product Post
```
1. Frontend: User fills product form → POST /api/products/create
2. Multi-part form data includes:
   - Title, description, category, size, condition
   - Images (binary data)
3. Backend:
   - Validates JWT (ensures seller role)
   - Saves images to S3/File storage
   - Creates Product record in PostgreSQL
   - Associates images with product
4. Returns product ID to frontend
5. Frontend redirects to product detail page
6. Real-time: Notification sent to followers via SignalR
```

### Example 3: Real-time Chat
```
1. User A opens chat with User B
2. Frontend connects to SignalR Hub: connection = await hubConnection.start()
3. Join room: await hubConnection.invoke("JoinConversation", conversationId)
4. SignalR establishes WebSocket connection
5. User A types message → POST /api/messages/send
6. Backend saves message to PostgreSQL
7. Backend broadcasts via SignalR: 
   - await Clients.Group(conversationId).SendAsync("ReceiveMessage", message)
8. User B receives real-time update (no polling needed)
9. Message history loaded from REST API on first load
```

---

## Security Considerations

1. **JWT Tokens**
   - Stored in httpOnly cookies (XSS protection)
   - Include refresh token with longer expiry
   - Validate signature and expiration on each request

2. **CORS**
   - Configure allowed origins
   - Allow credentials in requests

3. **HTTPS**
   - All traffic encrypted
   - Certificates auto-renewed

4. **Rate Limiting**
   - Prevent brute force attacks
   - Limit API calls per user

5. **Input Validation**
   - Server-side validation (never trust client)
   - Sanitize user inputs

6. **Image Uploads**
   - Validate file types and sizes
   - Scan for malware
   - Store outside web root

---

## Scale Considerations

### Database
- Indexing on frequently queried fields (user_id, created_at, category)
- Connection pooling
- Read replicas for heavy queries

### Caching
- Redis for feed caching (expire after 5 minutes)
- Cache user profiles
- Cache product details

### CDN
- CloudFront or Cloudflare for image distribution
- Compress images (WebP format)
- Lazy loading on frontend

### Background Jobs
- Queue service (Hangfire or Azure Service Bus) for:
  - Sending notifications
  - Processing image uploads
  - Generating feed for users
  - Cleaning up old inactive conversations

### Pagination
- Always paginate feed (20-50 items per page)
- Cursor-based pagination for infinite scroll
- Load more on scroll trigger

---

## API Response Example

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "title": "Vintage Leather Jacket",
        "description": "Brown vintage leather, great condition",
        "price": 45,
        "category": "clothing",
        "size": "M",
        "condition": "excellent",
        "images": ["https://cdn.malopazeche.mk/product-1.webp"],
        "seller": {
          "id": "user-123",
          "username": "thrift_shop_skopje",
          "avatar": "https://cdn.malopazeche.mk/avatar-123.webp",
          "isFollowed": false
        },
        "isAvailable": true,
        "isBoosted": true,
        "createdAt": "2026-03-14T10:30:00Z",
        "stats": {
          "likes": 234,
          "comments": 12,
          "saves": 89
        }
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "totalCount": 1523,
      "hasNextPage": true
    }
  },
  "timestamp": "2026-03-14T10:35:00Z"
}
```
