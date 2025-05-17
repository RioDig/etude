using System.Text.Json.Serialization;

namespace EtudeBackend.Features.Auth.Models;

public class UserInfoResponse
{
    [JsonPropertyName("id")]
    public string UserId { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("surname")]
    public string Surname { get; set; }

    [JsonPropertyName("patronymic")]
    public string? Patronymic { get; set; }

    [JsonPropertyName("org_email")]
    public string OrgEmail { get; set; }

    [JsonPropertyName("position")]
    public string Position { get; set; }
}