namespace EtudeBackend.Features.Auth.Models;

public class TokenValidationResult
{
    public bool Valid { get; set; }
    public string Reason { get; set; }
    public UserInfo User { get; set; }
    public string[] Scopes { get; set; }
    public long? ExpiresAt { get; set; }
}

public partial class UserInfo
{
    public string Email { get; set; }
    public string FullName { get; set; }
}