using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MaloPazarche.Data;
using MaloPazarche.DTOs;
using MaloPazarche.Models;

namespace MaloPazarche.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly ILogger<ProductsController> _logger;
        private readonly IWebHostEnvironment _env;

        public ProductsController(AppDbContext db, ILogger<ProductsController> logger, IWebHostEnvironment env)
        {
            _db = db;
            _logger = logger;
            _env = env;
        }

        // GET /api/products?page=1&pageSize=20&category=&search=
        [HttpGet]
        public async Task<ActionResult<ProductListResponse>> GetProducts(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? category = null,
            [FromQuery] string? search = null)
        {
            var query = _db.Products
                .Include(p => p.Seller)
                .Include(p => p.Images)
                .Where(p => p.IsAvailable)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(category))
                query = query.Where(p => p.Category == category);

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(p =>
                    p.Title.ToLower().Contains(search.ToLower()) ||
                    (p.Description != null && p.Description.ToLower().Contains(search.ToLower())));

            var total = await query.CountAsync();

            var products = await query
                .OrderByDescending(p => p.IsBoosted)
                .ThenByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new ProductListResponse
            {
                Items = products.Select(MapToResponse).ToList(),
                Total = total,
                Page = page,
                PageSize = pageSize,
                HasMore = (page * pageSize) < total,
            });
        }

        // GET /api/products/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductResponse>> GetProduct(Guid id)
        {
            var product = await _db.Products
                .Include(p => p.Seller)
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) return NotFound();

            return Ok(MapToResponse(product));
        }

        // POST /api/products
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ProductResponse>> CreateProduct([FromBody] CreateProductRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdClaim = User.FindFirst("sub")?.Value;
            if (!Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            var product = new Product
            {
                SellerId = userId,
                Title = request.Title,
                Description = request.Description,
                Category = request.Category,
                Size = request.Size,
                Condition = request.Condition,
                Price = request.Price,
            };

            _db.Products.Add(product);
            await _db.SaveChangesAsync();

            var created = await _db.Products
                .Include(p => p.Seller)
                .Include(p => p.Images)
                .FirstAsync(p => p.Id == product.Id);

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, MapToResponse(created));
        }

        // POST /api/products/{id}/images
        [Authorize]
        [HttpPost("{id}/images")]
        public async Task<ActionResult> UploadImage(Guid id, IFormFile file)
        {
            var userIdClaim = User.FindFirst("sub")?.Value;
            if (!Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            var product = await _db.Products.FindAsync(id);
            if (product == null) return NotFound();
            if (product.SellerId != userId) return Forbid();

            if (file == null || file.Length == 0)
                return BadRequest(new { message = "No file provided" });

            var allowed = new[] { "image/jpeg", "image/png", "image/webp" };
            if (!allowed.Contains(file.ContentType.ToLower()))
                return BadRequest(new { message = "Only JPEG, PNG, and WebP images are allowed" });

            if (file.Length > 5 * 1024 * 1024)
                return BadRequest(new { message = "Image must be under 5MB" });

            // Save to /app/uploads/
            var uploadsDir = Path.Combine(_env.ContentRootPath, "uploads");
            Directory.CreateDirectory(uploadsDir);

            var ext = Path.GetExtension(file.FileName).ToLower();
            var fileName = $"{Guid.NewGuid()}{ext}";
            var filePath = Path.Combine(uploadsDir, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
                await file.CopyToAsync(stream);

            var existingImages = await _db.ProductImages
                .Where(i => i.ProductId == id)
                .CountAsync();

            var image = new ProductImage
            {
                ProductId = id,
                ImageUrl = $"/uploads/{fileName}",
                IsPrimary = existingImages == 0,
                Order = existingImages,
            };

            _db.ProductImages.Add(image);
            await _db.SaveChangesAsync();

            return Ok(new { imageUrl = image.ImageUrl, isPrimary = image.IsPrimary });
        }

        // DELETE /api/products/{id}
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(Guid id)
        {
            var userIdClaim = User.FindFirst("sub")?.Value;
            if (!Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            var product = await _db.Products.FindAsync(id);
            if (product == null) return NotFound();
            if (product.SellerId != userId) return Forbid();

            _db.Products.Remove(product);
            await _db.SaveChangesAsync();

            return NoContent();
        }

        private static ProductResponse MapToResponse(Product p) => new()
        {
            Id = p.Id,
            SellerId = p.SellerId,
            Title = p.Title,
            Description = p.Description,
            Category = p.Category,
            Size = p.Size,
            Condition = p.Condition,
            Price = p.Price,
            IsAvailable = p.IsAvailable,
            IsBoosted = p.IsBoosted,
            CreatedAt = p.CreatedAt,
            Seller = p.Seller == null ? null : new SellerInfo
            {
                Id = p.Seller.Id,
                Username = p.Seller.Username,
                FullName = p.Seller.FullName,
                ProfileImageUrl = p.Seller.ProfileImageUrl,
            },
            Images = p.Images.OrderBy(i => i.Order).Select(i => new ProductImageResponse
            {
                Id = i.Id,
                ImageUrl = i.ImageUrl,
                IsPrimary = i.IsPrimary,
            }).ToList(),
        };
    }
}