using System.Text.Json.Serialization;

namespace EtudeBackend.Features.Auth.Models;

/// <summary>
/// Информация о пользователе для хранения в токене
/// </summary>
public partial class UserInfo
{
    public string Id { get; set; } = string.Empty;
    public string OrgEmail { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string? Patronymic { get; set; }
    public string Position { get; set; } = string.Empty;
    public int? SoloUserId { get; set; }
    public int RoleId { get; set; }
}

/// <summary>
/// Информация о токенах OAuth
/// </summary>
public class OAuthTokenInfo
{
    [JsonPropertyName("access_token")]
    public string AccessToken { get; set; } = string.Empty;
    
    [JsonPropertyName("refresh_token")] 
    public string RefreshToken { get; set; } = string.Empty;
    
    [JsonPropertyName("token_type")]
    public string TokenType { get; set; } = string.Empty;
    
    [JsonPropertyName("expires_in")]
    public int ExpiresIn { get; set; }
    
    [JsonPropertyName("scope")]
    public string Scope { get; set; } = string.Empty;
}

/// <summary>
/// Полная информация о токене для хранения в Redis
/// </summary>
public class TokenInfo
{
    /// <summary>
    /// ID пользователя
    /// </summary>
    public string UserId { get; set; } = string.Empty;
    
    /// <summary>
    /// Токен ASP.NET Core Identity
    /// </summary>
    public string IdentityToken { get; set; } = string.Empty;
    
    /// <summary>
    /// Токены OAuth (если аутентификация через OAuth)
    /// </summary>
    public OAuthTokenInfo? OAuthTokens { get; set; }
    
    /// <summary>
    /// Информация о пользователе
    /// </summary>
    public UserInfo UserInfo { get; set; } = new();
    
    /// <summary>
    /// Дата и время создания токена
    /// </summary>
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    
    /// <summary>
    /// Дата и время истечения токена
    /// </summary>
    public DateTimeOffset ExpiresAt { get; set; }
    
    /// <summary>
    /// IP-адрес, с которого была выполнена аутентификация
    /// </summary>
    public string IpAddress { get; set; } = string.Empty;
    
    /// <summary>
    /// Тип аутентификации (OAuth, Email+Password, и т.д.)
    /// </summary>
    public string AuthType { get; set; } = string.Empty;
    
    /// <summary>
    /// Устройство пользователя (User-Agent)
    /// </summary>
    public string UserAgent { get; set; } = string.Empty;
}