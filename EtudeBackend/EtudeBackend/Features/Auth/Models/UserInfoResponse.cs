namespace EtudeBackend.Features.Auth.Models;

public class UserInfoResponse
{
    public string Email { get; set; }
    public string FullName { get; set; }
    public string[] Scopes { get; set; }
}