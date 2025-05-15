using System.Text;
using System.Text.Json;
using EtudeBackend.Features.Auth.Models;
using EtudeBackend.Shared.Data;
using EtudeBackend.Shared.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace EtudeBackend.Features.Auth.Services;


public class OAuthService : IOAuthService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<OAuthService> _logger;
    private readonly ITokenStorageService _tokenStorageService;
    private readonly UserManager<ApplicationUser> _userManager;

    public OAuthService(
        HttpClient httpClient, 
        IConfiguration configuration, 
        ILogger<OAuthService> logger,
        ITokenStorageService tokenStorageService,
        UserManager<ApplicationUser> userManager)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
        _tokenStorageService = tokenStorageService;
        _userManager = userManager;
    }
    
    public string GetAuthorizationUrl(string redirectUri, string state = null)
    {
        var clientId = _configuration["OAuth:ClientId"];
        var baseUrl = _configuration["OAuth:AuthServerUrl"];
        
        var authUrl = $"{baseUrl}/oauth/authorize";
        
        var queryParams = new Dictionary<string, string>
        {
            ["response_type"] = "code",
            ["client_id"] = clientId,
            ["redirect_uri"] = redirectUri,
            ["scope"] = "profile documents"
        };
        
        if (!string.IsNullOrEmpty(state))
        {
            queryParams["state"] = state;
            _logger.LogInformation("Добавлен state параметр: {State}", state);
        }
        
        var queryString = string.Join("&", queryParams.Select(p => $"{p.Key}={Uri.EscapeDataString(p.Value)}"));
        var fullUrl = $"{authUrl}?{queryString}";
        
        _logger.LogInformation("Сформирован URL авторизации: {Url}", fullUrl);
        
        return fullUrl;
    }
    
    public async Task<TokenResponse> ExchangeCodeForTokenAsync(string code, string redirectUri)
    {
        var clientId = _configuration["OAuth:ClientId"];
        var clientSecret = _configuration["OAuth:ClientSecret"];
        var baseUrl = _configuration["OAuth:AuthServerUrl"];

        var tokenUrl = $"{baseUrl}/oauth/token";

        var formContent = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            ["grant_type"] = "authorization_code",
            ["client_id"] = clientId,
            ["client_secret"] = clientSecret,
            ["code"] = code,
            ["redirect_uri"] = redirectUri
        });

        try
        {
            _logger.LogInformation("Обмен кода авторизации на токены. Code: {Code}, RedirectUri: {RedirectUri}", 
                code, redirectUri);
                
            var response = await _httpClient.PostAsync(tokenUrl, formContent);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Failed to exchange code for token. Status: {Status}, Response: {Response}",
                    response.StatusCode, errorContent);

                throw new ApiException("Failed to authenticate with OAuth server", (int)response.StatusCode);
            }

            var content = await response.Content.ReadAsStringAsync();
            _logger.LogInformation("Получен ответ от сервера OAuth: {Response}", content);
            
            var tokenResponse = JsonSerializer.Deserialize<TokenResponse>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return tokenResponse;
        }
        catch (Exception ex) when (ex is not ApiException)
        {
            _logger.LogError(ex, "Exception occurred while exchanging code for token");
            throw new ApiException("Failed to authenticate with OAuth server", 500);
        }
    }
    
    public async Task<bool> ValidateTokenAsync(string token, string[] requiredScopes = null)
    {
        var tokenInfo = await _tokenStorageService.GetTokenByOAuthTokenAsync(token);
        if (tokenInfo != null)
        {
            if (tokenInfo.ExpiresAt > DateTimeOffset.UtcNow)
            {
                if (requiredScopes != null && requiredScopes.Length > 0 && tokenInfo.OAuthTokens != null)
                {
                    var tokenScopes = tokenInfo.OAuthTokens.Scope.Split(' ');
                    if (requiredScopes.All(scope => tokenScopes.Contains(scope)))
                    {
                        return true;
                    }
                    else
                    {
                        _logger.LogWarning("Токен не содержит необходимых scopes");
                        return false;
                    }
                }
                
                return true;
            }
            else
            {
                _logger.LogWarning("Токен истек");
                return false;
            }
        }
        
        var clientId = _configuration["OAuth:ClientId"];
        var clientSecret = _configuration["OAuth:ClientSecret"];
        var baseUrl = _configuration["OAuth:AuthServerUrl"];

        var validateUrl = $"{baseUrl}/api/token/validate";

        var formData = new Dictionary<string, string>
        {
            ["token"] = token
        };

        if (requiredScopes != null && requiredScopes.Length > 0)
        {
            formData["required_scopes"] = string.Join(",", requiredScopes);
        }

        var formContent = new FormUrlEncodedContent(formData);

        try
        {
            var response = await _httpClient.PostAsync(validateUrl, formContent);

            if (!response.IsSuccessStatusCode)
            {
                return false;
            }

            var content = await response.Content.ReadAsStringAsync();
            var validationResult = JsonSerializer.Deserialize<TokenValidationResult>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return validationResult?.Valid ?? false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception occurred while validating token");
            return false;
        }
    }
    
    public async Task<UserInfoResponse> GetUserInfoAsync(string accessToken)
    {
        var tokenInfo = await _tokenStorageService.GetTokenByOAuthTokenAsync(accessToken);
        if (tokenInfo != null && tokenInfo.UserInfo != null)
        {
            return new UserInfoResponse
            {
                UserId = tokenInfo.UserInfo.SoloUserId,
                Name = tokenInfo.UserInfo.Name,
                Surname = tokenInfo.UserInfo.Surname,
                Patronymic = tokenInfo.UserInfo.Patronymic,
                OrgEmail = tokenInfo.UserInfo.Email,
                Position = tokenInfo.UserInfo.Position
            };
        }
        
        var baseUrl = _configuration["OAuth:AuthServerUrl"];
        var userInfoUrl = $"{baseUrl}/api/user/me";

        _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

        try
        {
            var response = await _httpClient.GetAsync(userInfoUrl);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Failed to get user info. Status: {Status}, Response: {Response}",
                    response.StatusCode, errorContent);

                throw new ApiException("Failed to get user information", (int)response.StatusCode);
            }

            var content = await response.Content.ReadAsStringAsync();
            _logger.LogInformation(content);
            var userInfo = JsonSerializer.Deserialize<UserInfoResponse>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return userInfo;
        }
        catch (Exception ex) when (ex is not ApiException)
        {
            _logger.LogError(ex, "Exception occurred while getting user info");
            throw new ApiException("Failed to get user information", 500);
        }
        finally
        {
            _httpClient.DefaultRequestHeaders.Authorization = null;
        }
    }
    
    public async Task<bool> RevokeTokenAsync(string token)
    {
        var tokenInfo = await _tokenStorageService.GetTokenByOAuthTokenAsync(token);
        if (tokenInfo != null)
        {
            await _tokenStorageService.RevokeTokenAsync(tokenInfo.IdentityToken);
        }
        
        var clientId = _configuration["OAuth:ClientId"];
        var clientSecret = _configuration["OAuth:ClientSecret"];
        var baseUrl = _configuration["OAuth:AuthServerUrl"];

        var revokeUrl = $"{baseUrl}/oauth/revoke";

        var formContent = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            ["token"] = token,
            ["client_id"] = clientId,
            ["client_secret"] = clientSecret
        });

        try
        {
            var response = await _httpClient.PostAsync(revokeUrl, formContent);
            return response.IsSuccessStatusCode;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception occurred while revoking token on OAuth server");
            return tokenInfo != null;
        }
    }
}