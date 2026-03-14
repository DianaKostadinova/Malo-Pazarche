using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using MaloPazarche.DTOs;
using MaloPazarche.Services;

namespace MaloPazarche.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        /// <summary>
        /// Register a new user account
        /// </summary>
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _authService.RegisterAsync(request);

            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        /// <summary>
        /// Login with email/username and password
        /// </summary>
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _authService.LoginAsync(request);

            if (!response.Success)
            {
                return Unauthorized(response);
            }

            return Ok(response);
        }

        /// <summary>
        /// Refresh access token using refresh token
        /// </summary>
        [HttpPost("refresh-token")]
        public async Task<ActionResult<AuthResponse>> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userIdClaim = User.FindFirst("sub");
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new AuthResponse
                {
                    Success = false,
                    Message = "Invalid token"
                });
            }

            var response = await _authService.RefreshTokenAsync(request.RefreshToken, userId);

            if (!response.Success)
            {
                return Unauthorized(response);
            }

            return Ok(response);
        }

        /// <summary>
        /// Get current user profile
        /// </summary>
        [HttpGet("me")]
        public ActionResult GetCurrentUser()
        {
            var userId = User.FindFirst("sub")?.Value;
            var email = User.FindFirst("email")?.Value;
            var username = User.FindFirst("username")?.Value;
            var role = User.FindFirst("role")?.Value;

            return Ok(new
            {
                id = userId,
                email = email,
                username = username,
                role = role
            });
        }
    }
}
