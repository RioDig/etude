using EtudeBackend.Features.Auth.Models;

namespace EtudeBackend.Features.Auth.Services;

/// <summary>
/// Сервис для хранения и управления токенами в Redis
/// </summary>
public interface ITokenStorageService
{
    /// <summary>
    /// Сохраняет информацию о токене в Redis
    /// </summary>
    /// <param name="userId">ID пользователя</param>
    /// <param name="identityToken">Токен ASP.NET Core Identity</param>
    /// <param name="oauthTokens">Токены OAuth (если есть)</param>
    /// <param name="userInfo">Информация о пользователе</param>
    /// <param name="expiresAt">Время истечения токена</param>
    Task StoreTokensAsync(string userId, string identityToken, OAuthTokenInfo? oauthTokens, UserInfo userInfo, DateTimeOffset expiresAt);
    
    /// <summary>
    /// Получает информацию о токене по идентификатору токена ASP.NET Identity
    /// </summary>
    Task<TokenInfo?> GetTokenByIdentityTokenAsync(string identityToken);
    
    /// <summary>
    /// Получает информацию о токене по идентификатору токена OAuth
    /// </summary>
    Task<TokenInfo?> GetTokenByOAuthTokenAsync(string oauthToken);
    
    /// <summary>
    /// Получает все активные токены пользователя
    /// </summary>
    Task<List<TokenInfo>> GetUserTokensAsync(string userId);
    
    /// <summary>
    /// Удаляет токен из хранилища
    /// </summary>
    Task RevokeTokenAsync(string identityToken);
    
    /// <summary>
    /// Удаляет все токены пользователя
    /// </summary>
    Task RevokeAllUserTokensAsync(string userId);
}