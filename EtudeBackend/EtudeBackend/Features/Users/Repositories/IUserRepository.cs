using EtudeBackend.Features.Users.Entities;
using EtudeBackend.Shared.Data.Repositories;

namespace EtudeBackend.Features.Users.Repositories;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByUserIdAsync(int userId);
    Task<List<User>> GetByRoleAsync(int roleId);
    Task<List<User>> GetByIds(IEnumerable<int> ids);
    Task<bool> IsActiveAsync(int userId);
}