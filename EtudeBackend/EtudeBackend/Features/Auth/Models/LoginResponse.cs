namespace EtudeBackend.Features.Auth.Models;

public class LoginResponse
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string? Patronymic { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public bool IsAuthenticated { get; set; }
    public string AuthenticationType { get; set; } = string.Empty;
    public DateTimeOffset? ExpiresAt { get; set; }
}