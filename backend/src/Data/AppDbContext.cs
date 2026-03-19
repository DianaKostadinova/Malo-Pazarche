using Microsoft.EntityFrameworkCore;
using MaloPazarche.Models;

namespace MaloPazarche.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Product> Products => Set<Product>();
        public DbSet<ProductImage> ProductImages => Set<ProductImage>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email).IsUnique();
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username).IsUnique();
            modelBuilder.Entity<User>()
                .Property(u => u.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            modelBuilder.Entity<User>()
                .Property(u => u.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            // Product
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Seller)
                .WithMany()
                .HasForeignKey(p => p.SellerId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Product>()
                .Property(p => p.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            modelBuilder.Entity<Product>()
                .Property(p => p.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            // ProductImage
            modelBuilder.Entity<ProductImage>()
                .HasOne(i => i.Product)
                .WithMany(p => p.Images)
                .HasForeignKey(i => i.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}