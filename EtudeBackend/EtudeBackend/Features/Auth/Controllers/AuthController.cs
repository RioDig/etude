using System.Net;
using System.Net.Mail;
using EtudeBackend.Features.Auth.Models;
using EtudeBackend.Features.Auth.Services;
using EtudeBackend.Features.Users.Services;
using EtudeBackend.Shared.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using EtudeBackend.Features.Auth.Models;

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

    public AuthController(
        IOAuthService oauthService,
        IUserService userService,
        IConfiguration configuration,
        ILogger<AuthController> logger,
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IEmailService emailService,
        IAuthService authService)
    {
        _oauthService = oauthService;
        _userService = userService;
        _configuration = configuration;
        _logger = logger;
        _userManager = userManager;
        _signInManager = signInManager;
        _emailService = emailService;
        _authService = authService;
    }

    /// <summary>
    /// Перенаправляет пользователя на страницу аутентификации OAuth
    /// </summary>
    [HttpGet("login")]
    [ProducesResponseType(StatusCodes.Status302Found)]
    public IActionResult Login([FromQuery] string? redirectAfterLogin)
    {
        // Сохраняем URL для возврата после авторизации
        var state = !string.IsNullOrEmpty(redirectAfterLogin)
            ? Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(redirectAfterLogin))
            : null;

        // Формируем URL для callback
        var baseUrl = _configuration["Application:BaseUrl"];
        var callbackUrl = $"{baseUrl}/api/auth/callback";

        // Получаем URL авторизации и перенаправляем пользователя
        var authUrl = _oauthService.GetAuthorizationUrl(callbackUrl, state);
        return Redirect(authUrl);
    }

    /// <summary>
    /// Обрабатывает callback от сервера OAuth после успешной авторизации
    /// </summary>
    [HttpGet("callback")]
    [ProducesResponseType(StatusCodes.Status302Found)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Callback([FromQuery] string code, [FromQuery] string state)
{
    if (string.IsNullOrEmpty(code))
    {
        return BadRequest("Authorization code is missing");
    }

    try
    {
        // Получаем URL для callback
        var baseUrl = _configuration["Application:BaseUrl"];
        var callbackUrl = $"{baseUrl}/api/auth/callback";

        // Обмениваем код на токены
        var tokenResponse = await _oauthService.ExchangeCodeForTokenAsync(code, callbackUrl);

        // Получаем информацию о пользователе
        var userInfo = await _oauthService.GetUserInfoAsync(tokenResponse.AccessToken);

        // Проверяем, существует ли пользователь в нашей системе
        var user = await _userService.GetUserByEmailAsync(userInfo.OrgEmail);

        if (user == null)
        {
            // Создаем нового пользователя
            var appUser = new ApplicationUser
            {
                UserName = userInfo.OrgEmail, // Обязательное поле для IdentityUser
                Email = userInfo.OrgEmail,    // Обязательное поле для IdentityUser
                EmailConfirmed = true,        // Подтверждаем email сразу
                Name = userInfo.Name,
                Surname = userInfo.Surname,
                Patronymic = userInfo.Patronymic,
                OrgEmail = userInfo.OrgEmail,
                Position = userInfo.Position,
                SoloUserId = userInfo.UserId,
                IsActive = true
            };

            // Генерируем случайный пароль для нового пользователя
            string temporaryPassword = GenerateRandomPassword();

            // Создаем пользователя и обрабатываем результат
            var result = await _userManager.CreateAsync(appUser, temporaryPassword);

            if (!result.Succeeded)
            {
                _logger.LogError("Ошибка при создании пользователя: {Errors}", 
                    string.Join(", ", result.Errors.Select(e => e.Description)));
                return BadRequest("Не удалось создать пользователя");
            }
            
            // Здесь можно отправить email с временным паролем или инструкциями по его смене
            await _emailService.SendEmailAsync(userInfo.OrgEmail, temporaryPassword);
            _logger.LogInformation("Создан новый пользователь: {Email} c паролем {Password}", userInfo.OrgEmail, temporaryPassword);
        }

        // Находим пользователя для аутентификации
        var userToLogin = await _userManager.FindByEmailAsync(userInfo.OrgEmail);
        if (userToLogin == null)
        {
            _logger.LogError("Пользователь не найден после регистрации: {Email}", userInfo.OrgEmail);
            return BadRequest("Ошибка авторизации");
        }

        // Выполняем вход пользователя
        await _signInManager.SignInAsync(userToLogin,
            new AuthenticationProperties
            {
                IsPersistent = true,
                ExpiresUtc = DateTimeOffset.UtcNow.AddDays(30)
            });

        // Перенаправляем пользователя на исходную страницу, если она была указана
        string redirectUrl = "/";
        if (!string.IsNullOrEmpty(state))
        {
            try
            {
                redirectUrl = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(state));
            }
            catch
            {
                _logger.LogWarning("Invalid state parameter: {State}", state);
            }
        }

        return Redirect(redirectUrl);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error during OAuth callback processing");
        return BadRequest("Authentication failed");
    }
}

// Вспомогательный метод для генерации случайного пароля
private string GenerateRandomPassword(int length = 12)
{
    const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+";
    var random = new Random();
    return new string(Enumerable.Repeat(chars, length)
        .Select(s => s[random.Next(s.Length)]).ToArray());
}

    /// <summary>
    /// Тестовый эндпоинт для проверки авторизации через OAuth
    /// </summary>
    [HttpGet("test")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> TestEndpoint()
    {
        return Ok(new { Message = "OAuth integration is working! You can use this endpoint from your React application." });
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
    
}

