using EtudeBackend.Features.Auth.Models;
using EtudeBackend.Features.Auth.Services;
using EtudeBackend.Features.Users.Services;
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

    public AuthController(
        IOAuthService oauthService,
        IUserService userService,
        IConfiguration configuration,
        ILogger<AuthController> logger)
    {
        _oauthService = oauthService;
        _userService = userService;
        _configuration = configuration;
        _logger = logger;
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
            var user = await _userService.GetUserByEmailAsync(userInfo.Email);

            if (user == null)
            {
                // TODO: Создание пользователя, если его нет в системе
                // В реальном приложении здесь может быть логика регистрации нового пользователя
                // или другая обработка
                return BadRequest("User not found in system");
            }

            // Сохраняем токены в сессии или cookies для дальнейшего использования
            // В реальном приложении здесь была бы логика сохранения токенов
            // и выдачи внутреннего токена авторизации

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