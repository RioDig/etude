using System.Text.Json.Serialization;

namespace EtudeBackend.Features.Auth.Models;

public class UserInfoResponse
{
    [JsonPropertyName("id")]
    public int UserId { get; set; }
    [JsonPropertyName("Name")]
    public string Name { get; set; }
    [JsonPropertyName("Surname")]
    public string Surname { get; set; }
    [JsonPropertyName("Patronymic")]
    public string Patronymic { get; set; }
    [JsonPropertyName("OrgEmail")]
    public string OrgEmail { get; set; }
    [JsonPropertyName("Position")]
    public string Position { get; set; }
    
}