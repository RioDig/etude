using System.Text.Json.Serialization;

namespace EtudeBackend.Features.Auth.Models;

public class UserInfoResponse
{
    [JsonPropertyName("email")]
    public string Email { get; set; }

    [JsonPropertyName("full_name")]
    public string FullName { get; set; }

    [JsonPropertyName("scopes")]
    public string[] Scopes { get; set; }
}