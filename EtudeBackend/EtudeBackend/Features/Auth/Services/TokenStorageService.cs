using System.Text.Json;
using EtudeBackend.Features.Auth.Models;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;

namespace EtudeBackend.Features.Auth.Services;

/// <summary>
/// Реализация сервиса для хранения и управления токенами в Redis
/// </summary>
public class TokenStorageService : ITokenStorageService
{
    private readonly IDistributedCache _cache;
    private readonly ILogger<TokenStorageService> _logger;
    private readonly IHttpContextAccessor _httpContextAccessor;
    
    private const string IdTokenPrefix = "auth:identity:";
    private const string OAuthTokenPrefix = "auth:oauth:";
    private const string UserTokensPrefix = "auth:user:";
    
    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = false
    };

    public TokenStorageService(
        IDistributedCache cache, 
        ILogger<TokenStorageService> logger,
        IHttpContextAccessor httpContextAccessor)
    {
        _cache = cache;
        _logger = logger;
        _httpContextAccessor = httpContextAccessor;
    }

    /// <inheritdoc />
    public async Task StoreTokensAsync(
        string userId, 
        string identityToken, 
        OAuthTokenInfo? oauthTokens, 
        UserInfo userInfo, 
        DateTimeOffset expiresAt)
    {
        try
        {
            var tokenInfo = new TokenInfo
            {
                UserId = userId,
                IdentityToken = identityToken,
                OAuthTokens = oauthTokens,
                UserInfo = userInfo,
                CreatedAt = DateTimeOffset.UtcNow,
                ExpiresAt = expiresAt,
                AuthType = oauthTokens != null ? "OAuth" : "Password",
                IpAddress = GetClientIpAddress(),
                UserAgent = GetUserAgent()
            };
            
            var tokenJson = JsonSerializer.Serialize(tokenInfo, _jsonOptions);
            
            var expiration = expiresAt - DateTimeOffset.UtcNow;
            var cacheOptions = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = expiration > TimeSpan.Zero 
                    ? expiration 
                    : TimeSpan.FromDays(30)
            };
            
            await _cache.SetStringAsync(
                IdTokenPrefix + identityToken, 
                tokenJson, 
                cacheOptions);
            
            if (oauthTokens != null && !string.IsNullOrEmpty(oauthTokens.AccessToken))
            {
                await _cache.SetStringAsync(
                    OAuthTokenPrefix + oauthTokens.AccessToken, 
                    identityToken, 
                    cacheOptions);
            }
            
            await AddTokenToUserList(userId, identityToken, cacheOptions);
            
            _logger.LogInformation("Токен для пользователя {UserId} успешно сохранен в Redis", userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при сохранении токена для пользователя {UserId} в Redis", userId);
            throw;
        }
    }

    /// <inheritdoc />
    public async Task<TokenInfo?> GetTokenByIdentityTokenAsync(string identityToken)
    {
        try
        {
            var tokenJson = await _cache.GetStringAsync(IdTokenPrefix + identityToken);
            if (string.IsNullOrEmpty(tokenJson))
            {
                return null;
            }

            return JsonSerializer.Deserialize<TokenInfo>(tokenJson, _jsonOptions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении токена по Identity токену из Redis");
            return null;
        }
    }

    /// <inheritdoc />
    public async Task<TokenInfo?> GetTokenByOAuthTokenAsync(string oauthToken)
    {
        try
        {
            var identityToken = await _cache.GetStringAsync(OAuthTokenPrefix + oauthToken);
            if (string.IsNullOrEmpty(identityToken))
            {
                return null;
            }
            
            return await GetTokenByIdentityTokenAsync(identityToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении токена по OAuth токену из Redis");
            return null;
        }
    }

    /// <inheritdoc />
    public async Task<List<TokenInfo>> GetUserTokensAsync(string userId)
    {
        try
        {
            var userTokensJson = await _cache.GetStringAsync(UserTokensPrefix + userId);
            if (string.IsNullOrEmpty(userTokensJson))
            {
                return new List<TokenInfo>();
            }

            var tokenIds = JsonSerializer.Deserialize<List<string>>(userTokensJson, _jsonOptions);
            if (tokenIds == null || tokenIds.Count == 0)
            {
                return new List<TokenInfo>();
            }

            var tokens = new List<TokenInfo>();
            foreach (var tokenId in tokenIds)
            {
                var token = await GetTokenByIdentityTokenAsync(tokenId);
                if (token != null)
                {
                    tokens.Add(token);
                }
            }

            return tokens;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении списка токенов пользователя {UserId} из Redis", userId);
            return new List<TokenInfo>();
        }
    }

    /// <inheritdoc />
    public async Task RevokeTokenAsync(string identityToken)
    {
        try
        {
            var token = await GetTokenByIdentityTokenAsync(identityToken);
            if (token == null)
            {
                _logger.LogWarning("Попытка отозвать несуществующий токен");
                return;
            }
            
            if (token.OAuthTokens != null && !string.IsNullOrEmpty(token.OAuthTokens.AccessToken))
            {
                await _cache.RemoveAsync(OAuthTokenPrefix + token.OAuthTokens.AccessToken);
            }
            
            await _cache.RemoveAsync(IdTokenPrefix + identityToken);

            await RemoveTokenFromUserList(token.UserId, identityToken);
            
            _logger.LogInformation("Токен {TokenId} для пользователя {UserId} успешно отозван", 
                identityToken, token.UserId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при отзыве токена {TokenId} из Redis", identityToken);
        }
    }

    /// <inheritdoc />
    public async Task RevokeAllUserTokensAsync(string userId)
    {
        try
        {
            var tokens = await GetUserTokensAsync(userId);
            
            foreach (var token in tokens)
            {
                if (token.OAuthTokens != null && !string.IsNullOrEmpty(token.OAuthTokens.AccessToken))
                {
                    await _cache.RemoveAsync(OAuthTokenPrefix + token.OAuthTokens.AccessToken);
                }
                
                await _cache.RemoveAsync(IdTokenPrefix + token.IdentityToken);
            }
            
            await _cache.RemoveAsync(UserTokensPrefix + userId);
            
            _logger.LogInformation("Все токены пользователя {UserId} успешно отозваны", userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при отзыве всех токенов пользователя {UserId} из Redis", userId);
        }
    }

    #region Вспомогательные методы

    /// <summary>
    /// Добавляет токен в список токенов пользователя
    /// </summary>
    private async Task AddTokenToUserList(string userId, string tokenId, DistributedCacheEntryOptions options)
    {
        var userTokensJson = await _cache.GetStringAsync(UserTokensPrefix + userId);
        List<string> tokenIds;

        if (string.IsNullOrEmpty(userTokensJson))
        {
            tokenIds = new List<string>();
        }
        else
        {
            tokenIds = JsonSerializer.Deserialize<List<string>>(userTokensJson, _jsonOptions) ?? new List<string>();
        }

        if (!tokenIds.Contains(tokenId))
        {
            tokenIds.Add(tokenId);
            await _cache.SetStringAsync(
                UserTokensPrefix + userId,
                JsonSerializer.Serialize(tokenIds, _jsonOptions),
                options);
        }
    }

    /// <summary>
    /// Удаляет токен из списка токенов пользователя
    /// </summary>
    private async Task RemoveTokenFromUserList(string userId, string tokenId)
    {
        var userTokensJson = await _cache.GetStringAsync(UserTokensPrefix + userId);
        if (string.IsNullOrEmpty(userTokensJson))
        {
            return;
        }

        var tokenIds = JsonSerializer.Deserialize<List<string>>(userTokensJson, _jsonOptions);
        if (tokenIds == null || !tokenIds.Contains(tokenId))
        {
            return;
        }

        tokenIds.Remove(tokenId);
        
        if (tokenIds.Count > 0)
        {
            await _cache.SetStringAsync(
                UserTokensPrefix + userId,
                JsonSerializer.Serialize(tokenIds, _jsonOptions),
                new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(90) // Храним список 90 дней
                });
        }
        else
        {
            await _cache.RemoveAsync(UserTokensPrefix + userId);
        }
    }

    /// <summary>
    /// Получает IP-адрес клиента
    /// </summary>
    private string GetClientIpAddress()
    {
        if (_httpContextAccessor.HttpContext == null)
        {
            return "unknown";
        }
        
        var forwardedHeader = _httpContextAccessor.HttpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault();
        
        if (!string.IsNullOrEmpty(forwardedHeader))
        {
            var ips = forwardedHeader.Split(',', StringSplitOptions.RemoveEmptyEntries);
            if (ips.Length > 0)
            {
                return ips[0].Trim();
            }
        }
        
        var remoteIp = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress;
        return remoteIp?.ToString() ?? "unknown";
    }

    /// <summary>
    /// Получает User-Agent клиента
    /// </summary>
    private string GetUserAgent()
    {
        if (_httpContextAccessor.HttpContext == null)
        {
            return "unknown";
        }

        return _httpContextAccessor.HttpContext.Request.Headers["User-Agent"].ToString();
    }

    #endregion
}