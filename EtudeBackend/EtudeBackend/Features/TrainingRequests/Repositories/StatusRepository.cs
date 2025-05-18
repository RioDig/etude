using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Shared.Data;
using EtudeBackend.Shared.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace EtudeBackend.Features.TrainingRequests.Repositories;

public class StatusRepository : Repository<Status>, IStatusRepository
{
    public StatusRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Status?> GetByNameAsync(string name)
    {
        return await _dbSet
            .FirstOrDefaultAsync(s => s.Name == name);
    }

    public async Task<Status?> GetByTypeAsync(string type)
    {
        return await _dbSet.FirstOrDefaultAsync(s => s.Type == type);
    }

    public async Task<List<Status>> GetProtectedStatusesAsync()
    {
        return await _dbSet
            .Where(s => s.IsProtected)
            .ToListAsync();
    }

    public async Task<List<Status>> GetTerminalStatusesAsync()
    {
        return await _dbSet
            .Where(s => s.IsTerminal)
            .ToListAsync();
    }
}