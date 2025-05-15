using System.Security.Claims;
using System.Security.Cryptography;
using EtudeBackend.Features.Auth.Models;
using EtudeBackend.Features.Auth.Services;
using EtudeBackend.Features.Users.Services;
using EtudeBackend.Shared.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;

namespace EtudeBackend.Features.Auth.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IOAuthService _oauthService;
    private readonly IUserService _userService;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthController> _logger;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IEmailService _emailService;
    private readonly IAuthService _authService;
    private readonly ITokenStorageService _tokenStorageService;

    public AuthController(
        IOAuthService oauthService,
        IUserService userService,
        IConfiguration configuration,
        ILogger<AuthController> logger,
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IEmailService emailService,
        IAuthService authService,
        ITokenStorageService tokenStorageService,
        IDistributedCache cache)
    {
        _oauthService = oauthService;
        _userService = userService;
        _configuration = configuration;
        _logger = logger;
        _userManager = userManager;
        _signInManager = signInManager;
        _emailService = emailService;
        _authService = authService;
        _tokenStorageService = tokenStorageService;
    }

    /// <summary>
    /// Перенаправляет пользователя на страницу аутентификации OAuth
    /// </summary>
    [HttpGet("login")]
    [ProducesResponseType(StatusCodes.Status302Found)]
    public IActionResult Login([FromQuery] string? redirectAfterLogin)
    {
        try
        {
            string state;
            if (!string.IsNullOrEmpty(redirectAfterLogin))
            {
                state = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(redirectAfterLogin));
            }
            else
            {
                state = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes("/"));
            }

            _logger.LogInformation("OAuth авторизация. RedirectAfterLogin: {Redirect}, Encoded state: {State}", 
                redirectAfterLogin ?? "/", state);
            
            var baseUrl = _configuration["Application:BaseUrl"];
            var callbackUrl = $"{baseUrl}/api/auth/callback";
            
            var authUrl = _oauthService.GetAuthorizationUrl(callbackUrl, state);
        
            _logger.LogInformation("Перенаправление на OAuth авторизацию: {Url}", authUrl);
        
            return Redirect(authUrl);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при формировании URL для OAuth авторизации");
            return BadRequest("Ошибка при перенаправлении на страницу авторизации");
        }
    }

    /// <summary>
    /// Обрабатывает callback от сервера OAuth после успешной авторизации
    /// </summary>
    [HttpGet("callback")]
    [ProducesResponseType(StatusCodes.Status302Found)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Callback([FromQuery] string code, [FromQuery] string? state = null)
{
    if (string.IsNullOrEmpty(code))
    {
        _logger.LogWarning("OAuth callback без кода авторизации");
        return BadRequest("Authorization code is missing");
    }

    _logger.LogInformation("OAuth callback получен. Code: {Code}, State: {State}", code, state ?? "null");

    try
    {
        var baseUrl = _configuration["Application:BaseUrl"];
        var callbackUrl = $"{baseUrl}/api/auth/callback";
        
        var tokenResponse = await _oauthService.ExchangeCodeForTokenAsync(code, callbackUrl);
        
        var userInfo = await _oauthService.GetUserInfoAsync(tokenResponse.AccessToken);
        
        var existingUser = await _userManager.FindByEmailAsync(userInfo.OrgEmail);

        if (existingUser == null)
        {
            var appUser = new ApplicationUser
            {
                UserName = userInfo.OrgEmail,
                Email = userInfo.OrgEmail,
                EmailConfirmed = true,
                Name = userInfo.Name,
                Surname = userInfo.Surname,
                Patronymic = userInfo.Patronymic,
                OrgEmail = userInfo.OrgEmail,
                Position = userInfo.Position,
                SoloUserId = userInfo.UserId,
                IsActive = true,
                RoleId = 1
            };
            
            string temporaryPassword = GenerateRandomPassword();
            
            var result = await _userManager.CreateAsync(appUser, temporaryPassword);

            if (!result.Succeeded)
            {
                _logger.LogError("Ошибка при создании пользователя: {Errors}", 
                    string.Join(", ", result.Errors.Select(e => e.Description)));
                return BadRequest("Не удалось создать пользователя");
            }
            
            await _emailService.SendEmailAsync(userInfo.OrgEmail, temporaryPassword);
            _logger.LogInformation("Создан новый пользователь: {Email} c паролем {Password}", 
                userInfo.OrgEmail, temporaryPassword);
                
            existingUser = appUser;
        }
        
        await _signInManager.SignInAsync(existingUser,
            new AuthenticationProperties
            {
                IsPersistent = true,
                ExpiresUtc = DateTimeOffset.UtcNow.AddDays(30)
            });
        
        var identityToken = GenerateSecureToken();
        
        var expiresAt = DateTimeOffset.UtcNow.AddSeconds(
            tokenResponse.ExpiresIn > 0 
                ? tokenResponse.ExpiresIn 
                : 30 * 24 * 60 * 60);
        
        var oauthTokenInfo = new OAuthTokenInfo
        {
            AccessToken = tokenResponse.AccessToken,
            RefreshToken = tokenResponse.RefreshToken,
            TokenType = tokenResponse.TokenType,
            ExpiresIn = tokenResponse.ExpiresIn,
            Scope = tokenResponse.Scope
        };
        
        await _tokenStorageService.StoreTokensAsync(
            existingUser.Id, 
            identityToken, 
            oauthTokenInfo,
            new UserInfo
            {
                Id = existingUser.Id,
                Email = existingUser.OrgEmail,
                Name = existingUser.Name,
                Surname = existingUser.Surname,
                Patronymic = existingUser.Patronymic,
                Position = existingUser.Position,
                SoloUserId = existingUser.SoloUserId,
                RoleId = existingUser.RoleId
            }, 
            expiresAt);
        
        string redirectUrl = "/";
        if (!string.IsNullOrEmpty(state))
        {
            try
            {
                redirectUrl = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(state));
                _logger.LogInformation("Расшифрованный state параметр: {RedirectUrl}", redirectUrl);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Невозможно расшифровать state параметр: {State}", state);
            }
        }

        _logger.LogInformation("Перенаправление пользователя после успешной авторизации: {RedirectUrl}", redirectUrl);
        return Redirect(redirectUrl);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Ошибка при обработке OAuth callback");
        return BadRequest("Authentication failed");
    }
}


    /// <summary>
    /// Тестовый эндпоинт для проверки авторизации через OAuth
    /// </summary>
    [HttpGet("test")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> TestEndpoint()
    {
        if (User.Identity.IsAuthenticated)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!string.IsNullOrEmpty(userId))
            {
                var tokens = await _tokenStorageService.GetUserTokensAsync(userId);
                
                return Ok(new { 
                    Message = "Вы успешно аутентифицированы",
                    User = User.Identity.Name,
                    TokensCount = tokens.Count,
                    ActiveTokens = tokens.Where(t => t.ExpiresAt > DateTimeOffset.UtcNow).Count()
                });
            }
        }
        
        return Ok(new { Message = "OAuth тестовый эндпоинт. Вы не аутентифицированы." });
    }
    
    /// <summary>
    /// Аутентификация пользователя по email и паролю
    /// </summary>
    [HttpPost("email-login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var response = await _authService.LoginAsync(request);
            return Ok(response);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Ошибка аутентификации");
            return Unauthorized(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Ошибка аутентификации");
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при попытке аутентификации");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Произошла внутренняя ошибка сервера" });
        }
    }

    /// <summary>
    /// Выход из системы
    /// </summary>
    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Logout()
    {
        await _authService.LogoutAsync();
        return Ok(new { message = "Вы успешно вышли из системы" });
    }
    
    /// <summary>
    /// Получение информации о текущем пользователе и его токенах
    /// </summary>
    [HttpGet("current-user")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        
        var user = await _userService.GetUserByIdAsync(userId);
        if (user == null)
        {
            return Unauthorized();
        }
        
        var tokens = await _tokenStorageService.GetUserTokensAsync(userId);
        var activeTokens = tokens.Where(t => t.ExpiresAt > DateTimeOffset.UtcNow).ToList();
        
        return Ok(new {
            User = user,
            ActiveTokens = activeTokens.Count,
            LastLogin = activeTokens.OrderByDescending(t => t.CreatedAt).FirstOrDefault()?.CreatedAt
        });
    }
    
    /// <summary>
    /// Получение списка активных сессий пользователя
    /// </summary>
    [HttpGet("active-sessions")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetActiveSessions()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        
        var tokens = await _tokenStorageService.GetUserTokensAsync(userId);
        var activeSessions = tokens
            .Where(t => t.ExpiresAt > DateTimeOffset.UtcNow)
            .Select(t => new {
                TokenId = MaskToken(t.IdentityToken),
                AuthType = t.AuthType,
                CreatedAt = t.CreatedAt,
                ExpiresAt = t.ExpiresAt,
                IpAddress = t.IpAddress,
                UserAgent = t.UserAgent,
                IsCurrentSession = IsCurrentSession(t.IdentityToken)
            })
            .OrderByDescending(s => s.CreatedAt)
            .ToList();
        
        return Ok(activeSessions);
    }
    
    /// <summary>
    /// Удаление указанной сессии пользователя
    /// </summary>
    [HttpDelete("sessions/{tokenId}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> RevokeSession(string tokenId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        
        var tokens = await _tokenStorageService.GetUserTokensAsync(userId);
        var token = tokens.FirstOrDefault(t => t.IdentityToken.StartsWith(tokenId));
        
        if (token == null)
        {
            return NotFound();
        }
        
        await _tokenStorageService.RevokeTokenAsync(token.IdentityToken);
        
        if (token.OAuthTokens != null && !string.IsNullOrEmpty(token.OAuthTokens.AccessToken))
        {
            await _oauthService.RevokeTokenAsync(token.OAuthTokens.AccessToken);
        }
        
        return Ok(new { message = "Сессия успешно прекращена" });
    }
    
    /// <summary>
    /// Вспомогательный метод для генерации случайного пароля
    /// </summary>
    private string GenerateRandomPassword(int length = 12)
    {
        // const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+";
        // var random = new Random();
        // return new string(Enumerable.Repeat(chars, length)
        //     .Select(s => s[random.Next(s.Length)]).ToArray());
        return "test";
    }
    
    /// <summary>
    /// Вспомогательный метод для генерации защищенного токена
    /// </summary>
    private static string GenerateSecureToken()
    {
        var randomBytes = new byte[32]; // 256 бит
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomBytes);
        }
        return Convert.ToBase64String(randomBytes);
    }
    
    /// <summary>
    /// Вспомогательный метод для маскировки токена (показываем только первые и последние символы)
    /// </summary>
    private static string MaskToken(string token)
    {
        if (string.IsNullOrEmpty(token) || token.Length <= 8)
        {
            return token;
        }
        
        return token.Substring(0, 4) + "..." + token.Substring(token.Length - 4);
    }
    
    /// <summary>
    /// Проверяет, является ли токен текущей сессией пользователя
    /// </summary>
    private bool IsCurrentSession(string tokenId)
    {
        // здесь должна быть логика определения текущей сессии
        return false;
    }
}