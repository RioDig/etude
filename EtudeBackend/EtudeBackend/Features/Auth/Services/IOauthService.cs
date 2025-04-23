using EtudeBackend.Features.Auth.Models;

namespace EtudeBackend.Features.Auth.Services;

public interface IOAuthService
{
    /// <summary>
    /// Формирует URL для авторизации пользователя
    /// </summary>
    /// <param name="redirectUri">URI для перенаправления после авторизации</param>
    /// <param name="state">Опциональный параметр состояния</param>
    /// <returns>URL для авторизации</returns>
    string GetAuthorizationUrl(string redirectUri, string state = null);

    /// <summary>
    /// Обменивает код авторизации на токены доступа
    /// </summary>
    /// <param name="code">Код авторизации</param>
    /// <param name="redirectUri">URI для перенаправления</param>
    /// <returns>Токены доступа</returns>
    Task<TokenResponse> ExchangeCodeForTokenAsync(string code, string redirectUri);

    /// <summary>
    /// Проверяет валидность токена
    /// </summary>
    /// <param name="token">Токен доступа</param>
    /// <param name="requiredScopes">Требуемые области доступа</param>
    /// <returns>Результат проверки</returns>
    Task<bool> ValidateTokenAsync(string token, string[] requiredScopes = null);

    /// <summary>
    /// Получает информацию о пользователе
    /// </summary>
    /// <param name="accessToken">Токен доступа</param>
    /// <returns>Информация о пользователе</returns>
    Task<UserInfoResponse> GetUserInfoAsync(string accessToken);

    /// <summary>
    /// Отзывает токен
    /// </summary>
    /// <param name="token">Токен для отзыва</param>
    /// <returns>Результат операции</returns>
    Task<bool> RevokeTokenAsync(string token);
}