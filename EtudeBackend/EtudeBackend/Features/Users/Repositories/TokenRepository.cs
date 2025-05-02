using System.Linq;
using System.Threading.Tasks;
using EtudeBackend.Features.Users.Entities;
using EtudeBackend.Shared.Data;
using EtudeBackend.Shared.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace EtudeBackend.Features.Users.Repositories
{
    public class TokenRepository : Repository<Token>, ITokenRepository
    {
        public TokenRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Token?> GetByEludeTokenAsync(string eludeToken)
        {
            return await _dbSet
                .FirstOrDefaultAsync(t => t.Etude_Token == eludeToken && t.IsActive);
        }

        public async Task<Token?> GetBySoloTokenAsync(string soloToken)
        {
            return await _dbSet
                .FirstOrDefaultAsync(t => t.Solo_Token == soloToken && t.IsActive);
        }

        public async Task<List<Token>> GetByUserIdAsync(string userId)
        {
            return await _dbSet
                .Where(t => t.UserId == userId && t.IsActive)
                .ToListAsync();
        }

        public async Task<List<Token>> GetActiveTokensAsync()
        {
            return await _dbSet
                .Where(t => t.IsActive && t.ExpiresAt > DateTimeOffset.UtcNow)
                .ToListAsync();
        }
    }
}