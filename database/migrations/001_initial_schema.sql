-- Initial schema for MaloPazarche
-- This file documents the database structure

-- Users table
CREATE TABLE IF NOT EXISTS "Users" (
    "Id" uuid PRIMARY KEY NOT NULL,
    "Username" varchar(50) NOT NULL UNIQUE,
    "Email" varchar(255) NOT NULL UNIQUE,
    "PasswordHash" text NOT NULL,
    "FullName" varchar(200),
    "Bio" varchar(500),
    "ProfileImageUrl" text,
    "Role" varchar(50) NOT NULL DEFAULT 'User',
    "IsActive" boolean NOT NULL DEFAULT true,
    "CreatedAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "RefreshToken" varchar(500),
    "RefreshTokenExpiryTime" timestamp with time zone
);

-- Indexes for Users
CREATE INDEX idx_users_email ON "Users"("Email");
CREATE INDEX idx_users_username ON "Users"("Username");
CREATE INDEX idx_users_created_at ON "Users"("CreatedAt" DESC);

-- Products table (for future use)
CREATE TABLE IF NOT EXISTS "Products" (
    "Id" uuid PRIMARY KEY NOT NULL,
    "SellerId" uuid NOT NULL REFERENCES "Users"("Id") ON DELETE CASCADE,
    "Title" varchar(150) NOT NULL,
    "Description" text,
    "Category" varchar(50) NOT NULL,
    "Size" varchar(20),
    "Condition" varchar(50) NOT NULL,
    "Price" decimal(10, 2) NOT NULL,
    "IsAvailable" boolean NOT NULL DEFAULT true,
    "IsBoosted" boolean NOT NULL DEFAULT false,
    "CreatedAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_seller_id ON "Products"("SellerId");
CREATE INDEX idx_products_category ON "Products"("Category");
CREATE INDEX idx_products_created_at ON "Products"("CreatedAt" DESC);
CREATE INDEX idx_products_is_available ON "Products"("IsAvailable");

-- Product Images table (for future use)
CREATE TABLE IF NOT EXISTS "ProductImages" (
    "Id" uuid PRIMARY KEY NOT NULL,
    "ProductId" uuid NOT NULL REFERENCES "Products"("Id") ON DELETE CASCADE,
    "ImageUrl" text NOT NULL,
    "IsPrimary" boolean NOT NULL DEFAULT false,
    "CreatedAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_product_images_product_id ON "ProductImages"("ProductId");

-- Likes table (for future use)
CREATE TABLE IF NOT EXISTS "Likes" (
    "Id" uuid PRIMARY KEY NOT NULL,
    "UserId" uuid NOT NULL REFERENCES "Users"("Id") ON DELETE CASCADE,
    "ProductId" uuid NOT NULL REFERENCES "Products"("Id") ON DELETE CASCADE,
    "CreatedAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("UserId", "ProductId")
);

CREATE INDEX idx_likes_user_id ON "Likes"("UserId");
CREATE INDEX idx_likes_product_id ON "Likes"("ProductId");

-- SavedPosts table (for future use)
CREATE TABLE IF NOT EXISTS "SavedPosts" (
    "Id" uuid PRIMARY KEY NOT NULL,
    "UserId" uuid NOT NULL REFERENCES "Users"("Id") ON DELETE CASCADE,
    "ProductId" uuid NOT NULL REFERENCES "Products"("Id") ON DELETE CASCADE,
    "CreatedAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("UserId", "ProductId")
);

CREATE INDEX idx_saved_posts_user_id ON "SavedPosts"("UserId");
CREATE INDEX idx_saved_posts_product_id ON "SavedPosts"("ProductId");

-- Comments table (for future use)
CREATE TABLE IF NOT EXISTS "Comments" (
    "Id" uuid PRIMARY KEY NOT NULL,
    "ProductId" uuid NOT NULL REFERENCES "Products"("Id") ON DELETE CASCADE,
    "UserId" uuid NOT NULL REFERENCES "Users"("Id") ON DELETE CASCADE,
    "Content" text NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_product_id ON "Comments"("ProductId");
CREATE INDEX idx_comments_user_id ON "Comments"("UserId");

-- Followers table (for future use)
CREATE TABLE IF NOT EXISTS "Followers" (
    "Id" uuid PRIMARY KEY NOT NULL,
    "FollowerId" uuid NOT NULL REFERENCES "Users"("Id") ON DELETE CASCADE,
    "FollowingId" uuid NOT NULL REFERENCES "Users"("Id") ON DELETE CASCADE,
    "CreatedAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("FollowerId", "FollowingId")
);

CREATE INDEX idx_followers_follower_id ON "Followers"("FollowerId");
CREATE INDEX idx_followers_following_id ON "Followers"("FollowingId");

-- Conversations table (for future use)
CREATE TABLE IF NOT EXISTS "Conversations" (
    "Id" uuid PRIMARY KEY NOT NULL,
    "BuyerId" uuid NOT NULL REFERENCES "Users"("Id") ON DELETE CASCADE,
    "SellerId" uuid NOT NULL REFERENCES "Users"("Id") ON DELETE CASCADE,
    "ProductId" uuid REFERENCES "Products"("Id") ON DELETE SET NULL,
    "LastMessageAt" timestamp with time zone,
    "CreatedAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("BuyerId", "SellerId", "ProductId")
);

CREATE INDEX idx_conversations_buyer_id ON "Conversations"("BuyerId");
CREATE INDEX idx_conversations_seller_id ON "Conversations"("SellerId");
CREATE INDEX idx_conversations_last_message_at ON "Conversations"("LastMessageAt" DESC);

-- Messages table (for future use)
CREATE TABLE IF NOT EXISTS "Messages" (
    "Id" uuid PRIMARY KEY NOT NULL,
    "ConversationId" uuid NOT NULL REFERENCES "Conversations"("Id") ON DELETE CASCADE,
    "SenderId" uuid NOT NULL REFERENCES "Users"("Id") ON DELETE CASCADE,
    "Content" text NOT NULL,
    "IsRead" boolean NOT NULL DEFAULT false,
    "CreatedAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_conversation_id ON "Messages"("ConversationId");
CREATE INDEX idx_messages_sender_id ON "Messages"("SenderId");
CREATE INDEX idx_messages_created_at ON "Messages"("CreatedAt" DESC);

-- Notifications table (for future use)
CREATE TABLE IF NOT EXISTS "Notifications" (
    "Id" uuid PRIMARY KEY NOT NULL,
    "UserId" uuid NOT NULL REFERENCES "Users"("Id") ON DELETE CASCADE,
    "Type" varchar(50) NOT NULL,
    "Message" text NOT NULL,
    "IsRead" boolean NOT NULL DEFAULT false,
    "RelatedEntityId" uuid,
    "CreatedAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON "Notifications"("UserId");
CREATE INDEX idx_notifications_is_read ON "Notifications"("IsRead");

-- BoostedPosts table (for future use)
CREATE TABLE IF NOT EXISTS "BoostedPosts" (
    "Id" uuid PRIMARY KEY NOT NULL,
    "ProductId" uuid NOT NULL REFERENCES "Products"("Id") ON DELETE CASCADE,
    "StartDate" timestamp with time zone NOT NULL,
    "EndDate" timestamp with time zone NOT NULL,
    "Cost" decimal(10, 2) NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_boosted_posts_product_id ON "BoostedPosts"("ProductId");
CREATE INDEX idx_boosted_posts_start_date ON "BoostedPosts"("StartDate");
CREATE INDEX idx_boosted_posts_end_date ON "BoostedPosts"("EndDate");
