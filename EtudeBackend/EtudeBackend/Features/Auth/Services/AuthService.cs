﻿using System.Security.Claims;
using System.Security.Cryptography;
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
    private readonly ITokenStorageService _tokenStorageService;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IHttpContextAccessor httpContextAccessor,
        ILogger<AuthService> logger,
        ITokenStorageService tokenStorageService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _httpContextAccessor = httpContextAccessor;
        _logger = logger;
        _tokenStorageService = tokenStorageService;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            _logger.LogWarning("Неудачная попытка входа: пользователь с email {Email} не найден", request.Email);
            throw new ArgumentException("Неверный email или пароль");
        }

        if (!user.IsActive)
        {
            _logger.LogWarning("Попытка входа в деактивированный аккаунт: {Email}", request.Email);
            throw new InvalidOperationException("Аккаунт деактивирован");
        }

        var signInResult = await _signInManager.PasswordSignInAsync(user, request.Password, request.RememberMe, false);
        if (!signInResult.Succeeded)
        {
            _logger.LogWarning("Неудачная попытка входа для пользователя: {Email}", request.Email);
            throw new ArgumentException("Неверный email или пароль");
        }

        _logger.LogInformation("Пользователь {Email} успешно авторизован", request.Email);

        var identityToken = GenerateSecureToken();

        var httpContext = _httpContextAccessor.HttpContext;
        var authProperties = await httpContext.AuthenticateAsync();
        var expiresAt = authProperties?.Properties?.ExpiresUtc ?? DateTimeOffset.UtcNow.AddDays(30);

        await _tokenStorageService.StoreTokensAsync(
            user.Id,
            identityToken,
            null,
            new UserInfo
            {
                Id = user.Id,
                Email = user.OrgEmail,
                Name = user.Name,
                Surname = user.Surname,
                Patronymic = user.Patronymic,
                Position = user.Position,
                SoloUserId = user.SoloUserId,
                RoleId = user.RoleId
            },
            expiresAt);

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
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext != null)
        {
            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!string.IsNullOrEmpty(userId))
            {
                await _tokenStorageService.RevokeAllUserTokensAsync(userId);
            }
        }

        await _signInManager.SignOutAsync();
        _logger.LogInformation("Пользователь вышел из системы");
    }

    /// <summary>
    /// Генерирует случайный защищенный токен
    /// </summary>
    private static string GenerateSecureToken()
    {
        var randomBytes = new byte[32];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomBytes);
        }
        return Convert.ToBase64String(randomBytes);
    }
}