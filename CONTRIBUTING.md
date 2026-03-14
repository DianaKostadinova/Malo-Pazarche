# Contributing to MaloPazarche

Thank you for your interest in contributing to MaloPazarche! We welcome contributions from the community.

## Code of Conduct

- Be respectful and inclusive
- Welcome diverse perspectives
- Focus on constructive feedback
- Report harassment to maintainers

## Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/MaloPazarche.git
   cd MaloPazarche
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Set up development environment**
   ```bash
   docker-compose up -d
   # or follow manual setup in README.md
   ```

4. **Make your changes**
   - Follow the code style guidelines
   - Add tests for new features
   - Update documentation as needed

5. **Commit with conventional format**
   ```bash
   git commit -m "feat(scope): description"
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Commit Message Format

We follow **Conventional Commits** for clear history:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation
- **style**: Code style (formatting, missing semicolons)
- **refactor**: Code refactoring
- **test**: Adding tests
- **ci**: CI/CD changes
- **chore**: Build, dependencies, tools

### Examples

```bash
# Feature
git commit -m "feat(products): add image carousel component"

# Bug fix
git commit -m "fix(auth): prevent token expiration race condition"

# Documentation
git commit -m "docs(readme): add Docker setup instructions"

# Style
git commit -m "style(frontend): format component imports"

# With body
git commit -m "feat(chat): implement real-time typing indicator

- Add WebSocket event handler
- Display typing status with animation
- Clear typing indicator after 5 seconds of inactivity

Closes #123"
```

## Coding Standards

### Frontend (TypeScript/React)

```typescript
// ✅ Good
interface ProductCardProps {
  product: Product;
  onLike: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onLike,
}) => {
  const handleLike = () => {
    onLike(product.id);
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.title} />
      <h2>{product.title}</h2>
      <button onClick={handleLike}>Like</button>
    </div>
  );
};

// ❌ Avoid
const ProductCard = (props) => {
  return (
    <div onClick={() => props.func(props.data.id)}>
      {/* Unclear naming, no type safety */}
    </div>
  );
};
```

**Rules:**
- Use TypeScript for type safety
- Name variables clearly (not `x`, `temp`, `result`)
- Use functional components with hooks
- Extract custom hooks for reusable logic
- Keep components focused on single responsibility
- Use Tailwind CSS for styling
- Add JSDoc comments for complex functions

### Backend (C#)

```csharp
// ✅ Good
public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJwtTokenService _jwtService;

    public AuthService(
        IUnitOfWork unitOfWork,
        IJwtTokenService jwtService)
    {
        _unitOfWork = unitOfWork;
        _jwtService = jwtService;
    }

    public async Task<AuthResponseDTO> LoginAsync(LoginRequestDTO dto)
    {
        var user = await _unitOfWork.Users.GetByEmailAsync(dto.Email);
        
        if (user == null)
            throw new UnauthorizedException("Invalid credentials");

        var token = _jwtService.GenerateAccessToken(user);
        return new AuthResponseDTO { AccessToken = token };
    }
}

// ❌ Avoid
public class AuthService
{
    public void Login(string e, string p) // Incomplete name, wrong return type
    {
        var u = db.Users.Where(x => x.Email == e).FirstOrDefault();
        if (u != null && u.password == p) // Don't compare passwords directly!
        {
            // ...
        }
    }
}
```

**Rules:**
- Use PascalCase for classes and methods
- Use camelCase for variables
- Inject dependencies through constructor
- Use nullable reference types
- Add XML comments to public methods
- Handle exceptions appropriately
- Use LINQ properly (avoid N+1 queries)
- Follow SOLID principles

## Testing Guidelines

### Frontend Tests

```typescript
// components/ProductCard.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  it('renders product title', () => {
    const product = {
      id: '1',
      title: 'Vintage Jacket',
      price: 25,
      image: 'jacket.jpg',
    };

    render(<ProductCard product={product} onLike={jest.fn()} />);
    
    expect(screen.getByText('Vintage Jacket')).toBeInTheDocument();
  });

  it('calls onLike when like button is clicked', async () => {
    const mockOnLike = jest.fn();
    const product = { id: '1', title: 'Item' } as any;

    render(<ProductCard product={product} onLike={mockOnLike} />);
    
    const likeButton = screen.getByRole('button', { name: /like/i });
    await userEvent.click(likeButton);

    expect(mockOnLike).toHaveBeenCalledWith('1');
  });
});
```

### Backend Tests

```csharp
// MaloPazarche.Tests/Unit/Services/AuthServiceTests.cs
public class AuthServiceTests
{
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Mock<IJwtTokenService> _mockJwtService;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockJwtService = new Mock<IJwtTokenService>();
        _authService = new AuthService(_mockUnitOfWork.Object, _mockJwtService.Object);
    }

    [Fact]
    public async Task LoginAsync_WithValidCredentials_ReturnsToken()
    {
        // Arrange
        var user = new User { Id = Guid.NewGuid(), Email = "test@example.com" };
        _mockUnitOfWork.Setup(x => x.Users.GetByEmailAsync("test@example.com"))
            .ReturnsAsync(user);
        _mockJwtService.Setup(x => x.GenerateAccessToken(user))
            .Returns("valid-token");

        // Act
        var result = await _authService.LoginAsync(
            new LoginRequestDTO { Email = "test@example.com", Password = "password" });

        // Assert
        Assert.Equal("valid-token", result.AccessToken);
    }

    [Fact]
    public async Task LoginAsync_WithInvalidEmail_ThrowsException()
    {
        // Arrange
        _mockUnitOfWork.Setup(x => x.Users.GetByEmailAsync(It.IsAny<string>()))
            .ReturnsAsync((User)null);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedException>(
            () => _authService.LoginAsync(
                new LoginRequestDTO { Email: "invalid@example.com", Password = "password" }));
    }
}
```

**Testing Requirements:**
- Aim for 80%+ code coverage
- Test happy path and error cases
- Use descriptive test names
- One assertion per test (or related assertions)
- Mock external dependencies

## Code Review Checklist

Before submitting a PR, ensure:

### General
- [ ] Code follows project naming conventions
- [ ] No commented-out code left
- [ ] No console.logs in production code
- [ ] No hardcoded values (use constants/config)
- [ ] Error messages are user-friendly
- [ ] No sensitive data committed (keys, passwords)
- [ ] Changes are well-documented

### Frontend
- [ ] Components are reusable
- [ ] Props are typed
- [ ] Custom hooks extracted for logic
- [ ] Responsive design tested
- [ ] Accessibility considered (alt text, aria labels)
- [ ] Performance optimized (memoization, lazy loading)
- [ ] Build size checked

### Backend
- [ ] All dependencies injected
- [ ] Database queries optimized (no N+1)
- [ ] Input validation present
- [ ] Authorization checks in place
- [ ] Error handling comprehensive
- [ ] Logging at appropriate levels
- [ ] Performance benchmarked

### Database
- [ ] Migrations created
- [ ] Indexes added for frequently queried columns
- [ ] Soft deletes used where appropriate
- [ ] Foreign keys defined
- [ ] Constraints enforced

### Documentation
- [ ] Code comments explain "why", not "what"
- [ ] API documentation updated (Swagger)
- [ ] Architecture changes documented
- [ ] README updated if needed
- [ ] Complex algorithms explained

## PR Title Format

```
[TYPE] Brief description
```

**Types:** FEATURE, FIX, DOCS, REFACTOR, CHORE, TEST

**Examples:**
- `[FEATURE] Add product boosting functionality`
- `[FIX] Resolve WebSocket connection race condition`
- `[DOCS] Update database schema documentation`
- `[REFACTOR] Extract reusable chat logic into custom hook`

## PR Description Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation
- [ ] Performance improvement
- [ ] Breaking change

## Changes Made
- Bullet point 1
- Bullet point 2
- Bullet point 3

## How to Test
Steps to verify the changes:
1. Step 1
2. Step 2
3. Step 3

## Screenshots (if applicable)
Add images for UI changes.

## Related Issues
Closes #123

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Code follows style guidelines
- [ ] Self-review completed
```

## Performance Guidelines

### Frontend
- Lazy load images and components
- Code split by route
- Use React.memo for expensive components
- Avoid inline functions in props
- Use useCallback for callbacks
- Monitor bundle size

### Backend
- Use async/await for I/O operations
- Implement caching for expensive queries
- Add indexes to frequently queried columns
- Use pagination for large datasets
- Connection pooling for database
- Async logging and background jobs

## Documentation

### Code Comments
```typescript
// ✅ Good - explains WHY
// We cache the feed for 5 minutes because product lists don't change frequently
// This reduces database load significantly during peak hours
const cachedFeed = await cache.get(`feed-${page}`);

// ❌ Bad - explains WHAT (code already shows this)
// Get the feed from cache
const cachedFeed = await cache.get(`feed-${page}`);
```

### Function Documentation
```typescript
/**
 * Fetches products with pagination and optional filters
 * 
 * @param page - Page number (1-indexed)
 * @param limit - Items per page (max 100)
 * @param filters - Optional category, size, condition filters
 * @returns Paginated product list with metadata
 * @throws ApiError if page is out of range
 * 
 * @example
 * const products = await getProducts(1, 20, { category: 'clothing' });
 */
export async function getProducts(
  page: number,
  limit: number,
  filters?: ProductFilters
): Promise<PaginatedResponse<Product>> {
  // ...
}
```

## Questions or Need Help?

- **Discussions**: Use GitHub discussions
- **Issues**: Browse existing issues or create a new one
- **Email**: dev@malopazeche.mk
- **Documentation**: Check docs/ folder

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

**Happy coding! 🚀**
