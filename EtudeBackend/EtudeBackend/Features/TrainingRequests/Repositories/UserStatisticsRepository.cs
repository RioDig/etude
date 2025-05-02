using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Shared.Data;
using EtudeBackend.Shared.Data.Repositories;

namespace EtudeBackend.Features.TrainingRequests.Repositories
{
    public class UserStatisticsRepository : Repository<UserStatistics>, IUserStatisticsRepository
    {
        public UserStatisticsRepository(ApplicationDbContext context) : base(context)
        {
        }

        public Task<List<UserStatistics>> GetByCourseIdAsync(Guid courseId)
        {
            return _dbSet
                .Where(us => us.CourseId == courseId)
                .ToListAsync();
        }

        public Task<List<UserStatistics>> GetByUserIdAsync(string userId) // Изменяем тип на string
        {
            return _dbSet
                .Where(us => us.UserId == userId)
                .ToListAsync();
        }

        public Task<UserStatistics?> GetByUserAndCourseIdAsync(string userId, Guid courseId) // Изменяем тип на string
        {
            return _dbSet
                .Where(us => us.UserId == userId && us.CourseId == courseId)
                .FirstOrDefaultAsync();
        }
    }
}