using BC = BCrypt.Net.BCrypt;
using MaloPazarche.DTOs;
using MaloPazarche.Models;
using MaloPazarche.Repositories;

namespace MaloPazarche.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<AuthResponse> LoginAsync(LoginRequest request);
        Task<AuthResponse> RefreshTokenAsync(string refreshToken, Guid userId);
    }

    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            IUserRepository userRepository,
            IJwtTokenService jwtTokenService,
            ILogger<AuthService> logger)
        {
            _userRepository = userRepository;
            _jwtTokenService = jwtTokenService;
            _logger = logger;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            try
            {
                // Check if user exists
                var existingUser = await _userRepository.GetByEmailOrUsernameAsync(request.Email);
                if (existingUser != null)
                {
                    return new AuthResponse
                    {
                        Success = false,
                        Message = "An account with this email or username already exists"
                    };
                }

                // Create new user
                var user = new User
                {
                    Email = request.Email.ToLower(),
                    Username = request.Username.ToLower(),
                    PasswordHash = BC.HashPassword(request.Password, 11),
                    FullName = request.FullName ?? request.Username,
                    IsActive = true
                };

                await _userRepository.CreateAsync(user);

                _logger.LogInformation("User {Username} registered successfully", user.Username);

                return new AuthResponse
                {
                    Success = true,
                    Message = "Registration successful",
                    AccessToken = _jwtTokenService.GenerateAccessToken(user),
                    RefreshToken = GenerateAndStoreRefreshToken(user),
                    User = MapToUserDto(user)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError("Registration error: {Message}", ex.Message);
                return new AuthResponse
                {
                    Success = false,
                    Message = "An error occurred during registration"
                };
            }
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            try
            {
                var user = await _userRepository.GetByEmailOrUsernameAsync(request.EmailOrUsername);

                if (user == null || !BC.Verify(request.Password, user.PasswordHash))
                {
                    _logger.LogWarning("Failed login attempt for {EmailOrUsername}", request.EmailOrUsername);
                    return new AuthResponse
                    {
                        Success = false,
                        Message = "Invalid credentials"
                    };
                }

                if (!user.IsActive)
                {
                    return new AuthResponse
                    {
                        Success = false,
                        Message = "Account is not active"
                    };
                }

                var accessToken = _jwtTokenService.GenerateAccessToken(user);
                var refreshToken = GenerateAndStoreRefreshToken(user);

                _logger.LogInformation("User {Username} logged in successfully", user.Username);

                return new AuthResponse
                {
                    Success = true,
                    Message = "Login successful",
                    AccessToken = accessToken,
                    RefreshToken = refreshToken,
                    User = MapToUserDto(user)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError("Login error: {Message}", ex.Message);
                return new AuthResponse
                {
                    Success = false,
                    Message = "An error occurred during login"
                };
            }
        }

        public async Task<AuthResponse> RefreshTokenAsync(string refreshToken, Guid userId)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(userId);

                if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime < DateTime.UtcNow)
                {
                    return new AuthResponse
                    {
                        Success = false,
                        Message = "Invalid refresh token"
                    };
                }

                var newAccessToken = _jwtTokenService.GenerateAccessToken(user);
                var newRefreshToken = GenerateAndStoreRefreshToken(user);

                return new AuthResponse
                {
                    Success = true,
                    Message = "Token refreshed successfully",
                    AccessToken = newAccessToken,
                    RefreshToken = newRefreshToken,
                    User = MapToUserDto(user)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError("Token refresh error: {Message}", ex.Message);
                return new AuthResponse
                {
                    Success = false,
                    Message = "An error occurred while refreshing token"
                };
            }
        }

        private string GenerateAndStoreRefreshToken(User user)
        {
            var refreshToken = _jwtTokenService.GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            _userRepository.UpdateAsync(user).Wait();
            return refreshToken;
        }

        private UserDto MapToUserDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                FullName = user.FullName,
                ProfileImageUrl = user.ProfileImageUrl,
                CreatedAt = user.CreatedAt
            };
        }
    }
}
