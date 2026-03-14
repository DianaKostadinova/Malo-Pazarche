# MaloPazarche - Database Design (PostgreSQL)

## Database Schema Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          USERS & AUTH                            │
├─────────────────────────────────────────────────────────────────┤
│  users                                                            │
│  ├── id (uuid, PK)                                              │
│  ├── username (varchar, UNIQUE, NOT NULL)                       │
│  ├── email (varchar, UNIQUE, NOT NULL)                          │
│  ├── password_hash (varchar, NOT NULL)                          │
│  ├── first_name (varchar)                                       │
│  ├── last_name (varchar)                                        │
│  ├── bio (text)                                                 │
│  ├── avatar_url (varchar)                                       │
│  ├── role (enum: buyer, seller, both)                           │
│  ├── is_verified (bool, DEFAULT false)                          │
│  ├── created_at (timestamp)                                     │
│  ├── updated_at (timestamp)                                     │
│  └── deleted_at (timestamp, soft delete)                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       PRODUCTS & IMAGES                          │
├─────────────────────────────────────────────────────────────────┤
│  products                                                         │
│  ├── id (uuid, PK)                                              │
│  ├── seller_id (uuid, FK -> users)                              │
│  ├── title (varchar, NOT NULL)                                  │
│  ├── description (text)                                         │
│  ├── category (varchar)                                         │
│  ├── size (varchar)                                             │
│  ├── condition (enum: poor, fair, good, very_good, excellent)  │
│  ├── price (decimal)                                            │
│  ├── is_available (bool, DEFAULT true)                          │
│  ├── is_boosted (bool, DEFAULT false)                           │
│  ├── boosted_until (timestamp)                                  │
│  ├── created_at (timestamp, INDEXED)                            │
│  ├── updated_at (timestamp)                                     │
│  └── deleted_at (timestamp, soft delete)                        │
│                                                                  │
│  product_images                                                  │
│  ├── id (uuid, PK)                                              │
│  ├── product_id (uuid, FK -> products)                          │
│  ├── url (varchar, NOT NULL)                                    │
│  ├── display_order (int)                                        │
│  └── created_at (timestamp)                                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    INTERACTIONS & SOCIAL                         │
├─────────────────────────────────────────────────────────────────┤
│  likes                                                            │
│  ├── id (uuid, PK)                                              │
│  ├── user_id (uuid, FK -> users)                                │
│  ├── product_id (uuid, FK -> products)                          │
│  ├── created_at (timestamp)                                     │
│  └── UNIQUE(user_id, product_id)                                │
│                                                                  │
│  saved_posts                                                     │
│  ├── id (uuid, PK)                                              │
│  ├── user_id (uuid, FK -> users)                                │
│  ├── product_id (uuid, FK -> products)                          │
│  ├── created_at (timestamp)                                     │
│  └── UNIQUE(user_id, product_id)                                │
│                                                                  │
│  comments                                                        │
│  ├── id (uuid, PK)                                              │
│  ├── product_id (uuid, FK -> products)                          │
│  ├── user_id (uuid, FK -> users)                                │
│  ├── content (text, NOT NULL)                                   │
│  ├── created_at (timestamp, INDEXED)                            │
│  ├── updated_at (timestamp)                                     │
│  └── deleted_at (timestamp, soft delete)                        │
│                                                                  │
│  followers                                                       │
│  ├── id (uuid, PK)                                              │
│  ├── follower_id (uuid, FK -> users)                            │
│  ├── following_id (uuid, FK -> users)                           │
│  ├── created_at (timestamp)                                     │
│  └── UNIQUE(follower_id, following_id)                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    MESSAGING & CHAT                              │
├─────────────────────────────────────────────────────────────────┤
│  conversations                                                    │
│  ├── id (uuid, PK)                                              │
│  ├── buyer_id (uuid, FK -> users)                               │
│  ├── seller_id (uuid, FK -> users)                              │
│  ├── product_id (uuid, FK -> products, NULLABLE)                │
│  ├── created_at (timestamp, INDEXED)                            │
│  ├── last_message_at (timestamp)                                │
│  ├── deleted_at (timestamp, soft delete)                        │
│  └── UNIQUE(buyer_id, seller_id, product_id)                    │
│                                                                  │
│  messages                                                        │
│  ├── id (uuid, PK)                                              │
│  ├── conversation_id (uuid, FK -> conversations)                │
│  ├── sender_id (uuid, FK -> users)                              │
│  ├── content (text, NOT NULL)                                   │
│  ├── is_read (bool, DEFAULT false)                              │
│  ├── created_at (timestamp, INDEXED)                            │
│  └── deleted_at (timestamp, soft delete)                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    NOTIFICATIONS & BOOSTING                      │
├─────────────────────────────────────────────────────────────────┤
│  notifications                                                    │
│  ├── id (uuid, PK)                                              │
│  ├── user_id (uuid, FK -> users)                                │
│  ├── type (enum: like, comment, follow, message, mention)       │
│  ├── actor_id (uuid, FK -> users, who triggered)                │
│  ├── product_id (uuid, FK -> products, NULLABLE)                │
│  ├── message_id (uuid, FK -> messages, NULLABLE)                │
│  ├── is_read (bool, DEFAULT false)                              │
│  ├── created_at (timestamp)                                     │
│  └── deleted_at (timestamp, soft delete)                        │
│                                                                  │
│  boosted_posts                                                   │
│  ├── id (uuid, PK)                                              │
│  ├── product_id (uuid, FK -> products, UNIQUE)                  │
│  ├── seller_id (uuid, FK -> users)                              │
│  ├── boost_cost (decimal)                                       │
│  ├── boosted_from (timestamp)                                   │
│  ├── boosted_until (timestamp)                                  │
│  ├── created_at (timestamp)                                     │
│  └── deleted_at (timestamp, soft delete)                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Detailed Table Definitions

### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(255),
    role VARCHAR(20) NOT NULL DEFAULT 'buyer' -- 'buyer', 'seller', 'both'
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
    CONSTRAINT users_username_length CHECK (LENGTH(username) >= 3)
);

CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_username ON users(username) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_created_at ON users(created_at DESC) WHERE deleted_at IS NULL;
```

### Products Table

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    size VARCHAR(50),
    condition VARCHAR(20), -- 'poor', 'fair', 'good', 'very_good', 'excellent'
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    is_boosted BOOLEAN DEFAULT FALSE,
    boosted_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT products_price_check CHECK (price >= 0)
);

CREATE INDEX idx_products_seller_id ON products(seller_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_category ON products(category) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_created_at ON products(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_is_available_boosted ON products(is_available, is_boosted DESC) WHERE deleted_at IS NULL;
```

### Product Images Table

```sql
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url VARCHAR(255) NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);
```

### Interactions: Likes

```sql
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, product_id)
);

CREATE INDEX idx_likes_product_id ON likes(product_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_created_at ON likes(created_at DESC);
```

### Interactions: Saved Posts

```sql
CREATE TABLE saved_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, product_id)
);

CREATE INDEX idx_saved_posts_user_id ON saved_posts(user_id);
CREATE INDEX idx_saved_posts_created_at ON saved_posts(created_at DESC);
```

### Interactions: Comments

```sql
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT comments_content_length CHECK (LENGTH(content) > 0 AND LENGTH(content) <= 500)
);

CREATE INDEX idx_comments_product_id ON comments(product_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_comments_user_id ON comments(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_comments_created_at ON comments(created_at DESC) WHERE deleted_at IS NULL;
```

### Social: Followers

```sql
CREATE TABLE followers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(follower_id, following_id),
    CONSTRAINT followers_self_follow_check CHECK (follower_id != following_id)
);

CREATE INDEX idx_followers_follower_id ON followers(follower_id);
CREATE INDEX idx_followers_following_id ON followers(following_id);
```

### Messaging: Conversations

```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_message_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(buyer_id, seller_id, product_id),
    CONSTRAINT conversations_different_users CHECK (buyer_id != seller_id)
);

CREATE INDEX idx_conversations_buyer_id ON conversations(buyer_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_conversations_seller_id ON conversations(seller_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_conversations_created_at ON conversations(created_at DESC) WHERE deleted_at IS NULL;
```

### Messaging: Messages

```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT messages_content_check CHECK (LENGTH(content) > 0)
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_messages_sender_id ON messages(sender_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_messages_created_at ON messages(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_messages_is_read ON messages(is_read) WHERE deleted_at IS NULL;
```

### Notifications Table

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL, -- 'like', 'comment', 'follow', 'message', 'mention'
    actor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT notifications_actor_check CHECK (actor_id != user_id)
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_notifications_is_read ON notifications(is_read) WHERE deleted_at IS NULL;
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC) WHERE deleted_at IS NULL;
```

### Boosted Posts Table

```sql
CREATE TABLE boosted_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID UNIQUE NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    boost_cost DECIMAL(10, 2) NOT NULL,
    boosted_from TIMESTAMP WITH TIME ZONE NOT NULL,
    boosted_until TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT boosted_posts_dates_check CHECK (boosted_from < boosted_until)
);

CREATE INDEX idx_boosted_posts_seller_id ON boosted_posts(seller_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_boosted_posts_boosted_until ON boosted_posts(boosted_until DESC) WHERE deleted_at IS NULL;
```

---

## Database Views (Optional, for reporting)

```sql
-- View: Active products with seller info and stats
CREATE VIEW active_products_with_stats AS
SELECT 
    p.id,
    p.title,
    p.seller_id,
    u.username as seller_username,
    u.avatar_url as seller_avatar,
    p.price,
    p.category,
    p.condition,
    p.is_boosted,
    p.boosted_until,
    COUNT(DISTINCT l.id) as like_count,
    COUNT(DISTINCT c.id) as comment_count,
    COUNT(DISTINCT sp.id) as save_count,
    p.created_at
FROM products p
LEFT JOIN users u ON p.seller_id = u.id
LEFT JOIN likes l ON p.id = l.product_id
LEFT JOIN comments c ON p.id = c.product_id AND c.deleted_at IS NULL
LEFT JOIN saved_posts sp ON p.id = sp.product_id
WHERE p.is_available = TRUE 
  AND p.deleted_at IS NULL
GROUP BY p.id, u.username, u.avatar_url;

-- View: User's saved products
CREATE VIEW user_saved_products AS
SELECT 
    sp.user_id,
    p.id as product_id,
    p.title,
    p.price,
    u.username as seller_username,
    sp.created_at as saved_at
FROM saved_posts sp
JOIN products p ON sp.product_id = p.id
JOIN users u ON p.seller_id = u.id
WHERE p.deleted_at IS NULL AND p.is_available = TRUE;
```

---

## Indexing Strategy

### Composite Indexes
```sql
-- For feed queries with filters
CREATE INDEX idx_products_available_created 
ON products(is_available, created_at DESC) 
WHERE deleted_at IS NULL;

-- For boosted feed ranking
CREATE INDEX idx_products_boosted_created 
ON products(is_boosted DESC, created_at DESC) 
WHERE is_available = TRUE AND deleted_at IS NULL;

-- For user's products
CREATE INDEX idx_products_seller_available 
ON products(seller_id, is_available) 
WHERE deleted_at IS NULL;

-- For conversation lookups
CREATE INDEX idx_conversations_users 
ON conversations(buyer_id, seller_id) 
WHERE deleted_at IS NULL;
```

---

## Performance Considerations

1. **Soft Deletes**
   - Always add `WHERE deleted_at IS NULL` to queries
   - Include in index conditions

2. **Pagination**
   - Use OFFSET/LIMIT for API pagination
   - Consider keyset pagination for large result sets

3. **Query Optimization**
   - Use EXPLAIN ANALYZE to find slow queries
   - Denormalize counts for frequently accessed stats
   - Consider materialized views for complex aggregations

4. **Connection Pooling**
   - Set appropriate pool size (25-100 connections)
   - Monitor idle connections

5. **Backup Strategy**
   - Daily backups
   - Test restore procedures
   - Point-in-time recovery enabled

---

## Migration Example (Entity Framework Core)

```csharp
public class InitialCreate : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "users",
            columns: table => new
            {
                id = table.Column<Guid>(type: "uuid", nullable: false),
                username = table.Column<string>(type: "character varying(50)", nullable: false),
                email = table.Column<string>(type: "character varying(255)", nullable: false),
                password_hash = table.Column<string>(type: "character varying(255)", nullable: false),
                first_name = table.Column<string>(type: "character varying(100)", nullable: true),
                last_name = table.Column<string>(type: "character varying(100)", nullable: true),
                bio = table.Column<string>(type: "text", nullable: true),
                avatar_url = table.Column<string>(type: "character varying(255)", nullable: true),
                role = table.Column<string>(type: "character varying(20)", nullable: false, defaultValue: "buyer"),
                is_verified = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("pk_users", x => x.id);
            });

        migrationBuilder.CreateIndex(
            name: "idx_users_email",
            table: "users",
            column: "email",
            filter: "deleted_at IS NULL");

        migrationBuilder.CreateIndex(
            name: "idx_users_username",
            table: "users",
            column: "username",
            filter: "deleted_at IS NULL");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "users");
    }
}
```

---

## Quick Queries

```sql
-- Get trending products
SELECT id, title, like_count 
FROM active_products_with_stats
ORDER BY like_count DESC
LIMIT 20;

-- Get user's feed (products from followed sellers)
SELECT p.* 
FROM products p
JOIN followers f ON p.seller_id = f.following_id
WHERE f.follower_id = $1 
  AND p.is_available = TRUE
  AND p.deleted_at IS NULL
ORDER BY p.is_boosted DESC, p.created_at DESC
LIMIT 20;

-- Get unread message count
SELECT COUNT(*) 
FROM messages 
WHERE conversation_id IN (
    SELECT id FROM conversations 
    WHERE (buyer_id = $1 OR seller_id = $1) AND deleted_at IS NULL
)
AND sender_id != $1
AND is_read = FALSE;

-- Get user statistics
SELECT 
    COUNT(DISTINCT p.id) as products_count,
    COUNT(DISTINCT f.follower_id) as followers_count,
    COUNT(DISTINCT f2.following_id) as following_count
FROM users u
LEFT JOIN products p ON u.id = p.seller_id AND p.deleted_at IS NULL
LEFT JOIN followers f ON u.id = f.following_id AND f.follower_id != u.id
LEFT JOIN followers f2 ON u.id = f2.follower_id
WHERE u.id = $1;
```
