# MaloPazarche - Scalability & Performance

## Scaling Strategy

MaloPazarche is designed to scale from MVP (100 users) to production (1M+ users).

---

## Architecture Scaling

```
PHASE 1: MVP (100-1K users)
├── Single server deployment
├── PostgreSQL on same instance
├── In-memory caching (no Redis)
└── No CDN needed

PHASE 2: Growth (1K-10K users)
├── Separate application servers (load balanced)
├── Dedicated PostgreSQL server with read replicas
├── Redis for caching
├── CloudFront CDN for images
└── Hangfire for background jobs

PHASE 3: Scale (10K-100K users)
├── Kubernetes orchestration
├── Database sharding by user ID
├── Multi-region deployment
├── Message queue (RabbitMQ)
├── Elasticsearch for search
└── ElastiCache for distributed caching

PHASE 4: Enterprise (100K+ users)
├── Multi-region with geo-routing
├── CQRS pattern for reads/writes
├── Event sourcing for audit trail
├── Microservices separation
├── Real-time analytics pipeline
└── Advanced cache strategies
```

---

## Database Optimization

### Indexing

**Most Important Indexes:**
```sql
-- Feed queries (heavily used)
CREATE INDEX idx_products_active_boosted_created 
ON products(is_available, is_boosted DESC, created_at DESC) 
WHERE deleted_at IS NULL;

-- User's products
CREATE INDEX idx_products_seller 
ON products(seller_id) 
WHERE deleted_at IS NULL;

-- Message lookups
CREATE INDEX idx_messages_conversation 
ON messages(conversation_id) 
WHERE deleted_at IS NULL;

-- Interaction queries
CREATE INDEX idx_likes_product 
ON likes(product_id);

CREATE INDEX idx_comments_product 
ON comments(product_id) 
WHERE deleted_at IS NULL;

-- Social features
CREATE INDEX idx_followers_following 
ON followers(following_id);

-- Sorting and filtering
CREATE INDEX idx_products_category_created 
ON products(category, created_at DESC) 
WHERE deleted_at IS NULL AND is_available = TRUE;
```

### Query Optimization

**Before (N+1 problem):**
```csharp
var products = await _context.Products.ToListAsync();
foreach (var product in products)
{
    var seller = await _context.Users.FindAsync(product.SellerId); // N+1!
    var likes = await _context.Likes.Where(l => l.ProductId == product.Id).ToListAsync();
}
```

**After (Eager loading):**
```csharp
var products = await _context.Products
    .Include(p => p.Seller)
    .Include(p => p.Images)
    .Include(p => p.Likes)
    .ToListAsync();
```

---

## Caching Strategy

### Cache Layer Architecture

```
Level 1: HTTP Cache (Browser)
├── Cache-Control headers
├── ETag for validation
└── Static assets (images, CSS, JS)

Level 2: Application Cache (Memory/Redis)
├── User profiles
├── Product details
├── Feed pages
├── User's followers list
└── TTL: 5-30 minutes

Level 3: Database
└── Source of truth
```

### Implementation

```csharp
public class CachingRepositoryDecorator : IProductRepository
{
    private readonly IProductRepository _repository;
    private readonly ICacheService _cache;
    private const string FEED_CACHE_KEY = "feed";
    
    public async Task<(List<Product>, int)> GetFeedAsync(
        int page, int limit, string category = null, string size = null)
    {
        var cacheKey = $"feed_p{page}_l{limit}_{category}_{size}";
        
        // Try cache first
        var cached = await _cache.GetAsync<(List<Product>, int)>(cacheKey);
        if (cached != null)
            return cached;
        
        // Query database
        var result = await _repository.GetFeedAsync(page, limit, category, size);
        
        // Cache result (5 minutes)
        await _cache.SetAsync(cacheKey, result, TimeSpan.FromMinutes(5));
        
        return result;
    }
    
    public async Task InvalidateFeedCacheAsync()
    {
        // Invalidate all feed pages
        await _cache.InvalidateAsync("feed_*");
    }
}
```

### Cache Invalidation Strategy

```csharp
// When product is created
public async Task<ProductDTO> CreateProductAsync(Guid userId, CreateProductDTO dto)
{
    var product = new Product { /* ... */ };
    await _unitOfWork.Products.AddAsync(product);
    await _unitOfWork.SaveChangesAsync();
    
    // Invalidate related caches
    await _cacheService.InvalidateAsync("feed_*");
    await _cacheService.InvalidateAsync($"user-products-{userId}");
    
    return _mapper.Map<ProductDTO>(product);
}

// When user likes a product
public async Task LikeProductAsync(Guid userId, Guid productId)
{
    var like = new Like { UserId = userId, ProductId = productId };
    await _unitOfWork.Likes.AddAsync(like);
    await _unitOfWork.SaveChangesAsync();
    
    // Invalidate product's detail cache (but not feed)
    await _cacheService.DeleteAsync($"product-{productId}");
}
```

---

## CDN for Images

### CloudFront Configuration

```csharp
// appsettings.json
{
  "Storage": {
    "Provider": "S3",
    "Bucket": "malopazeche-uploads",
    "Region": "eu-west-1",
    "CloudFrontDomain": "https://cdn.malopazeche.mk"
  }
}

// Service
public class ImageUploadService
{
    private readonly IAmazonS3 _s3Client;
    private readonly IConfiguration _config;
    
    public async Task<string> UploadProductImageAsync(IFormFile file)
    {
        var fileName = $"products/{Guid.NewGuid()}/{file.FileName}";
        
        using (var stream = file.OpenReadStream())
        {
            await _s3Client.PutObjectAsync(new PutObjectRequest
            {
                BucketName = _config["Storage:Bucket"],
                Key = fileName,
                InputStream = stream,
                ContentType = file.ContentType,
                CannedACL = S3CannedACL.PublicRead
            });
        }
        
        // Return CloudFront URL
        return $"{_config["Storage:CloudFrontDomain"]}/{fileName}";
    }
}
```

### Frontend Image Optimization

```typescript
// components/feed/ProductCard.tsx
import Image from 'next/image';

export const ProductCard = ({ product }: Props) => {
  return (
    <Image
      src={product.images[0]}
      alt={product.title}
      width={400}
      height={400}
      quality={75}
      placeholder="blur"
      blurDataURL="data:image/png;base64,..." // Low-quality placeholder
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  );
};
```

---

## Background Jobs

### Hangfire Setup

```csharp
// Program.cs
builder.Services.AddHangfire(config =>
    config.UsePostgreSqlStorage(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHangfireServer();

// In Configure
app.UseHangfireDashboard("/admin/jobs");

// Schedule background jobs
public class ServiceCollectionExtensions
{
    public static void AddBackgroundJobs(this IServiceCollection services)
    {
        services.AddScoped<INotificationBackgroundJob, NotificationBackgroundJob>();
        services.AddScoped<IImageProcessingJob, ImageProcessingJob>();
        services.AddScoped<IFeedGenerationJob, FeedGenerationJob>();
    }
}

// Implementation
public class NotificationBackgroundJob : INotificationBackgroundJob
{
    private readonly IEmailService _emailService;
    private readonly IUnitOfWork _unitOfWork;
    
    public async Task ProcessNewFollowerNotificationAsync(Guid userId, Guid followerId)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        var follower = await _unitOfWork.Users.GetByIdAsync(followerId);
        
        // Send email asynchronously
        await _emailService.SendEmailAsync(
            user.Email,
            $"{follower.Username} started following you!",
            $"Visit your profile to learn more about {follower.Username}"
        );
    }
    
    public async Task ProcessMentionNotificationAsync(Guid userId, Guid mentionedInProductId)
    {
        // Process mention notification
    }
}

// Enqueue background job
BackgroundJob.Enqueue<INotificationBackgroundJob>(job =>
    job.ProcessNewFollowerNotificationAsync(userId, followerId));

// Schedule recurring job
RecurringJob.AddOrUpdate<IFeedGenerationJob>(
    "generate-feeds",
    job => job.RegenerateFeedsAsync(),
    Cron.Hourly);
```

---

## Database Replication & Scaling

### Read Replicas

```csharp
public class ConnectionStringProvider
{
    private readonly IConfiguration _config;
    private readonly IRequest _request;
    
    public string GetConnectionString(bool isWrite)
    {
        if (isWrite)
        {
            return _config.GetConnectionString("DefaultConnection-Write");
        }
        else
        {
            // Round-robin through read replicas
            var replicas = _config.GetSection("Databases:ReadReplicas")
                .Get<List<string>>();
            return replicas[Random.Shared.Next(replicas.Count)];
        }
    }
}

// Usage
public class UserRepository : Repository<User>
{
    public async Task<User> GetByIdAsync(Guid id)
    {
        using (var context = new ApplicationDbContext(
            _connectionProvider.GetConnectionString(isWrite: false)))
        {
            return await context.Users.FindAsync(id);
        }
    }
    
    public async Task UpdateAsync(User entity)
    {
        using (var context = new ApplicationDbContext(
            _connectionProvider.GetConnectionString(isWrite: true)))
        {
            context.Users.Update(entity);
            await context.SaveChangesAsync();
        }
    }
}
```

### Sharding (For 100K+ users)

```csharp
public class ShardingService
{
    private readonly Dictionary<int, string> _shards;
    
    public int GetShardId(Guid userId)
    {
        var hash = userId.GetHashCode();
        return Math.Abs(hash) % _shards.Count;
    }
    
    public string GetConnectionString(Guid userId)
    {
        var shardId = GetShardId(userId);
        return _shards[shardId];
    }
}

// Implementation
public class ShardedProductRepository : IProductRepository
{
    private readonly ShardingService _shardingService;
    
    public async Task<Product> GetByIdAsync(Guid id)
    {
        // Products are sharded by seller_id
        var sellerId = await GetSellerIdAsync(id); // Helper query
        var connectionString = _shardingService.GetConnectionString(sellerId);
        
        using (var context = new ApplicationDbContext(connectionString))
        {
            return await context.Products.FindAsync(id);
        }
    }
}
```

---

## Pagination Strategy

### Cursor-based Pagination (Preferred)

```csharp
public class CursorPaginationDTO<T>
{
    public List<T> Data { get; set; }
    public string NextCursor { get; set; }
    public string PreviousCursor { get; set; }
    public bool HasNextPage { get; set; }
}

public async Task<CursorPaginationDTO<ProductDTO>> GetFeedAsync(
    string cursor = null, int limit = 20)
{
    var query = _context.Products
        .Where(p => p.IsAvailable && p.DeletedAt == null)
        .OrderByDescending(p => p.IsBoosted)
        .ThenByDescending(p => p.CreatedAt)
        .ThenByDescending(p => p.Id); // For consistency
    
    // If cursor provided, skip to that position
    if (!string.IsNullOrEmpty(cursor))
    {
        var (boost, createdAt, id) = DecodeCursor(cursor);
        query = query.Where(p =>
            p.IsBoosted == boost && p.CreatedAt < createdAt ||
            p.IsBoosted < boost);
    }
    
    var items = await query.Take(limit + 1).ToListAsync();
    
    var hasNextPage = items.Count > limit;
    if (hasNextPage)
        items.RemoveAt(items.Count - 1);
    
    var nextCursor = items.Any()
        ? EncodeCursor(items.Last().IsBoosted, items.Last().CreatedAt, items.Last().Id)
        : null;
    
    return new CursorPaginationDTO<ProductDTO>
    {
        Data = _mapper.Map<List<ProductDTO>>(items),
        NextCursor = nextCursor,
        HasNextPage = hasNextPage
    };
}
```

### Offset-based Pagination (For Limits)

```csharp
public async Task<PaginatedResponseDTO<ProductDTO>> GetFeedAsync(
    int page = 1, int limit = 20)
{
    limit = Math.Min(limit, 100); // Max 100 items
    
    var query = _context.Products
        .Where(p => p.IsAvailable && p.DeletedAt == null);
    
    var totalCount = await query.CountAsync();
    
    var items = await query
        .OrderByDescending(p => p.IsBoosted)
        .ThenByDescending(p => p.CreatedAt)
        .Skip((page - 1) * limit)
        .Take(limit)
        .ToListAsync();
    
    return new PaginatedResponseDTO<ProductDTO>
    {
        Data = _mapper.Map<List<ProductDTO>>(items),
        Page = page,
        PageSize = limit,
        TotalCount = totalCount,
        HasNextPage = (page * limit) < totalCount
    };
}
```

---

## Rate Limiting

```csharp
public class RateLimitingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ICacheService _cache;
    
    public async Task InvokeAsync(HttpContext context, ICacheService cache)
    {
        var clientId = context.Connection.RemoteIpAddress.ToString();
        var endpoint = context.Request.Path.ToString();
        var cacheKey = $"ratelimit-{clientId}-{endpoint}";
        
        var accessCount = await _cache.IncrementAsync(cacheKey);
        
        if (accessCount == 1)
        {
            // First request, set expiry
            await _cache.SetAsync(cacheKey, accessCount, TimeSpan.FromMinutes(1));
        }
        
        // Rate limits per endpoint
        var limits = new Dictionary<string, int>
        {
            { "/api/auth/login", 5 },
            { "/api/auth/register", 10 },
            { "/api/products", 100 }
        };
        
        if (limits.TryGetValue(endpoint, out var limit))
        {
            if (accessCount > limit)
            {
                context.Response.StatusCode = 429; // Too Many Requests
                await context.Response.WriteAsJsonAsync(new
                {
                    error = "Rate limit exceeded",
                    retryAfter = 60
                });
                return;
            }
        }
        
        await _next(context);
    }
}
```

---

## Monitoring & Performance Metrics

### Application Insights

```csharp
builder.Services.AddApplicationInsightsTelemetry();

// Custom metrics
public class ProductService
{
    private readonly TelemetryClient _telemetry;
    
    public async Task<ProductDTO> CreateProductAsync(Guid userId, CreateProductDTO dto)
    {
        var stopwatch = Stopwatch.StartNew();
        
        try
        {
            var product = /* create product */;
            stopwatch.Stop();
            
            _telemetry.TrackEvent("ProductCreated", new Dictionary<string, string>
            {
                { "userId", userId.ToString() },
                { "category", dto.Category }
            }, new Dictionary<string, double>
            {
                { "duration_ms", stopwatch.ElapsedMilliseconds }
            });
            
            return _mapper.Map<ProductDTO>(product);
        }
        catch (Exception ex)
        {
            _telemetry.TrackException(ex);
            throw;
        }
    }
}
```

### Logging

```csharp
// Serilog configuration
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.File("logs/app.log", rollingInterval: RollingInterval.Day)
    .WriteTo.ApplicationInsights(new TelemetryConfiguration())
    .Filter.ByExcluding("RequestPath like '/health%'")
    .CreateLogger();

// Usage
_logger.LogInformation("Product {productId} created by {userId}", productId, userId);
_logger.LogWarning("Slow query detected: {duration}ms", duration);
_logger.LogError(ex, "Failed to create product");
```

---

## Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Page Load (P95) | < 2s | - |
| API Response (P95) | < 500ms | - |
| Feed Feed TTL | < 1s | - |
| Search TTL | < 1s | - |
| Message Delivery | < 100ms | - |
| Database Queries (P95) | < 100ms | - |
| CPU Usage | < 70% | - |
| Memory Usage | < 80% | - |
| Database Connections | 25-100 | - |

---

## Health Checks

```csharp
builder.Services.AddHealthChecks()
    .AddDbContextCheck<ApplicationDbContext>("database")
    .AddRedis(builder.Configuration["Redis:ConnectionString"], "redis")
    .AddS3Check("s3")
    .AddUrlGroup(new Uri("https://api.example.com"), "external_api");

app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = WriteHealthCheckResponse
});

// Health check endpoint response
{
  "status": "Healthy",
  "checks": {
    "database": {
      "status": "Healthy",
      "responseTime": "45ms"
    },
    "redis": {
      "status": "Healthy",
      "responseTime": "12ms"
    },
    "s3": {
      "status": "Healthy",
      "responseTime": "150ms"
    }
  },
  "totalResponseTime": "207ms"
}
```

This comprehensive scalability guide ensures MaloPazarche can grow from MVP to enterprise scale.
