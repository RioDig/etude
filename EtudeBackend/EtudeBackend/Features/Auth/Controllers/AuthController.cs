using EtudeBackend.Features.Auth.Models;
using EtudeBackend.Features.Auth.Services;
using EtudeBackend.Features.Users.Services;
using EtudeBackend.Shared.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

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

    public AuthController(
        IOAuthService oauthService,
        IUserService userService,
        IConfiguration configuration,
        ILogger<AuthController> logger,
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager)
    {
        _oauthService = oauthService;
        _userService = userService;
        _configuration = configuration;
        _logger = logger;
        _userManager = userManager;
        _signInManager = signInManager;
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
                // TODO: Создание пользователя, если его нет в системе
                // В реальном приложении здесь может быть логика регистрации нового пользователя
                // или другая обработка
                // return BadRequest("User not found in system");
                await _userManager.CreateAsync(new ApplicationUser()
                {
                    Name = userInfo.Name, Surname = userInfo.Surname,
                    Patronymic = userInfo.Patronymic, OrgEmail = userInfo.OrgEmail, Position = userInfo.Position,
                    SoloUserId = userInfo.UserId, IsActive = true
                });
            }

            // Сохраняем токены в сессии или cookies для дальнейшего использования
            // В реальном приложении здесь была бы логика сохранения токенов
            // и выдачи внутреннего токена авторизации
            
            var usr = await _userManager.FindByEmailAsync(userInfo.OrgEmail);
            // TODO что сохранить в Items? code или state?

            if (usr != null)
                await _signInManager.SignInAsync(usr,
                    new AuthenticationProperties(new Dictionary<string, string>() { { usr.Id.ToString(), code } }!)
                    {
                        AllowRefresh = true,
                        ExpiresUtc = DateTimeOffset.FromUnixTimeSeconds(53000),
                        IsPersistent = true
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

    /// <summary>
    /// Тестовый эндпоинт для проверки авторизации через OAuth
    /// </summary>
    [HttpGet("test")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult TestEndpoint()
    {
        return Ok(new { Message = "OAuth integration is working! You can use this endpoint from your React application." });
    }
}