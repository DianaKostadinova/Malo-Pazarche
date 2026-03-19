using System.ComponentModel.DataAnnotations;

namespace MaloPazarche.DTOs
{
    public class CreateProductRequest
    {
        [Required(ErrorMessage = "Title is required")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Title must be between 3 and 100 characters")]
        public string Title { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Category is required")]
        public string Category { get; set; } = string.Empty;

        public string? Size { get; set; }

        [Required(ErrorMessage = "Condition is required")]
        public string Condition { get; set; } = string.Empty;

        [Required(ErrorMessage = "Price is required")]
        [Range(0.01, 99999.99, ErrorMessage = "Price must be between 0.01 and 99999.99")]
        public decimal Price { get; set; }
    }

    public class ProductResponse
    {
        public Guid Id { get; set; }
        public Guid SellerId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Category { get; set; } = string.Empty;
        public string? Size { get; set; }
        public string Condition { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public bool IsAvailable { get; set; }
        public bool IsBoosted { get; set; }
        public DateTime CreatedAt { get; set; }
        public SellerInfo? Seller { get; set; }
        public List<ProductImageResponse> Images { get; set; } = new();
    }

    public class SellerInfo
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string? FullName { get; set; }
        public string? ProfileImageUrl { get; set; }
    }

    public class ProductImageResponse
    {
        public Guid Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsPrimary { get; set; }
    }

    public class ProductListResponse
    {
        public List<ProductResponse> Items { get; set; } = new();
        public int Total { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public bool HasMore { get; set; }
    }
}