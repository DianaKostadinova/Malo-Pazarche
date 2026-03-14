# MaloPazarche - Authentication & Security

## Authentication System

MaloPazarche uses **JWT (JSON Web Tokens)** with refresh tokens for secure, stateless authentication.

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      REGISTRATION FLOW                           │
└─────────────────────────────────────────────────────────────────┘

1. Frontend: User fills registration form
   {
     "username": "thrift_shop",
     "email": "shop@example.com",
     "password": "securePassword123!",
     "role": "seller"
   }

2. POST /api/auth/register
   ↓
3. Backend validates:
   - Email doesn't exist
   - Username doesn't exist
   - Password meets requirements (min 8 chars, uppercase, number, special)
   ↓
4. Hash password using BCrypt (cost factor 11)
   ↓
5. Create user record in database
   ↓
6. Generate JWT token and refresh token
   ↓
7. Response: 201 Created
   {
     "success": true,
     "data": {
       "user": {
         "id": "550e8400-e29b-41d4-a716-446655440000",
         "username": "thrift_shop",
         "email": "shop@example.com",
         "role": "seller"
       },
       "accessToken": "eyJhbGciOiJIUzI1NiIs...",
       "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
       "expiresIn": 3600
     }
   }

8. Frontend stores:
   - accessToken in httpOnly cookie (1 hour expiry)
   - refreshToken in httpOnly cookie (7 days expiry)
   - User data in Zustand store

┌─────────────────────────────────────────────────────────────────┐
│                      LOGIN FLOW                                  │
└─────────────────────────────────────────────────────────────────┘

1. Frontend: POST /api/auth/login
   {
     "email": "shop@example.com",
     "password": "securePassword123!"
   }

2. Backend:
   - Find user by email
   - Compare password with hash using BCrypt
   - If mismatch: throw UnauthorizedException
   ↓
3. Generate JWT tokens
   ↓
4. Response: 200 OK with tokens (same as registration)

5. Frontend receives tokens and stores in httpOnly cookies

┌─────────────────────────────────────────────────────────────────┐
│              API CALL WITH AUTHENTICATION                        │
└─────────────────────────────────────────────────────────────────┘

1. Frontend adds Authorization header:
   Authorization: Bearer <accessToken>

2. Backend JWT middleware:
   - Extract token from header
   - Verify signature using secret key
   - Check token expiration
   - Extract claims (user ID, role, etc.)
   ↓
3. If valid: Request proceeds with User context
   If invalid: 401 Unauthorized

┌─────────────────────────────────────────────────────────────────┐
│              TOKEN REFRESH FLOW                                  │
└─────────────────────────────────────────────────────────────────┘

1. Access token expires

2. Frontend intercepts 401 response

3. Frontend: POST /api/auth/refresh
   (refreshToken sent automatically in cookie)

4. Backend:
   - Verify refresh token
   - Check if user still exists
   - Generate new access token
   ↓
5. Frontend updates httpOnly cookie

6. Retry original request

┌─────────────────────────────────────────────────────────────────┐
│                    LOGOUT FLOW                                   │
└─────────────────────────────────────────────────────────────────┘

1. Frontend: POST /api/auth/logout

2. Backend:
   - Invalidate refresh token (add to blacklist in cache)
   - Clear any session data

3. Frontend:
   - Clear cookies
   - Clear Zustand auth store
   - Redirect to login page
```

---

## JWT Implementation

### Token Payload

```csharp
public class TokenClaims
{
    public string Sub { get; set; } // User ID
    public string UserName { get; set; }
    public string Email { get; set; }
    public string Role { get; set; } // Buyer, Seller, Both
    public long Iat { get; set; } // Issued at
    public long Exp { get; set; } // Expiration
}
```

### Access Token
- **Expiration**: 1 hour
- **Used for**: Authenticating API requests
- **Storage**: httpOnly cookie
- **Header**: `Authorization: Bearer <token>`

### Refresh Token
- **Expiration**: 7 days
- **Used for**: Getting new access token
- **Storage**: httpOnly cookie
- **Contained in**: POST /api/auth/refresh

---

## Backend JWT Service

```csharp
public interface IJwtTokenService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    ClaimsPrincipal GetPrincipalFromToken(string token);
    bool ValidateToken(string token);
}

public class JwtTokenService : IJwtTokenService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<JwtTokenService> _logger;
    
    public JwtTokenService(IConfiguration configuration, ILogger<JwtTokenService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }
    
    public string GenerateAccessToken(User user)
    {
        var securityKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
        
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim("avatar", user.AvatarUrl ?? ""),
        };
        
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials);
        
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    
    public string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }
    
    public ClaimsPrincipal GetPrincipalFromToken(string token)
    {
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = false,
            ValidateIssuer = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"])),
            ValidateLifetime = false // Allow expired token for refresh
        };
        
        var tokenHandler = new JwtSecurityTokenHandler();
        var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out _);
        
        return principal;
    }
    
    public bool ValidateToken(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"])),
                ValidateIssuer = true,
                ValidIssuer = _configuration["Jwt:Issuer"],
                ValidateAudience = true,
                ValidAudience = _configuration["Jwt:Audience"],
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            }, out _);
            
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Token validation failed");
            return false;
        }
    }
}
```

---

## Auth Service

```csharp
public interface IAuthService
{
    Task<AuthResponseDTO> RegisterAsync(RegisterRequestDTO dto);
    Task<AuthResponseDTO> LoginAsync(LoginRequestDTO dto);
    Task<AuthResponseDTO> RefreshTokenAsync(ClaimsPrincipal user);
    Task LogoutAsync(ClaimsPrincipal user);
}

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJwtTokenService _jwtService;
    private readonly IPasswordHashingService _passwordService;
    private readonly ICacheService _cacheService;
    private readonly ILogger<AuthService> _logger;
    
    public async Task<AuthResponseDTO> RegisterAsync(RegisterRequestDTO dto)
    {
        // Validate
        if (await _unitOfWork.Users.ExistsByEmailAsync(dto.Email))
            throw new BadRequestException("Email already registered");
        
        if (await _unitOfWork.Users.ExistsByUsernameAsync(dto.Username))
            throw new BadRequestException("Username already taken");
        
        // Create user
        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = _passwordService.HashPassword(dto.Password),
            Role = Enum.Parse<UserRole>(dto.Role),
            IsVerified = false,
            CreatedAt = DateTime.UtcNow
        };
        
        await _unitOfWork.Users.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();
        
        // Generate tokens
        var accessToken = _jwtService.GenerateAccessToken(user);
        var refreshToken = _jwtService.GenerateRefreshToken();
        
        // Store refresh token in cache (with expiry)
        await _cacheService.SetAsync(
            $"refresh-token-{user.Id}",
            refreshToken,
            TimeSpan.FromDays(7));
        
        _logger.LogInformation($"User {user.Username} registered");
        
        return new AuthResponseDTO
        {
            User = new UserDTO
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role.ToString()
            },
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresIn = 3600
        };
    }
    
    public async Task<AuthResponseDTO> LoginAsync(LoginRequestDTO dto)
    {
        // Find user
        var user = await _unitOfWork.Users.GetByEmailAsync(dto.Email);
        if (user == null || !_passwordService.VerifyPassword(dto.Password, user.PasswordHash))
            throw new UnauthorizedException("Invalid credentials");
        
        // Generate tokens
        var accessToken = _jwtService.GenerateAccessToken(user);
        var refreshToken = _jwtService.GenerateRefreshToken();
        
        // Store refresh token
        await _cacheService.SetAsync(
            $"refresh-token-{user.Id}",
            refreshToken,
            TimeSpan.FromDays(7));
        
        _logger.LogInformation($"User {user.Username} logged in");
        
        return new AuthResponseDTO
        {
            User = new UserDTO
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role.ToString()
            },
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresIn = 3600
        };
    }
    
    public async Task<AuthResponseDTO> RefreshTokenAsync(ClaimsPrincipal user)
    {
        var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedException("Invalid token");
        
        var userGuid = Guid.Parse(userId);
        var userEntity = await _unitOfWork.Users.GetByIdAsync(userGuid);
        if (userEntity == null)
            throw new UnauthorizedException("User not found");
        
        var newAccessToken = _jwtService.GenerateAccessToken(userEntity);
        var newRefreshToken = _jwtService.GenerateRefreshToken();
        
        await _cacheService.SetAsync(
            $"refresh-token-{userGuid}",
            newRefreshToken,
            TimeSpan.FromDays(7));
        
        return new AuthResponseDTO
        {
            User = null,
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken,
            ExpiresIn = 3600
        };
    }
    
    public async Task LogoutAsync(ClaimsPrincipal user)
    {
        var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!string.IsNullOrEmpty(userId))
        {
            await _cacheService.DeleteAsync($"refresh-token-{userId}");
            _logger.LogInformation($"User {userId} logged out");
        }
    }
}
```

---

## Frontend Auth Implementation (React/Zustand)

```typescript
// store/authStore.ts
import { create } from 'zustand';
import { authService } from '@/services/auth.service';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'buyer' | 'seller' | 'both';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(email, password);
      set({ 
        user: response.user, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      throw error;
    }
  },
  
  register: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(data);
      set({ 
        user: response.user, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      throw error;
    }
  },
  
  logout: async () => {
    try {
      await authService.logout();
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },
  
  checkAuth: async () => {
    try {
      const response = await authService.getMe();
      set({ user: response, isAuthenticated: true });
    } catch {
      set({ user: null, isAuthenticated: false });
    }
  },
  
  clearError: () => set({ error: null }),
}));

// services/auth.service.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // Include cookies
});

// Add response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Refresh token
        await api.post('/auth/refresh');
        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const authService = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (data: any) =>
    api.post('/auth/register', data),
  
  logout: () =>
    api.post('/auth/logout'),
  
  refresh: () =>
    api.post('/auth/refresh'),
  
  getMe: () =>
    api.get('/auth/me'),
};
```

---

## Protected Routes

```typescript
// components/auth/ProtectedRoute.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return isAuthenticated ? <>{children}</> : null;
};

// Usage
// app/products/create/page.tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function CreateProductPage() {
  return (
    <ProtectedRoute>
      <CreateProductForm />
    </ProtectedRoute>
  );
}
```

---

## Configuration

```json
// appsettings.json
{
  "Jwt": {
    "SecretKey": "your-very-long-secret-key-min-32-chars",
    "Issuer": "malopazeche.mk",
    "Audience": "malopazeche-users",
    "AccessTokenExpiration": 3600,
    "RefreshTokenExpiration": 604800
  },
  "PasswordHashing": {
    "BCryptCost": 11
  }
}
```

---

## Security Best Practices

1. **Password Requirements**
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character (!@#$%^&*)

2. **Token Storage**
   - httpOnly cookies (immune to XSS)
   - Secure flag for HTTPS only
   - SameSite=Strict for CSRF protection

3. **Password Hashing**
   - BCrypt with cost factor 11
   - Never use plain text or MD5
   - Never compare passwords directly

4. **Rate Limiting**
   - 5 login attempts per 15 minutes per IP
   - 10 registration attempts per hour per IP

5. **HTTPS**
   - All production traffic encrypted
   - HSTS header enabled

6. **CORS**
   - Whitelist specific origins
   - Disable credentials if not needed

---

## Logout Implementation

```csharp
[Authorize]
[HttpPost("logout")]
public async Task<IActionResult> Logout()
{
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    await _authService.LogoutAsync(User);
    
    // Clear authentication cookie
    Response.Cookies.Delete("AuthToken");
    
    return NoContent();
}
```
