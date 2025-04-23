using System.Text;
using System.Text.Json;
using EtudeBackend.Features.Auth.Models;
using EtudeBackend.Shared.Exceptions;

namespace EtudeBackend.Features.Auth.Services;

public class OAuthService : IOAuthService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<OAuthService> _logger;

    public OAuthService(HttpClient httpClient, IConfiguration configuration, ILogger<OAuthService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
    }

    public string GetAuthorizationUrl(string redirectUri, string state = null)
    {
        var clientId = _configuration["OAuth:ClientId"];
        var baseUrl = _configuration["OAuth:AuthServerUrl"];

        var authUrl = $"{baseUrl}/oauth/authorize?";
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
        }

        return authUrl + string.Join("&", queryParams.Select(p => $"{p.Key}={Uri.EscapeDataString(p.Value)}"));
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
            var response = await _httpClient.PostAsync(tokenUrl, formContent);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Failed to exchange code for token. Status: {Status}, Response: {Response}",
                    response.StatusCode, errorContent);

                throw new ApiException("Failed to authenticate with OAuth server", (int)response.StatusCode);
            }

            var content = await response.Content.ReadAsStringAsync();
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
            // Очищаем заголовок авторизации после запроса
            _httpClient.DefaultRequestHeaders.Authorization = null;
        }
    }

    public async Task<bool> RevokeTokenAsync(string token)
    {
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
            _logger.LogError(ex, "Exception occurred while revoking token");
            return false;
        }
    }
}