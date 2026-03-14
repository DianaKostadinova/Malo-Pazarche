# MaloPazarche - Frontend Architecture

## Overview
The frontend is built with **Next.js** (or Vite + React) providing an Instagram-style user experience with real-time updates, intuitive navigation, and responsive design.

---

## Frontend Tech Stack

```
Framework:        Next.js 14+ (React 18+)
Styling:          Tailwind CSS + Shadcn/UI
State Management: Zustand (lightweight alternative: Redux)
HTTP Client:      Axios + React Query / TanStack Query
Real-time:        Socket.io / Native WebSocket
Forms:            React Hook Form + Zod validation
Routing:          Next.js App Router
Testing:          Jest + React Testing Library
Build:            Vite / Webpack (via Next.js)
```

---

## Folder Structure

```
frontend/
├── app/                          # Next.js app directory
│   ├── page.tsx                  # Home page (feed)
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   │
│   ├── (auth)/                   # Auth layout group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── (feed)/                   # Feed layout group
│   │   ├── page.tsx              # Home feed
│   │   ├── explore/
│   │   │   └── page.tsx          # Explore/Search page
│   │   ├── saved/
│   │   │   └── page.tsx          # Saved items
│   │   └── layout.tsx
│   │
│   ├── products/
│   │   ├── [id]/
│   │   │   └── page.tsx          # Product detail page
│   │   ├── create/
│   │   │   └── page.tsx          # Create product post
│   │   └── edit/
│   │       └── [id]/
│   │           └── page.tsx      # Edit product
│   │
│   ├── profile/
│   │   ├── [username]/
│   │   │   └── page.tsx          # User/Shop profile
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── my-posts/
│   │       └── page.tsx
│   │
│   ├── messages/
│   │   ├── page.tsx              # Messages inbox
│   │   └── [conversationId]/
│   │       └── page.tsx          # Chat window
│   │
│   └── notifications/
│       └── page.tsx              # Notifications list
│
├── components/                   # Reusable components
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── Toast/
│   │   │   ├── Toast.tsx
│   │   │   └── ToastProvider.tsx
│   │   └── ...
│   │
│   ├── layout/
│   │   ├── Navbar.tsx            # Top navigation
│   │   ├── Sidebar.tsx           # Left sidebar navigation
│   │   ├── BottomNav.tsx         # Mobile bottom nav
│   │   └── Header.tsx
│   │
│   ├── feed/
│   │   ├── ProductCard.tsx       # Individual product card
│   │   ├── ProductFeed.tsx       # Feed container with infinite scroll
│   │   ├── InfiniteScroll.tsx    # Infinite scroll wrapper
│   │   └── LoadingSkeletons.tsx
│   │
│   ├── product/
│   │   ├── ProductDetail.tsx     # Full product view
│   │   ├── ProductImages.tsx     # Image gallery
│   │   ├── ProductForm.tsx       # Create/Edit form
│   │   ├── SellerInfo.tsx        # Seller card with follow button
│   │   └── ProductStats.tsx      # Likes, comments, saves
│   │
│   ├── interactions/
│   │   ├── LikeButton.tsx        # Like button with animation
│   │   ├── SaveButton.tsx        # Save button
│   │   ├── CommentSection.tsx    # Comments list
│   │   ├── CommentForm.tsx       # New comment input
│   │   └── Comment.tsx           # Single comment
│   │
│   ├── profile/
│   │   ├── UserProfile.tsx       # User profile page
│   │   ├── ShopProfile.tsx       # Shop/Seller profile
│   │   ├── ProfileHeader.tsx     # Profile header
│   │   ├── ProductGrid.tsx       # Products grid layout
│   │   ├── FollowButton.tsx      # Follow/Unfollow
│   │   └── ProfileStats.tsx      # Follower count, etc
│   │
│   ├── messaging/
│   │   ├── ChatWindow.tsx        # Chat container
│   │   ├── MessageList.tsx       # Messages display
│   │   ├── MessageInput.tsx      # Message input field
│   │   ├── ConversationList.tsx  # Inbox conversations
│   │   ├── TypingIndicator.tsx   # "User is typing..."
│   │   └── Message.tsx           # Single message bubble
│   │
│   ├── search/
│   │   ├── SearchBar.tsx         # Search input with autocomplete
│   │   ├── SearchResults.tsx     # Results list
│   │   ├── FiltersPanel.tsx      # Filters sidebar
│   │   ├── CategoryFilter.tsx    # Category dropdown
│   │   ├── SizeFilter.tsx        # Size selector
│   │   ├── ConditionFilter.tsx   # Condition checkboxes
│   │   └── PriceRangeFilter.tsx  # Price range slider
│   │
│   └── auth/
│       ├── LoginForm.tsx
│       ├── RegisterForm.tsx
│       ├── ProtectedRoute.tsx    # Route protection wrapper
│       └── AuthProvider.tsx      # Auth context provider
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts                # Auth state and methods
│   ├── useChat.ts                # Chat/messaging logic
│   ├── useProducts.ts            # Product fetching with pagination
│   ├── useInfiniteScroll.ts      # Infinite scroll logic
│   ├── useSearch.ts              # Search state
│   ├── useFeed.ts                # Feed state with filters
│   ├── useNotifications.ts       # Notifications WebSocket
│   ├── useUser.ts                # Current user profile
│   └── useAsync.ts               # Generic async hook
│
├── services/                     # API integration services
│   ├── api.ts                    # Axios instance config
│   ├── auth.service.ts           # Auth endpoints
│   ├── products.service.ts       # Products CRUD
│   ├── interactions.service.ts   # Likes, saves, comments
│   ├── users.service.ts          # User profiles, follow
│   ├── messages.service.ts       # Chat and messages
│   ├── search.service.ts         # Search and filters
│   ├── notifications.service.ts  # Notifications
│   └── websocket.service.ts      # WebSocket/SignalR config
│
├── store/                        # Global state management (Zustand)
│   ├── authStore.ts              # Auth state
│   ├── feedStore.ts              # Feed state
│   ├── userStore.ts              # User profile state
│   ├── chatStore.ts              # Chat history state
│   ├── uiStore.ts                # UI state (modals, toasts)
│   └── notificationStore.ts      # Notifications
│
├── types/                        # TypeScript types
│   ├── index.ts
│   ├── api.ts                    # API response types
│   ├── user.ts                   # User types
│   ├── product.ts                # Product types
│   ├── message.ts                # Message types
│   ├── interaction.ts            # Like, comment, save types
│   └── auth.ts                   # Auth types
│
├── utils/                        # Utility functions
│   ├── constants.ts              # API URLs, constants
│   ├── dates.ts                  # Date formatting
│   ├── validators.ts             # Form validation rules
│   ├── images.ts                 # Image optimization
│   └── helpers.ts                # General helpers
│
├── middleware/                   # Next.js middleware
│   ├── auth.ts                   # Auth middleware
│   └── logging.ts                # Request logging
│
├── public/                       # Static assets
│   ├── images/
│   ├── icons/
│   └── logo.svg
│
├── styles/                       # Global styles
│   ├── globals.css
│   └── tailwind.config.ts
│
├── .env.local                    # Environment variables
├── next.config.js                # Next.js config
├── tailwind.config.js            # Tailwind config
├── tsconfig.json                 # TypeScript config
├── package.json
└── README.md
```

---

## Key Components Details

### 1. **ProductCard Component**
```typescript
// components/feed/ProductCard.tsx
interface ProductCardProps {
  product: Product;
  onLike: (productId: string) => void;
  onSave: (productId: string) => void;
  onCommentClick: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onLike,
  onSave,
  onCommentClick,
}) => {
  // Displays:
  // - Product image with carousel
  // - Product title and price
  // - Seller info with follow button
  // - Like, save, comment buttons
  // - Comment count preview
  // - Posted time
  // - "Boosted" badge if applicable
};
```

### 2. **ProductFeed Component**
```typescript
// components/feed/ProductFeed.tsx
export const ProductFeed: React.FC = () => {
  // Infinite scroll behavior
  // Pagination: page 1-20 items, load more on scroll
  // Apply filters from store
  // Cache previous pages
  // Loading states
};
```

### 3. **ChatWindow Component**
```typescript
// components/messaging/ChatWindow.tsx
export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversationId,
}) => {
  // Real-time message updates via WebSocket
  // Show typing indicator
  // Scroll to latest messages
  // Display online status
  // Message timestamps
};
```

### 4. **SearchBar with Filters**
```typescript
// components/search/SearchBar.tsx
export const SearchBar: React.FC = () => {
  // Real-time search as user types
  // Category, size, condition filters
  // Price range slider
  // Sorting options (newest, most liked, trending)
};
```

---

## State Management with Zustand

```typescript
// store/authStore.ts
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  
  login: async (email, password) => {
    const data = await authService.login(email, password);
    set({ user: data.user, isAuthenticated: true });
  },
  
  logout: () => set({ user: null, isAuthenticated: false }),
  
  checkAuth: async () => {
    const user = await authService.getMe();
    set({ user, isAuthenticated: !!user });
  },
}));

// store/feedStore.ts
export const useFeedStore = create((set) => ({
  products: [],
  filters: { category: null, size: null, condition: null },
  page: 1,
  
  addProducts: (newProducts) => 
    set((state) => ({ products: [...state.products, ...newProducts] })),
  
  setFilters: (filters) => set({ filters, page: 1, products: [] }),
  
  nextPage: () => set((state) => ({ page: state.page + 1 })),
}));
```

---

## API Service Integration

```typescript
// services/products.service.ts
export const productsService = {
  getFeed: async (page: number, filters?: ProductFilters) => {
    const response = await api.get('/products/feed', {
      params: { page, limit: 20, ...filters },
    });
    return response.data;
  },

  getProduct: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (data: CreateProductDTO) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    // ... add other fields
    formData.append('images', data.images); // Files
    
    const response = await api.post('/products', formData);
    return response.data;
  },

  likeProduct: async (productId: string) => {
    const response = await api.post(`/products/${productId}/like`);
    return response.data;
  },
};
```

---

## Real-time Communication

```typescript
// services/websocket.service.ts
export class WebSocketService {
  private connection: HubConnection;

  connect(token: string) {
    this.connection = new HubConnectionBuilder()
      .withUrl(process.env.NEXT_PUBLIC_WS_URL, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    this.connection.start();
  }

  // Chat
  onMessageReceived(callback: (message: Message) => void) {
    this.connection.on('ReceiveMessage', callback);
  }

  sendMessage(conversationId: string, content: string) {
    this.connection.invoke('SendMessage', conversationId, content);
  }

  // Notifications
  onNotification(callback: (notification: Notification) => void) {
    this.connection.on('ReceiveNotification', callback);
  }

  // Typing indicator
  notifyTyping(conversationId: string) {
    this.connection.invoke('NotifyTyping', conversationId);
  }
}
```

---

## Authentication Flow

```typescript
// app/(auth)/login/page.tsx
export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  
  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      router.push('/');
    } catch (error) {
      toast.error('Invalid credentials');
    }
  };

  return <LoginForm onSubmit={onSubmit} />;
}
```

---

## Protected Routes

```typescript
// components/auth/ProtectedRoute.tsx
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated]);

  return isAuthenticated ? <>{children}</> : null;
};
```

---

## Performance Optimizations

1. **Code Splitting**
   - Dynamic imports for pages
   - Lazy load components

2. **Image Optimization**
   - Next.js `<Image>` component
   - WebP format
   - Progressive loading

3. **Caching**
   - React Query for API caching
   - LocalStorage for user preferences
   - Service Worker for offline support

4. **Pagination**
   - Cursor-based pagination for feed
   - Load more on scroll
   - Unload old pages from memory

5. **Bundle Size**
   - Tree shaking
   - Code splitting
   - Minification

---

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WS_URL=ws://localhost:5000/hubs
NEXT_PUBLIC_IMAGE_CDN=https://cdn.malopazeche.mk

# Private variables (server-side only)
API_SECRET_KEY=***
```

