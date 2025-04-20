using EtudeBackend.Features.Users.DTOs;

namespace EtudeBackend.Features.Users.Services;

public interface IUserService
{
    Task<List<UserDto>> GetAllUsersAsync();
    Task<UserDto?> GetUserByIdAsync(int id);
    Task<UserDto?> GetUserByEmailAsync(string email);
}