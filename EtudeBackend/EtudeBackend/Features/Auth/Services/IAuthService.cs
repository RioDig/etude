using EtudeBackend.Features.Auth.Models;

namespace EtudeBackend.Features.Auth.Services;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request);
    Task LogoutAsync();
}