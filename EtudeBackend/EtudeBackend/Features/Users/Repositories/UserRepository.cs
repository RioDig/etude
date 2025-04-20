using EtudeBackend.Features.Users.Entities;
using EtudeBackend.Shared.Data;
using EtudeBackend.Shared.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace EtudeBackend.Features.Users.Repositories;

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _dbSet
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.OrgEmail == email);
    }

    public async Task<User?> GetByUserIdAsync(int userId)
    {
        return await _dbSet
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Id == userId);
    }

    public async Task<List<User>> GetByRoleAsync(int roleId)
    {
        return await _dbSet
            .Where(u => u.RoleId == roleId)
            .OrderBy(u => u.Surname)
            .ThenBy(u => u.Name)
            .ToListAsync();
    }

    public async Task<List<User>> GetByIds(IEnumerable<int> ids)
    {
        return await _dbSet
            .Where(u => ids.Contains(u.Id))
            .ToListAsync();
    }

    public async Task<bool> IsActiveAsync(int userId)
    {
        var user = await _dbSet
            .FirstOrDefaultAsync(u => u.Id == userId);
        return user?.IsActive ?? false;
    }
}