using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Shared.Data.Repositories;

namespace EtudeBackend.Features.TrainingRequests.Repositories;

public interface IStatusRepository : IRepository<Status>
{
    Task<Status?> GetByNameAsync(string name);
    Task<List<Status>> GetProtectedStatusesAsync();
    Task<List<Status>> GetTerminalStatusesAsync();
}