# MaloPazarche - Backend Architecture (.NET 8)

## Overview
The backend is built with **ASP.NET Core Web API (.NET 8)** using clean architecture principles with clear separation of concerns: Controllers → Services → Repositories → Database.

---

## Backend Tech Stack

```
Runtime:          .NET 8
Framework:        ASP.NET Core Web API
Authentication:   JWT (JSON Web Tokens)
Real-time:        ASP.NET SignalR
ORM:              Entity Framework Core 8
Database:         PostgreSQL
Validation:       FluentValidation
Logging:          Serilog
Caching:          Memory Cache / Redis
Queue:            Hangfire (background jobs)
Testing:          xUnit + Moq
API Docs:         Swagger/OpenAPI
```

---

## Folder Structure

```
backend/
├── src/
│   ├── MaloPazarche.API/
│   │   ├── Program.cs                    # Startup configuration
│   │   ├── appsettings.json              # Config
│   │   ├── appsettings.Development.json
│   │   │
│   │   ├── Controllers/
│   │   │   ├── AuthController.cs         # /api/auth
│   │   │   ├── UsersController.cs        # /api/users
│   │   │   ├── ProductsController.cs     # /api/products
│   │   │   ├── InteractionsController.cs # /api/likes, /api/comments, etc
│   │   │   ├── MessagesController.cs     # /api/messages
│   │   │   ├── SearchController.cs       # /api/search
│   │   │   ├── NotificationsController.cs
│   │   │   └── HealthController.cs       # /health
│   │   │
│   │   ├── Hubs/
│   │   │   ├── ChatHub.cs                # SignalR hub for real-time chat
│   │   │   └── NotificationHub.cs        # SignalR hub for notifications
│   │   │
│   │   ├── Middleware/
│   │   │   ├── ExceptionHandlingMiddleware.cs
│   │   │   ├── JwtMiddleware.cs          # JWT validation
│   │   │   └── LoggingMiddleware.cs
│   │   │
│   │   └── Properties/
│   │       └── launchSettings.json
│   │
│   ├── MaloPazarche.Application/
│   │   ├── Services/
│   │   │   ├── AuthService.cs            # Auth logic
│   │   │   ├── UserService.cs            # User management
│   │   │   ├── ProductService.cs         # Product CRUD
│   │   │   ├── InteractionService.cs     # Likes, saves, comments
│   │   │   ├── MessageService.cs         # Messaging logic
│   │   │   ├── SearchService.cs          # Search and filtering
│   │   │   ├── NotificationService.cs    # Notifications
│   │   │   ├── BoostedPostService.cs     # Boost logic
│   │   │   └── TokenService.cs           # JWT token generation
│   │   │
│   │   ├── DTOs/                         # Data Transfer Objects
│   │   │   ├── Auth/
│   │   │   │   ├── LoginRequestDTO.cs
│   │   │   │   ├── RegisterRequestDTO.cs
│   │   │   │   └── AuthResponseDTO.cs
│   │   │   ├── User/
│   │   │   │   ├── UserDTO.cs
│   │   │   │   ├── CreateUserDTO.cs
│   │   │   │   └── UpdateUserDTO.cs
│   │   │   ├── Product/
│   │   │   │   ├── ProductDTO.cs
│   │   │   │   ├── CreateProductDTO.cs
│   │   │   │   ├── UpdateProductDTO.cs
│   │   │   │   └── ProductDetailDTO.cs
│   │   │   ├── Message/
│   │   │   │   ├── MessageDTO.cs
│   │   │   │   ├── ConversationDTO.cs
│   │   │   │   └── SendMessageDTO.cs
│   │   │   ├── Interaction/
│   │   │   │   ├── LikeDTO.cs
│   │   │   │   ├── CommentDTO.cs
│   │   │   │   └── SaveDTO.cs
│   │   │   ├── Search/
│   │   │   │   └── SearchResultDTO.cs
│   │   │   └── Common/
│   │   │       ├── PaginatedResponseDTO.cs
│   │   │       ├── ApiResponseDTO.cs
│   │   │       └── ErrorResponseDTO.cs
│   │   │
│   │   ├── Validators/                   # FluentValidation validators
│   │   │   ├── LoginRequestValidator.cs
│   │   │   ├── CreateProductValidator.cs
│   │   │   ├── SendMessageValidator.cs
│   │   │   └── ...
│   │   │
│   │   ├── Mappers/                      # AutoMapper profiles
│   │   │   ├── UserMappingProfile.cs
│   │   │   ├── ProductMappingProfile.cs
│   │   │   └── MessageMappingProfile.cs
│   │   │
│   │   ├── Exceptions/
│   │   │   ├── NotFoundException.cs
│   │   │   ├── UnauthorizedException.cs
│   │   │   ├── ValidationException.cs
│   │   │   └── BadRequestException.cs
│   │   │
│   │   ├── BackgroundJobs/
│   │   │   ├── NotificationBackgroundJob.cs
│   │   │   ├── ImageProcessingJob.cs
│   │   │   └── FeedGenerationJob.cs
│   │   │
│   │   └── MaloPazarche.Application.csproj
│   │
│   ├── MaloPazarche.Domain/
│   │   ├── Entities/
│   │   │   ├── User.cs
│   │   │   ├── Product.cs
│   │   │   ├── ProductImage.cs
│   │   │   ├── Like.cs
│   │   │   ├── Comment.cs
│   │   │   ├── SavedPost.cs
│   │   │   ├── Follower.cs
│   │   │   ├── Message.cs
│   │   │   ├── Conversation.cs
│   │   │   ├── Notification.cs
│   │   │   ├── BoostedPost.cs
│   │   │   ├── UserRole.cs (enum)
│   │   │   ├── NotificationType.cs (enum)
│   │   │   └── ProductCondition.cs (enum)
│   │   │
│   │   ├── Interfaces/
│   │   │   ├── IEntity.cs
│   │   │   └── IRepository.cs
│   │   │
│   │   └── MaloPazarche.Domain.csproj
│   │
│   ├── MaloPazarche.Infrastructure/
│   │   ├── Data/
│   │   │   ├── ApplicationDbContext.cs    # EF Core DbContext
│   │   │   ├── Migrations/               # EF Core migrations
│   │   │   │   ├── InitialCreate.cs
│   │   │   │   └── ...
│   │   │   └── Seeds/
│   │   │       └── SeedData.cs           # Database seeding
│   │   │
│   │   ├── Repositories/
│   │   │   ├── IUnitOfWork.cs            # Unit of Work pattern
│   │   │   ├── UnitOfWork.cs
│   │   │   ├── Repository.cs             # Generic repository
│   │   │   ├── UserRepository.cs
│   │   │   ├── ProductRepository.cs
│   │   │   ├── MessageRepository.cs
│   │   │   ├── InteractionRepository.cs
│   │   │   └── SearchRepository.cs
│   │   │
│   │   ├── Services/
│   │   │   ├── JwtTokenService.cs        # Token generation
│   │   │   ├── PasswordHashingService.cs # Password hashing
│   │   │   ├── ImageUploadService.cs     # Image handling
│   │   │   ├── EmailService.cs           # Email sending
│   │   │   └── CacheService.cs           # Caching
│   │   │
│   │   ├── External/
│   │   │   ├── S3StorageService.cs       # AWS S3 or alternative
│   │   │   └── EmailProviderService.cs   # SendGrid or similar
│   │   │
│   │   └── MaloPazarche.Infrastructure.csproj
│   │
│   └── MaloPazarche.Tests/
│       ├── Unit/
│       │   ├── Services/
│       │   │   ├── AuthServiceTests.cs
│       │   │   ├── ProductServiceTests.cs
│       │   │   └── ...
│       │   └── Controllers/
│       │       ├── ProductsControllerTests.cs
│       │       └── ...
│       ├── Integration/
│       │   ├── AuthIntegrationTests.cs
│       │   └── ProductsIntegrationTests.cs
│       └── MaloPazarche.Tests.csproj
│
├── MaloPazarche.sln                       # Solution file
├── .gitignore
├── docker-compose.yml                     # Local development Docker
└── README.md
```

---

## Core Entities

### User Entity
```csharp
public class User : BaseEntity
{
    public string Username { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Bio { get; set; }
    public string AvatarUrl { get; set; }
    public UserRole Role { get; set; } // Buyer or Seller
    public bool IsVerified { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation properties
    public ICollection<Product> Products { get; set; }
    public ICollection<Follower> Followers { get; set; }
    public ICollection<Follower> Following { get; set; }
    public ICollection<Like> Likes { get; set; }
    public ICollection<Comment> Comments { get; set; }
    public ICollection<SavedPost> SavedPosts { get; set; }
    public ICollection<Message> SentMessages { get; set; }
    public ICollection<Message> ReceivedMessages { get; set; }
}

public enum UserRole
{
    Buyer = 0,
    Seller = 1,
    Both = 2
}
```

### Product Entity
```csharp
public class Product : BaseEntity
{
    public Guid SellerId { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string Category { get; set; }
    public string Size { get; set; }
    public ProductCondition Condition { get; set; }
    public decimal Price { get; set; }
    public bool IsAvailable { get; set; }
    public bool IsBoosted { get; set; }
    public DateTime BoostedUntil { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation properties
    public User Seller { get; set; }
    public ICollection<ProductImage> Images { get; set; }
    public ICollection<Like> Likes { get; set; }
    public ICollection<Comment> Comments { get; set; }
    public ICollection<SavedPost> SavedPosts { get; set; }
}

public enum ProductCondition
{
    Poor = 0,
    Fair = 1,
    Good = 2,
    VeryGood = 3,
    Excellent = 4
}
```

### Message & Conversation Entities
```csharp
public class Conversation : BaseEntity
{
    public Guid BuyerId { get; set; }
    public Guid SellerId { get; set; }
    public Guid? ProductId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastMessageAt { get; set; }
    
    public User Buyer { get; set; }
    public User Seller { get; set; }
    public Product Product { get; set; }
    public ICollection<Message> Messages { get; set; }
}

public class Message : BaseEntity
{
    public Guid ConversationId { get; set; }
    public Guid SenderId { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; }
    
    public Conversation Conversation { get; set; }
    public User Sender { get; set; }
}
```

---

## Controllers Structure

### AuthController
```csharp
[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDTO dto)
    {
        var result = await _authService.RegisterAsync(dto);
        return Ok(result);
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDTO dto)
    {
        var result = await _authService.LoginAsync(dto);
        return Ok(result);
    }
    
    [Authorize]
    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken()
    {
        var result = await _authService.RefreshTokenAsync(User);
        return Ok(result);
    }
    
    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _authService.LogoutAsync(User);
        return NoContent();
    }
}
```

### ProductsController
```csharp
[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    
    [HttpGet("feed")]
    public async Task<IActionResult> GetFeed(
        [FromQuery] int page = 1,
        [FromQuery] int limit = 20,
        [FromQuery] string category = null,
        [FromQuery] string size = null)
    {
        var result = await _productService.GetFeedAsync(
            page, limit, category, size);
        return Ok(result);
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProduct(Guid id)
    {
        var product = await _productService.GetProductAsync(id);
        return Ok(product);
    }
    
    [Authorize(Roles = "Seller,Both")]
    [HttpPost]
    public async Task<IActionResult> CreateProduct(
        [FromForm] CreateProductDTO dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var product = await _productService.CreateProductAsync(
            Guid.Parse(userId), dto);
        return CreatedAtAction(nameof(GetProduct), 
            new { id = product.Id }, product);
    }
    
    [Authorize(Roles = "Seller,Both")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(
        Guid id, [FromForm] UpdateProductDTO dto)
    {
        await _productService.UpdateProductAsync(id, dto);
        return NoContent();
    }
    
    [Authorize(Roles = "Seller,Both")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(Guid id)
    {
        await _productService.DeleteProductAsync(id);
        return NoContent();
    }
}
```

### InteractionsController
```csharp
[ApiController]
[Route("api/interactions")]
[Authorize]
public class InteractionsController : ControllerBase
{
    private readonly IInteractionService _interactionService;
    
    [HttpPost("likes/{productId}")]
    public async Task<IActionResult> LikeProduct(Guid productId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var result = await _interactionService.LikeProductAsync(
            Guid.Parse(userId), productId);
        return Ok(result);
    }
    
    [HttpDelete("likes/{productId}")]
    public async Task<IActionResult> UnlikeProduct(Guid productId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        await _interactionService.UnlikeProductAsync(
            Guid.Parse(userId), productId);
        return NoContent();
    }
    
    [HttpPost("saves/{productId}")]
    public async Task<IActionResult> SaveProduct(Guid productId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var result = await _interactionService.SaveProductAsync(
            Guid.Parse(userId), productId);
        return Ok(result);
    }
    
    [HttpPost("comments/{productId}")]
    public async Task<IActionResult> AddComment(
        Guid productId, [FromBody] CreateCommentDTO dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var comment = await _interactionService.AddCommentAsync(
            Guid.Parse(userId), productId, dto.Content);
        return Ok(comment);
    }
}
```

### MessagesController
```csharp
[ApiController]
[Route("api/messages")]
[Authorize]
public class MessagesController : ControllerBase
{
    private readonly IMessageService _messageService;
    
    [HttpGet("conversations")]
    public async Task<IActionResult> GetConversations()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var conversations = await _messageService.GetConversationsAsync(
            Guid.Parse(userId));
        return Ok(conversations);
    }
    
    [HttpGet("conversations/{conversationId}")]
    public async Task<IActionResult> GetMessages(Guid conversationId)
    {
        var messages = await _messageService.GetMessagesAsync(conversationId);
        return Ok(messages);
    }
    
    [HttpPost]
    public async Task<IActionResult> SendMessage(
        [FromBody] SendMessageDTO dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var message = await _messageService.SendMessageAsync(
            Guid.Parse(userId), dto.ConversationId, dto.Content);
        return Ok(message);
    }
}
```

---

## Service Layer Example

```csharp
public interface IProductService
{
    Task<PaginatedResponseDTO<ProductDTO>> GetFeedAsync(
        int page, int limit, string category = null, string size = null);
    Task<ProductDetailDTO> GetProductAsync(Guid id);
    Task<ProductDTO> CreateProductAsync(Guid userId, CreateProductDTO dto);
    Task UpdateProductAsync(Guid id, UpdateProductDTO dto);
    Task DeleteProductAsync(Guid id);
}

public class ProductService : IProductService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IImageUploadService _imageUploadService;
    private readonly ICacheService _cacheService;
    
    public ProductService(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IImageUploadService imageUploadService,
        ICacheService cacheService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _imageUploadService = imageUploadService;
        _cacheService = cacheService;
    }
    
    public async Task<PaginatedResponseDTO<ProductDTO>> GetFeedAsync(
        int page, int limit, string category = null, string size = null)
    {
        // Check cache first
        string cacheKey = $"feed_page_{page}_{category}_{size}";
        var cached = await _cacheService.GetAsync<PaginatedResponseDTO<ProductDTO>>(cacheKey);
        if (cached != null)
            return cached;
        
        // Query database
        var (products, totalCount) = await _unitOfWork.Products
            .GetFeedAsync(page, limit, category, size);
        
        var dtos = _mapper.Map<List<ProductDTO>>(products);
        
        var result = new PaginatedResponseDTO<ProductDTO>
        {
            Data = dtos,
            Page = page,
            PageSize = limit,
            TotalCount = totalCount,
            HasNextPage = totalCount > (page * limit)
        };
        
        // Cache for 5 minutes
        await _cacheService.SetAsync(cacheKey, result, TimeSpan.FromMinutes(5));
        
        return result;
    }
    
    public async Task<ProductDTO> CreateProductAsync(
        Guid userId, CreateProductDTO dto)
    {
        // Validate seller role
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user.Role == UserRole.Buyer)
            throw new BadRequestException("Only sellers can create products");
        
        var product = new Product
        {
            SellerId = userId,
            Title = dto.Title,
            Description = dto.Description,
            Category = dto.Category,
            Size = dto.Size,
            Condition = dto.Condition,
            Price = dto.Price,
            IsAvailable = true,
            CreatedAt = DateTime.UtcNow
        };
        
        // Upload images and associate
        if (dto.Images != null && dto.Images.Count > 0)
        {
            var imageUrls = await _imageUploadService
                .UploadProductImagesAsync(dto.Images);
            
            product.Images = imageUrls
                .Select((url, index) => new ProductImage
                {
                    Url = url,
                    DisplayOrder = index
                })
                .ToList();
        }
        
        await _unitOfWork.Products.AddAsync(product);
        await _unitOfWork.SaveChangesAsync();
        
        // Invalidate feed cache
        await _cacheService.InvalidateAsync("feed_*");
        
        return _mapper.Map<ProductDTO>(product);
    }
}
```

---

## Repository Pattern

```csharp
public interface IRepository<T> where T : BaseEntity
{
    Task<T> GetByIdAsync(Guid id);
    Task<IEnumerable<T>> GetAllAsync();
    Task AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(Guid id);
}

public class Repository<T> : IRepository<T> where T : BaseEntity
{
    protected readonly ApplicationDbContext _context;
    
    public Repository(ApplicationDbContext context)
    {
        _context = context;
    }
    
    public virtual async Task<T> GetByIdAsync(Guid id)
    {
        return await _context.Set<T>().FindAsync(id);
    }
    
    public virtual async Task AddAsync(T entity)
    {
        entity.Id = Guid.NewGuid();
        await _context.Set<T>().AddAsync(entity);
    }
}

public class ProductRepository : Repository<Product>
{
    public ProductRepository(ApplicationDbContext context) 
        : base(context) { }
    
    public async Task<(List<Product>, int)> GetFeedAsync(
        int page, int limit, string category = null, string size = null)
    {
        var query = _context.Products
            .Where(p => p.IsAvailable)
            .OrderByDescending(p => p.IsBoosted)
            .ThenByDescending(p => p.CreatedAt);
        
        if (!string.IsNullOrEmpty(category))
            query = query.Where(p => p.Category == category);
        
        if (!string.IsNullOrEmpty(size))
            query = query.Where(p => p.Size == size);
        
        var totalCount = await query.CountAsync();
        
        var products = await query
            .Skip((page - 1) * limit)
            .Take(limit)
            .Include(p => p.Seller)
            .Include(p => p.Images)
            .Include(p => p.Likes)
            .Include(p => p.Comments)
            .ToListAsync();
        
        return (products, totalCount);
    }
}
```

---

## SignalR Chat Hub

```csharp
[Authorize]
public class ChatHub : Hub
{
    private readonly IMessageService _messageService;
    private readonly INotificationService _notificationService;
    
    public ChatHub(
        IMessageService messageService,
        INotificationService notificationService)
    {
        _messageService = messageService;
        _notificationService = notificationService;
    }
    
    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        await Groups.AddToGroupAsync(Context.ConnectionId, $"user-{userId}");
        await base.OnConnectedAsync();
    }
    
    public async Task JoinConversation(Guid conversationId)
    {
        await Groups.AddToGroupAsync(
            Context.ConnectionId, $"conversation-{conversationId}");
    }
    
    public async Task SendMessage(Guid conversationId, string content)
    {
        var userId = Guid.Parse(
            Context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        
        var message = await _messageService.SendMessageAsync(
            userId, conversationId, content);
        
        await Clients.Group($"conversation-{conversationId}")
            .SendAsync("ReceiveMessage", message);
    }
    
    public async Task NotifyTyping(Guid conversationId)
    {
        var userId = Context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        await Clients.Group($"conversation-{conversationId}")
            .SendAsync("UserTyping", userId);
    }
}
```

---

## Dependency Injection Setup

```csharp
// Program.cs
public static void Main(string[] args)
{
    var builder = WebApplication.CreateBuilder(args);
    
    // Add services
    builder.Services.AddDbContext<ApplicationDbContext>(
        options => options.UseNpgsql(
            builder.Configuration.GetConnectionString("DefaultConnection")));
    
    builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
    builder.Services.AddScoped<IAuthService, AuthService>();
    builder.Services.AddScoped<IProductService, ProductService>();
    builder.Services.AddScoped<IMessageService, MessageService>();
    builder.Services.AddScoped<IInteractionService, InteractionService>();
    
    builder.Services.AddAutoMapper(typeof(Program));
    
    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = builder.Configuration["Jwt:Issuer"],
                ValidAudience = builder.Configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(
                        builder.Configuration["Jwt:SecretKey"]))
            };
        });
    
    builder.Services.AddSignalR();
    builder.Services.AddMemoryCache();
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowFrontend", builder =>
        {
            builder
                .WithOrigins("http://localhost:3000")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
        });
    });
    
    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
    
    var app = builder.Build();
    
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }
    
    app.UseHttpsRedirection();
    app.UseCors("AllowFrontend");
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();
    app.MapHub<ChatHub>("/hubs/chat");
    app.MapHub<NotificationHub>("/hubs/notifications");
    
    app.Run();
}
```
