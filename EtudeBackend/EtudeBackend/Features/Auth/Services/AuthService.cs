using System.Security.Claims;
using EtudeBackend.Features.Auth.Models;
using EtudeBackend.Shared.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;

namespace EtudeBackend.Features.Auth.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IHttpContextAccessor httpContextAccessor,
        ILogger<AuthService> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _httpContextAccessor = httpContextAccessor;
        _logger = logger;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        // Проверяем существование пользователя
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            _logger.LogWarning("Неудачная попытка входа: пользователь с email {Email} не найден", request.Email);
            throw new ArgumentException("Неверный email или пароль");
        }

        // Проверяем активность аккаунта
        if (!user.IsActive)
        {
            _logger.LogWarning("Попытка входа в деактивированный аккаунт: {Email}", request.Email);
            throw new InvalidOperationException("Аккаунт деактивирован");
        }

        // Проверяем пароль
        var signInResult = await _signInManager.PasswordSignInAsync(user, request.Password, request.RememberMe, false);
        if (!signInResult.Succeeded)
        {
            _logger.LogWarning("Неудачная попытка входа для пользователя: {Email}", request.Email);
            throw new ArgumentException("Неверный email или пароль");
        }

        _logger.LogInformation("Пользователь {Email} успешно авторизован", request.Email);

        // Находим срок действия куки аутентификации
        var httpContext = _httpContextAccessor.HttpContext;
        var authProperties = await httpContext.AuthenticateAsync();
        var expiresAt = authProperties?.Properties?.ExpiresUtc;

        // Возвращаем информацию о пользователе
        return new LoginResponse
        {
            Id = user.Id,
            Name = user.Name,
            Surname = user.Surname,
            Patronymic = user.Patronymic,
            Email = user.OrgEmail,
            Position = user.Position,
            IsAuthenticated = true,
            AuthenticationType = "Cookie",
            ExpiresAt = expiresAt
        };
    }

    public async Task LogoutAsync()
    {
        await _signInManager.SignOutAsync();
        _logger.LogInformation("Пользователь вышел из системы");
    }
}