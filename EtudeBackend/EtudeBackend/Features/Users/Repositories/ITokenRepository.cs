using EtudeBackend.Features.Users.Entities;
using EtudeBackend.Shared.Data.Repositories;

namespace EtudeBackend.Features.Users.Repositories
{
    public interface ITokenRepository : IRepository<Token>
    {
        Task<Token?> GetByEludeTokenAsync(string eludeToken);
        Task<Token?> GetBySoloTokenAsync(string soloToken);
        Task<List<Token>> GetByUserIdAsync(string userId);
        Task<List<Token>> GetActiveTokensAsync();
    }
}