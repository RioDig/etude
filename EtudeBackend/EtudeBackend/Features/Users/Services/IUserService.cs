using EtudeBackend.Features.Users.DTOs;

namespace EtudeBackend.Features.Users.Services;

public interface IUserService
{
    Task<List<UserDto>> GetAllUsersAsync();
    Task<UserDto?> GetUserByIdAsync(string id);
    Task<UserDto?> GetUserByEmailAsync(string email);
    Task<(List<EmployeeDto> employees, bool hasMoreItems)> GetAutocompleteEmployeesAsync(string? term, string[]? idsToRemove = null);
}